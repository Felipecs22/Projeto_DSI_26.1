import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { gameTags } from '../constants/data';
import { GameService } from '../services/GameService';
import { LibraryService } from '../services/LibraryService';
import { ReviewService } from '../services/ReviewService';
import { Game } from '../models/Game';
import { Review } from '../models/Review';
import { GameStatus } from '../models/UserGame';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoIcon from '../components/LogoIcon';
import SearchBar from '../components/SearchBar';
import SectionTitle from '../components/SectionTitle';
import GameCardHorizontal from '../components/GameCardHorizontal';
import StatusModal from '../components/StatusModal';
import GameDetailsModal from '../components/GameDetailsModal';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);

  const gameService = GameService.getInstance();
  const libraryService = LibraryService.getInstance();
  const reviewService = ReviewService.getInstance();

  const [search, setSearch] = useState('');
  const [tagsVisible, setTagsVisible] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<Game[]>([]);
  const [trending, setTrending] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [gameReviews, setGameReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [libraryStatuses, setLibraryStatuses] = useState<Record<string, GameStatus>>({});

  useEffect(() => {
    setRecommended(gameService.getRecommended(12));
    setTrending(gameService.getTrending(12));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      setSearchResults(gameService.search(search));
      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!user) {
      setLibraryStatuses({});
      return;
    }

    loadLibraryStatuses();
  }, [user]);

  const loadLibraryStatuses = async () => {
    if (!user) return;

    try {
      const library = await libraryService.getUserLibrary(user.uid);
      setLibraryStatuses(
        library.reduce<Record<string, GameStatus>>((acc, item) => {
          acc[item.gameId] = item.status;
          return acc;
        }, {}),
      );
    } catch {
      setLibraryStatuses({});
    }
  };

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

  const handleTagSelect = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
    setTagsVisible(false);

    if (tag !== activeTag) {
      setSearch(tag);
    } else {
      setSearch('');
    }
  };

  const handleSaveStatus = async (status: GameStatus) => {
    if (!selectedGame || !user) {
      Alert.alert('Conta necessária', 'Faça login para salvar jogos na sua biblioteca.');
      return;
    }

    try {
      await libraryService.saveGame(user, selectedGame, status);
      await loadLibraryStatuses();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível atualizar a biblioteca.');
    }
  };

  const handleRemoveGame = async () => {
    if (!selectedGame || !user) return;

    try {
      await libraryService.removeGame(user.uid, selectedGame.id);
      await loadLibraryStatuses();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível remover o jogo.');
    }
  };

  const handleSaveReview = async (rating: number, text: string) => {
    if (!selectedGame || !user) {
      Alert.alert('Conta necessária', 'Faça login para publicar reviews.');
      return;
    }

    setSavingReview(true);

    try {
      await reviewService.saveReview(user, selectedGame, rating, text);
      await loadGameContext(selectedGame);
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível salvar sua review.');
    } finally {
      setSavingReview(false);
    }
  };

  const displayRecommended = activeTag
    ? gameService.getByGenre(activeTag, 12)
    : recommended;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />

      <View style={styles.header}>
        <LogoIcon size={42} />
        <SearchBar value={search} onChangeText={setSearch} />
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {search.trim() ? (
        <View style={styles.searchOverlay}>
          {searching ? (
            <ActivityIndicator color={colors.ACCENT} style={{ marginTop: 24 }} />
          ) : searchResults.length === 0 ? (
            <Text style={styles.emptySearch}>Nenhum resultado para "{search}"</Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(game) => game.id}
              contentContainerStyle={{ padding: 16 }}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <GameCardHorizontal
                  game={item}
                  style={{ width: '47%', marginRight: 0 }}
                  onPress={loadGameContext}
                />
              )}
            />
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <SectionTitle
              title="Recomendações"
              subtitle={activeTag ? `Tag: ${activeTag}` : 'Com base nas avaliações Steam'}
            />
            <FlatList
              horizontal
              data={displayRecommended}
              keyExtractor={(game) => game.id}
              contentContainerStyle={styles.carousel}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <GameCardHorizontal
                  game={item}
                  onPress={loadGameContext}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <SectionTitle title="Em Alta" subtitle="Jogos populares do catálogo local" />
            <FlatList
              horizontal
              data={trending}
              keyExtractor={(game) => game.id}
              contentContainerStyle={styles.carousel}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <GameCardHorizontal game={item} onPress={loadGameContext} />
              )}
            />
          </View>

          <View style={styles.statsBar}>
            <Text style={styles.statsText}>🎮 {gameService.count} jogos no catálogo</Text>
          </View>

          <View style={styles.tagsArea}>
            <TouchableOpacity style={styles.tagsBtn} onPress={() => setTagsVisible(true)}>
              <Text style={styles.tagsBtnText}>
                {activeTag ? `🏷️ ${activeTag}` : 'Tags'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      <Modal visible={tagsVisible} transparent animationType="slide" onRequestClose={() => setTagsVisible(false)} statusBarTranslucent>
        <Pressable style={styles.modalBackdrop} onPress={() => setTagsVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filtrar por Tags</Text>
            <View style={styles.tagsGrid}>
              {gameTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, activeTag === tag && styles.tagChipActive]}
                  onPress={() => handleTagSelect(tag)}
                >
                  <Text style={[styles.tagChipText, activeTag === tag && styles.tagChipTextActive]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setTagsVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <GameDetailsModal
        visible={detailsVisible}
        game={selectedGame}
        libraryStatus={selectedGame ? libraryStatuses[selectedGame.id] : undefined}
        reviewSummary={reviewSummary}
        reviews={gameReviews}
        userReview={userReview}
        loading={detailsLoading}
        savingReview={savingReview}
        onClose={() => setDetailsVisible(false)}
        onOpenStatusModal={() => setStatusVisible(true)}
        onSaveReview={handleSaveReview}
      />

      <StatusModal
        visible={statusVisible}
        game={selectedGame}
        currentStatus={selectedGame ? libraryStatuses[selectedGame.id] : undefined}
        onClose={() => setStatusVisible(false)}
        onSelect={(status) => handleSaveStatus(status as GameStatus)}
        onRemove={handleRemoveGame}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BG_PRIMARY },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.BG_CARD,
    borderWidth: 1.5,
    borderColor: colors.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: { fontSize: 16 },
  section: { marginTop: 20 },
  carousel: { paddingLeft: 16, paddingRight: 8 },
  statsBar: { marginTop: 16, alignItems: 'center' },
  statsText: { color: colors.TEXT_MUTED, fontSize: 12 },
  tagsArea: { marginTop: 12, alignItems: 'center' },
  tagsBtn: {
    borderWidth: 1.5,
    borderColor: colors.ACCENT,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 8,
  },
  tagsBtnText: { color: colors.ACCENT, fontWeight: '600', fontSize: 14 },
  searchOverlay: { flex: 1, backgroundColor: colors.BG_PRIMARY },
  emptySearch: {
    color: colors.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.SCRIM,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.BG_MODAL,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: colors.BORDER,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.BORDER_LIGHT,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  tagChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.BG_CARD,
    borderWidth: 1,
    borderColor: colors.BORDER,
  },
  tagChipActive: {
    backgroundColor: colors.ACCENT,
    borderColor: colors.ACCENT,
  },
  tagChipText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '500',
  },
  tagChipTextActive: {
    color: colors.BG_PRIMARY,
    fontWeight: '700',
  },
  modalCloseBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: colors.TEXT_MUTED,
    fontSize: 15,
  },
});
