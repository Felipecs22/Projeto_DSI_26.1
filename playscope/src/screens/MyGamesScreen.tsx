import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryButton from '../components/CategoryButton';
import GameCard from '../components/GameCard';
import GameStatusButton from '../components/GameStatusButton';
import StatusModal from '../components/StatusModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LibraryService } from '../services/LibraryService';
import { UserGame, type GameStatus } from '../models/UserGame';
import { GameService } from '../services/GameService';
import { Game } from '../models/Game';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'jogados', label: 'Concluídos' },
  { id: 'jogando', label: 'Jogando' },
  { id: 'pausados', label: 'Pausados' },
  { id: 'abandonados', label: 'Abandonados' },
  { id: 'fila', label: 'Na Fila' },
];

const STATUS_SUBTITLES: Record<string, string> = {
  todos: 'Sua biblioteca pessoal de jogos',
  jogados: 'Na estante de troféus.',
  jogando: 'Vivendo a jornada.',
  pausados: 'Volto já! (Algum dia)',
  abandonados: 'Joguei mas... não foi pra mim.',
  fila: 'Próximo!',
};

const SECTION_TITLES: Record<string, string> = {
  todos: 'Sua Biblioteca',
  jogados: 'Concluídos',
  jogando: 'Jogando',
  pausados: 'Pausados',
  abandonados: 'Abandonados',
  fila: 'Na Fila',
};

export default function MyGamesScreen() {
  const { user } = useAuth();
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);

  const libraryService = LibraryService.getInstance();
  const gameService = GameService.getInstance();

  const [filter, setFilter] = useState('todos');
  const [library, setLibrary] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const loadLibrary = useCallback(async () => {
    if (!user) {
      setLibrary([]);
      return;
    }

    setLoading(true);
    try {
      const items = await libraryService.getUserLibrary(user.uid);
      setLibrary(items);
    } catch {
      setLibrary([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (!selectedGame || !user) return;

    try {
      await libraryService.saveGame(user, selectedGame, newStatus);
      await loadLibrary();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível atualizar o jogo.');
    } finally {
      setSelectedGame(null);
    }
  };

  const handleRemoveGame = async () => {
    if (!selectedGame || !user) return;

    try {
      await libraryService.removeGame(user.uid, selectedGame.id);
      await loadLibrary();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível remover o jogo.');
    } finally {
      setSelectedGame(null);
    }
  };

  const filtered = filter === 'todos'
    ? library
    : library.filter((item) => item.status === filter);

  const toGameShape = (item: UserGame): Game => (
    gameService.findById(item.gameId) ?? Game.fromJSON({
      id: item.gameId,
      appId: 0,
      name: item.gameName,
      genres: item.gameGenres,
      rating: 0,
      ratingLabel: '',
      reviews: 0,
      price: 0,
      priceLabel: '',
      steamRating: '',
      releaseDate: '',
      image: item.gameImage,
      tags: item.gameGenres.split(',').map((genre) => genre.trim()),
      description: '',
      status: item.status,
    })
  );

  const selectedStatus = selectedGame
    ? library.find((item) => item.gameId === selectedGame.id)?.status
    : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{SECTION_TITLES[filter]}</Text>
          <Text style={styles.sectionSubtitle}>{STATUS_SUBTITLES[filter]}</Text>
        </View>
        <GameStatusButton label="Atualizar" onPress={loadLibrary} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((item) => (
          <CategoryButton
            key={item.id}
            label={item.label}
            active={filter === item.id}
            onPress={() => setFilter(item.id)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.ACCENT} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={(
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎮</Text>
              <Text style={styles.emptyText}>Nenhum jogo nesta categoria.</Text>
              <Text style={styles.emptyHint}>
                {user ? 'Adicione jogos pela tela Início.' : 'Entre na sua conta para sincronizar a biblioteca.'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <GameCard game={toGameShape(item)} onPress={(game) => setSelectedGame(game)} />
          )}
        />
      )}

      <StatusModal
        visible={!!selectedGame}
        game={selectedGame}
        currentStatus={selectedStatus}
        onClose={() => setSelectedGame(null)}
        onSelect={(status) => handleStatusChange(status as GameStatus)}
        onRemove={handleRemoveGame}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BG_PRIMARY },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: colors.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.ACCENT,
    fontSize: 12,
    marginTop: 2,
  },
  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  list: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.TEXT_MUTED,
    fontSize: 15,
  },
  emptyHint: {
    color: colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});