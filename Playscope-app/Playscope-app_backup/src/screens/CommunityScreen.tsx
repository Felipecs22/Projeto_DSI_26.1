import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  StatusBar, FlatList, Image, TouchableOpacity,
} from 'react-native';
import Colors from '../constants/colors';
import { communityReviews } from '../constants/data';
import { GameService } from '../services/GameService';
import { Game } from '../models/Game';
import SectionTitle from '../components/SectionTitle';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';

/* ─── Community Game Card ────────────────────────────────────────────────── */
function CommunityGameCard({ game }: { game: Game }) {
  const [err, setErr] = useState(false);
  return (
    <TouchableOpacity style={styles.gameCard} activeOpacity={0.85}>
      <View style={styles.gameThumb}>
        {game.image && !err ? (
          <Image
            source={{ uri: game.image }}
            style={styles.gameImage}
            resizeMode="cover"
            onError={() => setErr(true)}
          />
        ) : (
          <View style={styles.gamePlaceholder}>
            <Text style={styles.gamePlaceholderText} numberOfLines={2}>{game.name}</Text>
          </View>
        )}
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.gameName} numberOfLines={2}>{game.name}</Text>
        <Text style={styles.gameGenres} numberOfLines={1}>{game.genres}</Text>
        <View style={styles.gameRatingRow}>
          <StarRating rating={game.rating} label={game.ratingLabel} />
          <Text style={styles.gameReviews}>{game.reviewsFormatted} reviews</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ─── Screen ─────────────────────────────────────────────────────────────── */
export default function CommunityScreen() {
  const [topGames, setTopGames] = useState<Game[]>([]);

  useEffect(() => {
    // Usa GameService: top jogos mais bem avaliados do catálogo Steam real
    const svc = GameService.getInstance();
    setTopGames(svc.getRecommended(8));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* A Comunidade tem jogado */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>A Comunidade tem jogado</Text>
            <Text style={styles.communityIcon}>👥</Text>
          </View>
          <FlatList
            horizontal
            data={topGames}
            keyExtractor={g => g.id}
            contentContainerStyle={styles.carousel}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <CommunityGameCard game={item} />}
          />
        </View>

        {/* Reviews recentes */}
        <View style={styles.section}>
          <SectionTitle title="Reviews Recentes" />
          {communityReviews.map(r => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: Colors.BG_PRIMARY },
  section:              { marginTop: 20 },
  titleRow:             { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:         { color: Colors.TEXT_PRIMARY, fontSize: 21, fontWeight: '700' },
  communityIcon:        { fontSize: 20 },
  carousel:             { paddingLeft: 16, paddingRight: 8 },
  gameCard:             { width: 160, marginRight: 12 },
  gameThumb:            { width: '100%', aspectRatio: 3/4, borderRadius: 10, overflow: 'hidden', backgroundColor: Colors.BG_CARD },
  gameImage:            { width: '100%', height: '100%' },
  gamePlaceholder:      { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 8 },
  gamePlaceholderText:  { color: Colors.TEXT_MUTED, fontSize: 11, textAlign: 'center' },
  gameInfo:             { marginTop: 6, paddingHorizontal: 2 },
  gameName:             { color: Colors.TEXT_PRIMARY, fontSize: 13, fontWeight: '600' },
  gameGenres:           { color: Colors.TEXT_MUTED, fontSize: 11, marginTop: 2, marginBottom: 3 },
  gameRatingRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameReviews:          { color: Colors.TEXT_MUTED, fontSize: 10 },
});
