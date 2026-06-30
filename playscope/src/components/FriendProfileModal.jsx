import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ProfileAvatar from './ProfileAvatar';
import { getAllBadgesWithStatus } from '../constants/badges';

function StatCard({ label, value, styles }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function FriendProfileModal({
  visible,
  friendProfile,
  loading,
  onClose,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = friendProfile
    ? getAllBadgesWithStatus({
        total:        friendProfile.stats.total,
        jogados:      friendProfile.stats.jogados,
        jogando:      friendProfile.stats.jogando,
        pausados:     friendProfile.stats.pausados,
        abandonados:  friendProfile.stats.abandonados,
        fila:         friendProfile.stats.fila,
        reviewCount:  friendProfile.reviewCount,
        friendCount:  friendProfile.friendCount,
        createdAt:    friendProfile.user.createdAt,
      })
    : [];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.ACCENT} />
            </View>
          ) : friendProfile ? (
            <>
              <ProfileAvatar
                avatarId={friendProfile.user.avatarId}
                photoURL={friendProfile.user.photoURL}
                size={72}
              />

              <Text style={styles.name}>{friendProfile.user.displayName}</Text>
              <Text style={styles.username}>{friendProfile.user.username}</Text>

              <View style={styles.bioCard}>
                <Text style={styles.bioTitle}>Bio</Text>
                <Text style={styles.bioText}>
                  {friendProfile.user.bio?.trim() ? friendProfile.user.bio : 'Esse amigo ainda não adicionou uma bio.'}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <StatCard label="Jogados" value={friendProfile.stats.jogados} styles={styles} />
                <StatCard label="Jogando" value={friendProfile.stats.jogando} styles={styles} />
              </View>
              <View style={styles.statsRow}>
                <StatCard label="Na fila" value={friendProfile.stats.fila} styles={styles} />
                <StatCard label="Reviews" value={friendProfile.reviewCount} styles={styles} />
              </View>

              {/* Seção de conquistas */}
              <View style={styles.badgesSection}>
                <Text style={styles.badgesSectionTitle}>Conquistas</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
                  {badges.map((badge) => (
                    <TouchableOpacity
                      key={badge.id}
                      style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}
                      onPress={() => setSelectedBadge(selectedBadge?.id === badge.id ? null : badge)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.badgeIconWrapper, !badge.earned && styles.badgeIconWrapperLocked]}>
                        <Ionicons
                          name={badge.icon}
                          size={20}
                          color={badge.earned ? colors.ACCENT : colors.TEXT_MUTED}
                        />
                      </View>
                      <Text style={[styles.badgeLabel, !badge.earned && styles.badgeLabelLocked]} numberOfLines={1}>
                        {badge.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Card de detalhe inline — aparece ao tocar num badge */}
                {selectedBadge ? (
                  <View style={[styles.badgeDetailCard, !selectedBadge.earned && styles.badgeDetailCardLocked]}>
                    <View style={styles.badgeDetailHeader}>
                      <Ionicons
                        name={selectedBadge.icon}
                        size={20}
                        color={selectedBadge.earned ? colors.ACCENT : colors.TEXT_MUTED}
                      />
                      <Text style={[styles.badgeDetailTitle, !selectedBadge.earned && { color: colors.TEXT_MUTED }]}>
                        {selectedBadge.label}
                      </Text>
                      <View style={[styles.badgeStatusPill, selectedBadge.earned ? styles.badgeStatusEarned : styles.badgeStatusLocked]}>
                        <Ionicons
                          name={selectedBadge.earned ? 'checkmark-circle' : 'lock-closed'}
                          size={11}
                          color={selectedBadge.earned ? colors.ACCENT : colors.TEXT_MUTED}
                        />
                        <Text style={[styles.badgeStatusText, { color: selectedBadge.earned ? colors.ACCENT : colors.TEXT_MUTED }]}>
                          {selectedBadge.earned ? 'Conquistada' : 'Não conquistada'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.badgeDetailDescription}>{selectedBadge.description}</Text>
                  </View>
                ) : null}
              </View>
            </>
          ) : (
            <View style={styles.loadingBox}>
              <Text style={styles.emptyText}>Não foi possível carregar esse perfil.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>

          </ScrollView>
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
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: colors.BORDER,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.BORDER_LIGHT,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  loadingBox: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.BG_INPUT,
    borderWidth: 1.5,
    borderColor: colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.ACCENT,
    fontSize: 22,
    fontWeight: '700',
  },
  name: {
    color: colors.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  username: {
    color: colors.ACCENT,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  bioCard: {
    backgroundColor: colors.BG_CARD,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  bioTitle: {
    color: colors.TEXT_MUTED,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bioText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 14,
    lineHeight: 21,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  statValue: {
    color: colors.ACCENT,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
  },
  closeBtn: {
    marginTop: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    alignItems: 'center',
    marginBottom: 8,
  },
  closeText: {
    color: colors.TEXT_MUTED,
    fontSize: 15,
  },
  badgesSection: {
    marginTop: 6,
    marginBottom: 10,
  },
  badgesSectionTitle: {
    color: colors.TEXT_MUTED,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  badgeRow: {
    gap: 12,
    paddingBottom: 4,
  },
  badgeItem: {
    alignItems: 'center',
    width: 64,
  },
  badgeItemLocked: {
    opacity: 0.4,
  },
  badgeIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,211,148,0.12)',
    borderWidth: 1.5,
    borderColor: colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  badgeIconWrapperLocked: {
    backgroundColor: colors.BG_CARD,
    borderColor: colors.BORDER,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
    textAlign: 'center',
  },
  badgeLabelLocked: {
    color: colors.TEXT_MUTED,
  },
  badgeDetailCard: {
    marginTop: 12,
    backgroundColor: 'rgba(0,211,148,0.07)',
    borderWidth: 1,
    borderColor: colors.ACCENT,
    borderRadius: 12,
    padding: 12,
  },
  badgeDetailCardLocked: {
    backgroundColor: colors.BG_CARD,
    borderColor: colors.BORDER,
  },
  badgeDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  badgeDetailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ACCENT,
    flex: 1,
  },
  badgeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeStatusEarned: {
    backgroundColor: 'rgba(0,211,148,0.15)',
  },
  badgeStatusLocked: {
    backgroundColor: colors.BG_SECONDARY,
  },
  badgeStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeDetailDescription: {
    fontSize: 13,
    color: colors.TEXT_SECONDARY,
    lineHeight: 19,
  },
});