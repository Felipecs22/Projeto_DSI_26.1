import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, ScrollView, StyleSheet,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import CategoryButton from '../components/CategoryButton';
import GameCard from '../components/GameCard';
import GameStatusButton from '../components/GameStatusButton';
import GameDetailsModal from '../components/GameDetailsModal';
import StatusModal from '../components/StatusModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LibraryService } from '../services/LibraryService';
import { ReviewService } from '../services/ReviewService';
import { UserGame, type GameStatus } from '../models/UserGame';
import { GameService } from '../services/GameService';
import { Game } from '../models/Game';
import { Review } from '../models/Review';

const FILTERS = [
  { id: 'todos',       label: 'Todos'       },
  { id: 'jogados',     label: 'Concluídos'  },
  { id: 'jogando',     label: 'Jogando'     },
  { id: 'pausados',    label: 'Pausados'    },
  { id: 'abandonados', label: 'Abandonados' },
  { id: 'fila',        label: 'Na Fila'     },
];

const STATUS_SUBTITLES: Record<string, string> = {
  todos:       'Sua biblioteca sincronizada com o Firebase.',
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

const libraryService = LibraryService.getInstance();
const reviewService  = ReviewService.getInstance();

export default function MyGamesScreen() {
  const { user }     = useAuth();
  const { colors, darkMode } = useTheme();
  const gameService  = GameService.getInstance();
  const styles       = createStyles(colors);

  const [filter,        setFilter]        = useState('todos');
  const [library,       setLibrary]       = useState<UserGame[]>([]);
  const [loading,       setLoading]       = useState(false);

  // Game Details modal state
  const [selectedGame,    setSelectedGame]    = useState<Game | null>(null);
  const [detailsVisible,  setDetailsVisible]  = useState(false);
  const [statusVisible,   setStatusVisible]   = useState(false);
  const [detailsLoading,  setDetailsLoading]  = useState(false);
  const [savingReview,    setSavingReview]     = useState(false);
  const [gameReviews,     setGameReviews]      = useState<Review[]>([]);
  const [userReview,      setUserReview]       = useState<Review | null>(null);
  const [reviewSummary,   setReviewSummary]    = useState({ averageRating: 0, totalReviews: 0 });
  const [libraryStatuses, setLibraryStatuses]  = useState<Record<string, GameStatus>>({});

  const loadLibrary = useCallback(async () => {
    if (!user) { setLibrary([]); return; }
    setLoading(true);
    try {
      const items = await libraryService.getUserLibrary(user.uid);
      setLibrary(items);
      setLibraryStatuses(
        items.reduce<Record<string, GameStatus>>((acc, item) => {
          acc[item.gameId] = item.status;
          return acc;
        }, {}),
      );
    } catch {
      setLibrary([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  const loadGameContext = async (game: Game) => {
    setSelectedGame(game);
    setDetailsVisible(true);
    setDetailsLoading(true);
    try {
      const [reviews, ownReview] = await Promise.all([
        reviewService.getGameReviews(game.id),
        user ? reviewService.getUserGameReview(user.uid, game.id) : Promise.resolve(null),
      ]);
      setGameReviews(reviews);
      setUserReview(ownReview);
      setReviewSummary(reviewService.getSummary(reviews));
    } catch {
      setGameReviews([]);
      setUserReview(null);
      setReviewSummary({ averageRating: 0, totalReviews: 0 });
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSaveStatus = async (status: GameStatus) => {
    if (!selectedGame || !user) return;
    try {
      await libraryService.saveGame(user, selectedGame, status);
      await loadLibrary();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível atualizar.');
    }
  };

  const handleRemoveGame = async () => {
    if (!selectedGame || !user) return;
    try {
      await libraryService.removeGame(user.uid, selectedGame.id);
      await loadLibrary();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível remover.');
    }
  };

  const handleSaveReview = async (rating: number, text: string) => {
    if (!selectedGame || !user) return;
    setSavingReview(true);
    try {
      await reviewService.saveReview(user, selectedGame, rating, text);
      await loadGameContext(selectedGame);
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível salvar a review.');
    } finally {
      setSavingReview(false);
    }
  };

  const filtered = filter === 'todos'
    ? library
    : library.filter((item) => item.status === filter);

  const toGameShape = (item: UserGame): Game =>
    gameService.findById(item.gameId) ?? Game.fromJSON({
      id: item.gameId, appId: 0, name: item.gameName, genres: item.gameGenres,
      rating: 0, ratingLabel: '', reviews: 0, price: 0, priceLabel: '',
      steamRating: '', releaseDate: '', image: item.gameImage,
      tags: item.gameGenres.split(',').map(g => g.trim()),
      description: '', status: item.status,
    });

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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
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
                {user ? 'Adicione jogos pela tela Início.' : 'Entre na sua conta para ver a biblioteca.'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <GameCard game={toGameShape(item)} onPress={loadGameContext} />
          )}
        />
      )}

      {/* GameDetailsModal — ver detalhes, mudar status, escrever review */}
      <GameDetailsModal
        visible={detailsVisible}
        game={selectedGame}
        libraryStatus={selectedGame ? libraryStatuses[selectedGame.id] : undefined}
        reviewSummary={reviewSummary}
        reviews={gameReviews}
        userReview={userReview}
        loading={detailsLoading}
        savingReview={savingReview}
        onClose={() => { setDetailsVisible(false); setSelectedGame(null); }}
        onOpenStatusModal={() => setStatusVisible(true)}
        onSaveReview={handleSaveReview}
      />

      <StatusModal
        visible={statusVisible}
        game={selectedGame}
        currentStatus={selectedGame ? libraryStatuses[selectedGame.id] : undefined}
        onClose={() => setStatusVisible(false)}
        onSelect={(status) => { handleSaveStatus(status as GameStatus); setStatusVisible(false); }}
        onRemove={() => { handleRemoveGame(); setDetailsVisible(false); setStatusVisible(false); setSelectedGame(null); }}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container:       { flex: 1, backgroundColor: colors.BG_PRIMARY },
  sectionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle:    { color: colors.TEXT_PRIMARY, fontSize: 22, fontWeight: '700' },
  sectionSubtitle: { color: colors.ACCENT, fontSize: 12, marginTop: 2 },
  filterRow:       { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  grid:            { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24, flexGrow: 1 },
  emptyState:      { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyIcon:       { fontSize: 40, marginBottom: 12 },
  emptyText:       { color: colors.TEXT_MUTED, fontSize: 15 },
  emptyHint:       { color: colors.TEXT_MUTED, fontSize: 12, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
});