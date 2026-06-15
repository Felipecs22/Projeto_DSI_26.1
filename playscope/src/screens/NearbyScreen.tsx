/**
 * NearbyScreen - tela do mapa usando OpenStreetMap (gratuito, sem API key).
 *
 * ACAO NECESSARIA - instalar dependencias antes de rodar:
 *
 *    npx expo install react-native-maps
 *    npx expo install expo-location
 *    npx expo install @react-native-community/slider
 *
 * Nao e necessario nenhuma chave de API ou configuracao externa.
 * O OpenStreetMap e completamente gratuito e de uso livre.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { PlacesService } from '../services/PlacesService';
import { GamingPlace, type PlaceType } from '../models/GamingPlace';

const RADIUS_MIN     = 500;
const RADIUS_MAX     = 5000;
const RADIUS_DEFAULT = 2000;

const FILTERS: { type: PlaceType; label: string; icon: string }[] = [
  { type: 'store',    label: 'Lojas de Games', icon: 'storefront-outline' },
  { type: 'lanhouse', label: 'LAN Houses',     icon: 'desktop-outline'    },
];

export default function NearbyScreen() {
  const { colors, darkMode } = useTheme();
  const styles        = createStyles(colors);
  const placesService = PlacesService.getInstance();
  const mapRef        = useRef<MapView>(null);

  const [location, setLocation]               = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [places, setPlaces]                   = useState<GamingPlace[]>([]);
  const [activeType, setActiveType]           = useState<PlaceType>('store');
  const [radius, setRadius]                   = useState(RADIUS_DEFAULT);
  const [loading, setLoading]                 = useState(true);
  const [selectedPlace, setSelectedPlace]     = useState<GamingPlace | null>(null);

  // Solicitar permissao de localizacao ao abrir a tela
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  // Buscar locais sempre que localizacao, raio ou filtro mudarem
  const fetchPlaces = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setSelectedPlace(null);

    try {
      const results = await placesService.getNearby(
        location.lat,
        location.lng,
        radius,
        activeType,
      );
      setPlaces(results);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [location, radius, activeType]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Tela exibida quando o usuario nega a permissao de localizacao
  if (permissionDenied) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={48} color={colors.TEXT_MUTED} />
          <Text style={styles.centeredTitle}>Localizacao necessaria</Text>
          <Text style={styles.centeredText}>
            Para encontrar lojas e LAN houses proximas, o Playscope
            precisa de acesso a sua localizacao.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => Linking.openSettings()}>
            <Text style={styles.btnText}>Abrir configuracoes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Tela de carregamento enquanto obtem a localizacao
  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.centered}>
          <ActivityIndicator color={colors.ACCENT} size="large" />
          <Text style={styles.centeredText}>Obtendo localizacao...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Tela principal com mapa
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.title}>Mapa</Text>
        <Text style={styles.subtitle}>Encontre locais de jogos perto de voce</Text>
      </View>

      <View style={styles.sliderBox}>
        <Text style={styles.sliderLabel}>
          Raio de busca: {(radius / 1000).toFixed(1)} km
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={RADIUS_MIN}
          maximumValue={RADIUS_MAX}
          step={500}
          value={radius}
          minimumTrackTintColor={colors.ACCENT}
          maximumTrackTintColor={colors.BORDER}
          thumbTintColor={colors.ACCENT}
          onSlidingComplete={(value) => setRadius(Math.round(value))}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude:       location.lat,
          longitude:      location.lng,
          latitudeDelta:  0.05,
          longitudeDelta: 0.05,
        }}
      >
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          maximumZ={19}
          tileSize={256}
        />

        <Marker
          coordinate={{ latitude: location.lat, longitude: location.lng }}
          title="Voce esta aqui"
          pinColor={colors.ACCENT}
        />

        {places.map((place) => (
          <Marker
            key={place.placeId}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.address}
            pinColor={activeType === 'store' ? '#4A90E2' : '#E2844A'}
            onPress={() => setSelectedPlace(place)}
          />
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.ACCENT} size="small" />
        </View>
      )}

      {selectedPlace && (
        <View style={styles.placeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.placeName}>{selectedPlace.name}</Text>
            <Text style={styles.placeAddress}>{selectedPlace.address}</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedPlace(null)}>
            <Ionicons name="close" size={20} color={colors.TEXT_MUTED} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottom}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.type}
              style={[styles.filterBtn, activeType === f.type && styles.filterBtnActive]}
              onPress={() => setActiveType(f.type)}
            >
              <Ionicons
                name={f.icon as any}
                size={14}
                color={activeType === f.type ? colors.BG_PRIMARY : colors.TEXT_MUTED}
              />
              <Text style={[
                styles.filterLabel,
                activeType === f.type && styles.filterLabelActive,
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}

          {!loading && (
            <Text style={styles.resultsCount}>
              {places.length} {places.length === 1 ? 'local' : 'locais'}
            </Text>
          )}
        </View>

        <Text style={styles.attribution}>© OpenStreetMap contributors © CARTO</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.BG_PRIMARY },

    header:    { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title:     { fontSize: 22, fontWeight: '700', color: colors.TEXT_PRIMARY },
    subtitle:  { fontSize: 13, color: colors.TEXT_MUTED, marginTop: 2 },

    sliderBox:   { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: colors.BG_SECONDARY },
    sliderLabel: { fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 2 },
    slider:      { width: '100%', height: 32 },

    map: { flex: 1 },

    loadingOverlay: {
      position:        'absolute',
      top:             '50%',
      alignSelf:       'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding:         12,
      borderRadius:    20,
    },

    placeCard: {
      position:        'absolute',
      bottom:          90,
      left:            16,
      right:           16,
      flexDirection:   'row',
      alignItems:      'flex-start',
      backgroundColor: colors.BG_CARD,
      borderRadius:    14,
      padding:         14,
      borderWidth:     1,
      borderColor:     colors.BORDER,
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 4 },
      shadowOpacity:   0.25,
      shadowRadius:    8,
      elevation:       6,
    },
    placeName:    { fontSize: 15, fontWeight: '700', color: colors.TEXT_PRIMARY },
    placeAddress: { fontSize: 12, color: colors.TEXT_MUTED, marginTop: 2 },

    bottom: {
      backgroundColor: colors.BG_SECONDARY,
      borderTopWidth:  1,
      borderTopColor:  colors.BORDER,
    },
    filterRow: {
      flexDirection:     'row',
      alignItems:        'center',
      gap:               8,
      paddingHorizontal: 16,
      paddingVertical:   12,
    },
    filterBtn: {
      flexDirection:     'row',
      alignItems:        'center',
      gap:               6,
      paddingVertical:   7,
      paddingHorizontal: 12,
      borderRadius:      20,
      borderWidth:       1,
      borderColor:       colors.BORDER,
      backgroundColor:   colors.BG_CARD,
    },
    filterBtnActive:   { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
    filterLabel:       { fontSize: 12, fontWeight: '600', color: colors.TEXT_MUTED },
    filterLabelActive: { color: colors.BG_PRIMARY },
    resultsCount:      { marginLeft: 'auto', fontSize: 12, color: colors.TEXT_MUTED },

    attribution: {
      fontSize:      10,
      color:         colors.TEXT_MUTED,
      textAlign:     'center',
      paddingBottom: 6,
    },

    centered: {
      flex:           1,
      justifyContent: 'center',
      alignItems:     'center',
      padding:        32,
      gap:            16,
    },
    centeredTitle: { fontSize: 18, fontWeight: '700', color: colors.TEXT_PRIMARY, textAlign: 'center' },
    centeredText:  { fontSize: 14, color: colors.TEXT_MUTED, textAlign: 'center', lineHeight: 20 },
    btn: {
      marginTop:         8,
      paddingVertical:   12,
      paddingHorizontal: 24,
      backgroundColor:   colors.ACCENT,
      borderRadius:      12,
    },
    btnText: { color: colors.BG_PRIMARY, fontWeight: '700', fontSize: 14 },
  });