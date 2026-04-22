import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Modal, Pressable
} from 'react-native';

interface Game { id: string; title: string; genre: string; rating: string; image: string; }

const recomendedGames: Game[] = [
  { id: '1', title: 'Elden Ring', genre: 'Ação, Aventura', rating: '5.1', image: 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png' },
  { id: '2', title: 'Bloodborne', genre: 'Ação, Aventura', rating: '4.9', image: 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/VBBtA3zAVxL0vK1R8z0G6zDO.png' },
];

const trendingGames: Game[] = [
  { id: '3', title: "Tom Clancy's: The Division 2", genre: 'TPS, Ação', rating: '4.95', image: 'https://image.api.playstation.com/vulcan/ap/rnd/202305/0914/563e461f30d06cc1af5cf34676100ee9c51a02796e624c96.png' },
  { id: '4', title: 'Absolum', genre: "Beat 'em up, Ação", rating: '4.6', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2855140/capsule_616x353.jpg' },
];

const gameTags: string[] = ['Exploração', 'RPG', 'Aventura', 'FPS', 'TPS', 'Estratégia', 'MMO'];

export default function HomeScreen() {
  const [isTagsVisible, setIsTagsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}><Text style={styles.logoText}>🎮</Text></View>
          <View style={styles.searchContainer}>
            <TextInput style={styles.searchInput} placeholder="Digite o jogo/gênero" placeholderTextColor="#888" />
          </View>
          <TouchableOpacity style={styles.profileIcon}><Text style={{color: '#fff'}}>👤</Text></TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMENDAÇÕES</Text>
          <Text style={styles.sectionSubtitle}>Insights de seu histórico do Steam</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {recomendedGames.map((game) => (
              <View key={game.id} style={styles.card}>
                <Image source={{ uri: game.image }} style={styles.cardImage} />
                <View style={styles.cardFooter}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
                    <Text style={styles.gameGenre}>{game.genre} ⭐ {game.rating}</Text>
                  </View>
                  <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>Quero!</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EM ALTA</Text>
          <Text style={styles.sectionSubtitle}>Tendências Globais (SQL Sync)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {trendingGames.map((game) => (
              <View key={game.id} style={styles.card}>
                <Image source={{ uri: game.image }} style={styles.cardImage} />
                <View style={styles.cardFooter}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
                    <Text style={styles.gameGenre}>{game.genre} ⭐ {game.rating}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ height: 80 }} /> 
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setIsTagsVisible(true)}>
        <Text style={styles.fabText}>TAGS</Text>
      </TouchableOpacity>

      <Modal visible={isTagsVisible} animationType="slide" transparent={true} onRequestClose={() => setIsTagsVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsTagsVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filtrar por Tags</Text>
            <View style={styles.tagsContainer}>
              {gameTags.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  logoPlaceholder: { width: 40, height: 40, borderWidth: 2, borderColor: '#00D394', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 20 },
  searchContainer: { flex: 1, backgroundColor: '#EAEAEA', borderRadius: 20, height: 40, justifyContent: 'center', paddingHorizontal: 16 },
  searchInput: { color: '#333', fontSize: 14, padding: 0 },
  profileIcon: { width: 40, height: 40, backgroundColor: '#3A4A5A', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  section: { marginTop: 20, paddingLeft: 16 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  sectionSubtitle: { color: '#8A99A8', fontSize: 14, marginBottom: 12 },
  carousel: { paddingRight: 16 },
  card: { width: 220, marginRight: 16, backgroundColor: '#161C24', borderRadius: 12, overflow: 'hidden' },
  cardImage: { width: '100%', height: 220, resizeMode: 'cover' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  cardInfo: { flex: 1 },
  gameTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  gameGenre: { color: '#8A99A8', fontSize: 12, marginTop: 4 },
  actionButton: { backgroundColor: '#3A4A5A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginLeft: 8 },
  actionButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: '#0A0E17', borderWidth: 1, borderColor: '#00D394', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 24, elevation: 5 },
  fabText: { color: '#00D394', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#161C24', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 300 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#3A4A5A', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  tagBadge: { backgroundColor: '#3A4A5A', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#00D394' },
  tagText: { color: '#FFF', fontSize: 14 }
});