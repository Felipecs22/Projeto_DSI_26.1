import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  StatusBar, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { GameService } from '../services/GameService';
import { LibraryService } from '../services/LibraryService';
import { ReviewService } from '../services/ReviewService';
import { Game } from '../models/Game';
import { Review } from '../models/Review';
import { GameStatus } from '../models/UserGame';
import SectionTitle from '../components/SectionTitle';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GameDetailsModal from '../components/GameDetailsModal';
import StatusModal from '../components/StatusModal';

/* ─── Community Game Card ────────────────────────────────────────────────── */
function CommunityGameCard({ game, onPress }: { game: Game; onPress: (game: Game) => void }) {
  const [err, setErr] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity style={styles.gameCard} activeOpacity={0.85} onPress={() => onPress(game)}>
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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [gameReviews, setGameReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [communityReviews, setCommunityReviews] = useState<any[]>([]);
  const [loadingCommunityReviews, setLoadingCommunityReviews] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [libraryStatuses, setLibraryStatuses] = useState<Record<string, GameStatus>>({});
  const { user } = useAuth();
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);
  const libraryService = LibraryService.getInstance();
  const reviewService = ReviewService.getInstance();

  useEffect(() => {
    // Usa GameService: top jogos mais bem avaliados do catálogo Steam real
    const svc = GameService.getInstance();
    setTopGames(svc.getRecommended(8));
    void loadCommunityReviews();
  }, []);

  useEffect(() => {
    if (!user) {
      setLibraryStatuses({});
      return;
    }

    void loadLibraryStatuses();
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

  const loadCommunityReviews = async () => {
    setLoadingCommunityReviews(true);
    try {
      const reviews = await reviewService.getRecentPublicReviews(10);
      setCommunityReviews(
        reviews.map((review) => ({
          id: review.id,
          user: review.userDisplayName || review.username,
          game: review.gameName,
          rating: review.rating,
          ratingLabel: review.ratingLabel,
          text: review.text,
        })),
      );
    } catch {
      setCommunityReviews([]);
    } finally {
      setLoadingCommunityReviews(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* A Comunidade tem jogado */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>A Comunidade tem jogado</Text>
            <Ionicons name="people" size={20} color={colors.TEXT_MUTED} />
          </View>
          <FlatList
            horizontal
            data={topGames}
            keyExtractor={g => g.id}
            contentContainerStyle={styles.carousel}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <CommunityGameCard game={item} onPress={loadGameContext} />}
          />
        </View>

        {/* Reviews recentes */}
        <View style={styles.section}>
          <SectionTitle title="Reviews Recentes" />
          {loadingCommunityReviews ? (
            <ActivityIndicator color={colors.ACCENT} style={{ marginTop: 12 }} />
          ) : communityReviews.length === 0 ? (
            <View style={styles.emptyReviewsCard}>
              <Text style={styles.emptyReviewsText}>Ainda não há reviews recentes públicas na comunidade.</Text>
            </View>
          ) : (
            communityReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

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
  container:            { flex: 1, backgroundColor: colors.BG_PRIMARY },
  section:              { marginTop: 20 },
  titleRow:             { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:         { color: colors.TEXT_PRIMARY, fontSize: 21, fontWeight: '700' },
  communityIcon:        { fontSize: 20 },
  carousel:             { paddingLeft: 16, paddingRight: 8 },
  gameCard:             { width: 160, marginRight: 12 },
  gameThumb:            { width: '100%', aspectRatio: 3/4, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.BG_CARD },
  gameImage:            { width: '100%', height: '100%' },
  gamePlaceholder:      { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 8 },
  gamePlaceholderText:  { color: colors.TEXT_MUTED, fontSize: 11, textAlign: 'center' },
  gameInfo:             { marginTop: 6, paddingHorizontal: 2 },
  gameName:             { color: colors.TEXT_PRIMARY, fontSize: 13, fontWeight: '600' },
  gameGenres:           { color: colors.TEXT_MUTED, fontSize: 11, marginTop: 2, marginBottom: 3 },
  gameRatingRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameReviews:          { color: colors.TEXT_MUTED, fontSize: 10 },
  emptyReviewsCard:     { marginHorizontal: 16, backgroundColor: colors.BG_CARD, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER, padding: 16 },
  emptyReviewsText:     { color: colors.TEXT_MUTED, fontSize: 13 },
});