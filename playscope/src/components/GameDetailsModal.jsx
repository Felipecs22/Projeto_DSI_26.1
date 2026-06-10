import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import StarRating from './StarRating';

const STATUS_LABELS = {
  jogando: 'Jogando',
  jogados: 'Concluído',
  pausados: 'Pausado',
  abandonados: 'Abandonado',
  fila: 'Na fila',
};

function RatingPicker({ value, onChange }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.ratingPicker}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)} activeOpacity={0.8}>
          <Text style={[styles.ratingStar, star <= value && styles.ratingStarActive]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function GameDetailsModal({
  visible,
  game,
  libraryStatus,
  reviewSummary,
  reviews,
  userReview,
  loading,
  savingReview,
  onClose,
  onOpenStatusModal,
  onSaveReview,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [rating, setRating] = useState(userReview?.rating ?? 0);
  const [text, setText] = useState(userReview?.text ?? '');

  useEffect(() => {
    setRating(userReview?.rating ?? 0);
    setText(userReview?.text ?? '');
  }, [userReview, game?.id, visible]);

  if (!game) return null;

  const hasReview = rating > 0 && text.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.ACCENT} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: game.image }} style={styles.cover} resizeMode="cover" />

              <Text style={styles.title}>{game.name}</Text>
              <Text style={styles.genreLine}>{game.genres}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Steam</Text>
                  <StarRating rating={game.rating} label={game.ratingLabel} size="lg" />
                  <Text style={styles.statHint}>{game.reviewsFormatted} reviews</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Comunidade</Text>
                  <StarRating
                    rating={reviewSummary.totalReviews ? reviewSummary.averageRating : 0}
                    label={reviewSummary.totalReviews ? `${reviewSummary.averageRating}/5` : 'Sem reviews'}
                    size="lg"
                  />
                  <Text style={styles.statHint}>{reviewSummary.totalReviews} review(s)</Text>
                </View>
              </View>

              <Text style={styles.description}>{game.description}</Text>

              <View style={styles.tagsWrap}>
                {game.tags.map((tag) => (
                  <View key={tag} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={onOpenStatusModal} activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>
                  {libraryStatus ? `Status atual: ${STATUS_LABELS[libraryStatus]}` : 'Adicionar à biblioteca'}
                </Text>
              </TouchableOpacity>

              <View style={styles.reviewBox}>
                <Text style={styles.reviewTitle}>Sua review</Text>
                <RatingPicker value={rating} onChange={setRating} />
                <TextInput
                  style={styles.reviewInput}
                  multiline
                  numberOfLines={5}
                  value={text}
                  onChangeText={setText}
                  placeholder="Escreva sua opinião sobre esse jogo"
                  placeholderTextColor={colors.TEXT_MUTED}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[styles.secondaryBtn, (!hasReview || savingReview) && styles.disabledBtn]}
                  onPress={() => onSaveReview(rating, text)}
                  activeOpacity={0.85}
                  disabled={!hasReview || savingReview}
                >
                  {savingReview ? (
                    <ActivityIndicator color={colors.BG_PRIMARY} />
                  ) : (
                    <Text style={styles.secondaryBtnText}>{userReview ? 'Atualizar review' : 'Salvar review'}</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.communityBox}>
                <Text style={styles.reviewTitle}>Reviews da comunidade</Text>
                {reviews.length === 0 ? (
                  <Text style={styles.emptyText}>Ainda não há reviews deste jogo no app.</Text>
                ) : (
                  reviews.map((review) => (
                    <View key={review.id} style={styles.communityReview}>
                      <View style={styles.communityHeader}>
                        <Text style={styles.communityUser}>
                          {review.userDisplayName || review.username}
                        </Text>
                        <StarRating rating={review.rating} label={review.ratingLabel} />
                      </View>
                      <Text style={styles.communityText}>{review.text}</Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.SCRIM,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.BG_MODAL,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: colors.BORDER,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.BORDER_LIGHT,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: colors.BG_CARD,
  },
  title: {
    color: colors.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: '700',
  },
  genreLine: {
    color: colors.TEXT_SECONDARY,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.BG_CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER,
    padding: 12,
  },
  statLabel: {
    color: colors.TEXT_MUTED,
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statHint: {
    color: colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 6,
  },
  description: {
    color: colors.TEXT_SECONDARY,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: colors.BG_CARD,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    color: colors.ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: colors.ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  primaryBtnText: {
    color: colors.BG_PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
  reviewBox: {
    backgroundColor: colors.BG_CARD,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  reviewTitle: {
    color: colors.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  ratingPicker: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ratingStar: {
    color: colors.TEXT_MUTED,
    fontSize: 28,
  },
  ratingStarActive: {
    color: colors.STAR,
  },
  reviewInput: {
    minHeight: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER,
    backgroundColor: colors.BG_INPUT,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.TEXT_PRIMARY,
    fontSize: 14,
    marginBottom: 12,
  },
  secondaryBtn: {
    backgroundColor: colors.ACCENT,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  secondaryBtnText: {
    color: colors.BG_PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  communityBox: {
    backgroundColor: colors.BG_CARD,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 16,
    padding: 14,
  },
  emptyText: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
  },
  communityReview: {
    borderTopWidth: 1,
    borderTopColor: colors.BORDER,
    paddingTop: 12,
    marginTop: 12,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  communityUser: {
    color: colors.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  communityText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 13,
    lineHeight: 19,
  },
});
