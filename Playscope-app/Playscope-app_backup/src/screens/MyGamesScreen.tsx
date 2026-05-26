import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import CategoryButton from '../components/CategoryButton';
import GameCard from '../components/GameCard';
import GameStatusButton from '../components/GameStatusButton';
import StatusModal from '../components/StatusModal';
import { useAuth } from '../context/AuthContext';
import { LibraryRepository } from '../repositories/LibraryRepository';
import { UserGame, type GameStatus } from '../models/UserGame';
import { GameService } from '../services/GameService';
import { Game } from '../models/Game';

const FILTERS = [
  { id: 'todos',       label: 'Todos'       },
  { id: 'jogados',     label: 'Concluídos'  },
  { id: 'jogando',     label: 'Jogando'     },
  { id: 'pausados',    label: 'Pausados'    },
  { id: 'abandonados', label: 'Abandonados' },
  { id: 'fila',        label: 'Na Fila'     },
];

const STATUS_SUBTITLES: Record<string, string> = {
  todos:       'Sua "biblioteca de alexandria" pessoal.',
  jogados:     'Na estante de troféus.',
  jogando:     'Vivendo a jornada.',
  pausados:    'Volto já! (Algum dia)',
  abandonados: 'Joguei mas... não foi pra mim.',
  fila:        'Próximo!',
};

const SECTION_TITLES: Record<string, string> = {
  todos: 'Sua Biblioteca', jogados: 'Concluídos', jogando: 'Jogando',
  pausados: 'Pausados', abandonados: 'Abandonados', fila: 'Na Fila',
};

export default function MyGamesScreen() {
  const { user }   = useAuth();
  const libraryRepo = new LibraryRepository();
  const gameSvc     = GameService.getInstance();

  const [filter,       setFilter]       = useState('todos');
  const [library,      setLibrary]      = useState<UserGame[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Load from Firestore if logged in, else fall back to a demo from catalog
  const loadLibrary = useCallback(async () => {
    if (!user) {
      // Demo mode: show first 8 trending games as "jogando"
      const demo = gameSvc.getTrending(8).map(g => new UserGame({
        userId: 'demo', gameId: g.id, gameName: g.name,
        gameImage: g.image, gameGenres: g.genres, status: 'jogando',
      }));
      setLibrary(demo);
      return;
    }
    setLoading(true);
    try {
      const items = await libraryRepo.getUserLibrary(user.uid);
      setLibrary(items);
    } catch {
      setLibrary([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (!selectedGame) return;
    if (!user) {
      // demo mode: update local only
      setLibrary(prev => prev.map(g =>
        g.gameId === selectedGame.id ? { ...g, status: newStatus } as UserGame : g
      ));
      setSelectedGame(null);
      return;
    }
    try {
      const existing = library.find(g => g.gameId === selectedGame.id);
      if (existing) {
        await libraryRepo.updateStatus(user.uid, selectedGame.id, newStatus);
      } else {
        const userGame = new UserGame({
          userId: user.uid, gameId: selectedGame.id,
          gameName: selectedGame.name, gameImage: selectedGame.image,
          gameGenres: selectedGame.genres, status: newStatus,
        });
        await libraryRepo.upsert(userGame);
      }
      await loadLibrary();
    } catch {}
    setSelectedGame(null);
  };

  const filtered = filter === 'todos'
    ? library
    : library.filter(g => g.status === filter);

  // Convert UserGame → Game shape for GameCard
  const toGameShape = (ug: UserGame): Game => gameSvc.findById(ug.gameId) ?? Game.fromJSON({
    id: ug.gameId, appId: 0, name: ug.gameName, genres: ug.gameGenres,
    rating: 0, ratingLabel: '', reviews: 0, price: 0, priceLabel: '',
    steamRating: '', releaseDate: '', image: ug.gameImage, status: ug.status,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{SECTION_TITLES[filter]}</Text>
          <Text style={styles.sectionSubtitle}>{STATUS_SUBTITLES[filter]}</Text>
        </View>
        <GameStatusButton label="Status" onPress={() => {}} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <CategoryButton key={f.id} label={f.label} active={filter === f.id} onPress={() => setFilter(f.id)} />
        ))}
      </ScrollView>

      {loading
        ? <ActivityIndicator color={Colors.ACCENT} style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={filtered}
            keyExtractor={g => g.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎮</Text>
                <Text style={styles.emptyText}>Nenhum jogo nesta categoria.</Text>
                <Text style={styles.emptyHint}>
                  {!user ? 'Faça login para salvar sua biblioteca.' : 'Adicione jogos pela tela Início.'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <GameCard game={toGameShape(item)} onPress={(g) => setSelectedGame(g)} />
            )}
          />
        )
      }

      <StatusModal
        visible={!!selectedGame}
        game={selectedGame}
        currentStatus={selectedGame ? library.find(g => g.gameId === selectedGame.id)?.status : undefined}
        onClose={() => setSelectedGame(null)}
        onSelect={(s) => handleStatusChange(s as GameStatus)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: Colors.BG_PRIMARY },
  sectionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle:    { color: Colors.TEXT_PRIMARY, fontSize: 22, fontWeight: '700' },
  sectionSubtitle: { color: Colors.ACCENT, fontSize: 12, marginTop: 2 },
  filterRow:       { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  grid:            { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 },
  emptyState:      { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyIcon:       { fontSize: 40, marginBottom: 12 },
  emptyText:       { color: Colors.TEXT_MUTED, fontSize: 15 },
  emptyHint:       { color: Colors.TEXT_MUTED, fontSize: 12, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
});
