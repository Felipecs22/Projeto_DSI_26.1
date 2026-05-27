import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

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

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.ACCENT} />
            </View>
          ) : friendProfile ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{friendProfile.user.initials}</Text>
              </View>

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
            </>
          ) : (
            <View style={styles.loadingBox}>
              <Text style={styles.emptyText}>Não foi possível carregar esse perfil.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
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
  },
  closeText: {
    color: colors.TEXT_MUTED,
    fontSize: 15,
  },
});
