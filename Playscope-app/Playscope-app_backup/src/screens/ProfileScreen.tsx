import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import ProfileAvatar, { AVATAR_LIST } from '../components/ProfileAvatar';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { LibraryService } from '../services/LibraryService';
import { ReviewService } from '../services/ReviewService';

function SectionCard({ title, icon, children, styles }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value, onEdit, onDelete, styles }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
      <View style={styles.infoActions}>
        {onEdit ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
            <Text style={styles.iconBtnText}>✏️</Text>
          </TouchableOpacity>
        ) : null}
        {onDelete ? (
          <TouchableOpacity style={[styles.iconBtn, styles.iconBtnDanger]} onPress={onDelete}>
            <Text style={styles.iconBtnText}>🗑️</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

function ActionRow({ label, onPress, danger, styles }: any) {
  return (
    <TouchableOpacity style={[styles.actionRow, danger && styles.actionRowDanger]} onPress={onPress}>
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
      <Text style={[styles.actionChevron, danger && styles.actionLabelDanger]}>›</Text>
    </TouchableOpacity>
  );
}

function PrefRow({ label, value, onChange, styles, colors }: any) {
  return (
    <View style={styles.prefRow}>
      <Text style={styles.prefLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
        thumbColor={value ? colors.BG_PRIMARY : colors.TEXT_MUTED}
      />
    </View>
  );
}

function formatMemberSince(createdAt?: string) {
  if (!createdAt) return 'Membro recente';

  return `Membro desde ${new Date(createdAt).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })}`;
}

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { colors, darkMode, setDarkMode } = useTheme();
  const styles = createStyles(colors);

  const userRepo = new UserRepository();
  const authService = AuthService.getInstance();
  const libraryService = LibraryService.getInstance();
  const reviewService = ReviewService.getInstance();

  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [editModal, setEditModal] = useState<{ field: string; label: string; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const [displayName, setDisplayName] = useState(user?.displayName ?? 'Jogador');
  const [username, setUsername] = useState(user?.username ?? '@jogador');
  const [email, setEmail] = useState(user?.email ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarId, setAvatarId] = useState<string | null>(user?.avatarId ?? 'robot');
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL ?? null);
  const [prefs, setPrefs] = useState(user?.preferences ?? {
    notifications: true,
    darkMode: true,
    publicActivity: true,
    publicLibrary: true,
  });
  const [stats, setStats] = useState({
    jogados: 0,
    jogando: 0,
    fila: 0,
    reviews: 0,
  });
  const [userReviews, setUserReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    setDisplayName(user.displayName);
    setUsername(user.username);
    setEmail(user.email);
    setBio(user.bio);
    setAvatarId(user.avatarId);
    setPhotoURL(user.photoURL);
    setPrefs(user.preferences);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setStats({ jogados: 0, jogando: 0, fila: 0, reviews: 0 });
      setUserReviews([]);
      return;
    }

    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    setLoadingStats(true);
    try {
      const [library, reviews] = await Promise.all([
        libraryService.getUserLibrary(user.uid),
        reviewService.getUserReviews(user.uid),
      ]);

      const libraryStats = libraryService.getStats(library);

      setStats({
        jogados: libraryStats.jogados,
        jogando: libraryStats.jogando,
        fila: libraryStats.fila,
        reviews: reviews.length,
      });
      setUserReviews(
        reviews.map((review) => ({
          id: review.id,
          user: review.userDisplayName || review.username,
          game: review.gameName,
          rating: review.rating,
          ratingLabel: review.ratingLabel,
          text: review.text,
          online: true,
        })),
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const saveField = async (field: string, value: string) => {
    if (!user) return;

    setSaving(true);
    try {
      await userRepo.updateProfile(user.uid, { [field]: value });
      await refreshUser();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAvatar = async (id: string | null) => {
    setAvatarId(id);
    if (!user) return;

    try {
      await userRepo.updateProfile(user.uid, { avatarId: id });
      await refreshUser();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const savePreference = async (key: string, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next as any);

    try {
      if (key === 'darkMode') {
        await setDarkMode(value);
        return;
      }

      if (user) {
        await userRepo.updatePreferences(user.uid, { [key]: value });
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message ?? 'Não foi possível salvar a preferência.');
    }
  };

  const handleDeleteField = (label: string, field: string) => {
    Alert.alert(`Remover ${label}`, `Deseja limpar o campo "${label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => saveField(field, '') },
    ]);
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: () => { void onConfirm(); } },
    ]);
  };

  const handlePasswordReset = async () => {
    try {
      await authService.sendPasswordReset(email);
      Alert.alert('E-mail enviado', `Enviamos um link de redefinição para ${email}.`);
    } catch (error: any) {
      Alert.alert('Erro', error.message ?? 'Não foi possível enviar o e-mail.');
    }
  };

  const handleClearLibrary = async () => {
    if (!user) return;

    try {
      await libraryService.clearUserLibrary(user.uid);
      await loadProfileData();
      Alert.alert('Biblioteca limpa', 'Todos os jogos foram removidos da sua conta.');
    } catch (error: any) {
      Alert.alert('Erro', error.message ?? 'Não foi possível limpar a biblioteca.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteCurrentAccount();
    } catch (error: any) {
      Alert.alert('Erro', error.message ?? 'Não foi possível excluir a conta.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.photoImage} />
            ) : (
              <ProfileAvatar avatarId={avatarId} size={90} />
            )}
            <TouchableOpacity style={styles.avatarEditBtn} onPress={() => setAvatarPickerVisible(true)}>
              <Text style={styles.avatarEditIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroUsername}>{username}</Text>
          <Text style={styles.heroSince}>{formatMemberSince(user?.createdAt)}</Text>

          {loadingStats ? (
            <ActivityIndicator color={colors.ACCENT} style={{ marginTop: 12 }} />
          ) : (
            <View style={styles.statsRow}>
              {[
                { label: 'Jogados', value: stats.jogados },
                { label: 'Jogando', value: stats.jogando },
                { label: 'Na fila', value: stats.fila },
                { label: 'Reviews', value: stats.reviews },
              ].map((stat) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <SectionCard title="Informações pessoais" icon="👤" styles={styles}>
          <InfoRow
            label="Nome"
            value={displayName}
            onEdit={() => setEditModal({ field: 'displayName', label: 'Nome', value: displayName })}
            onDelete={() => handleDeleteField('Nome', 'displayName')}
            styles={styles}
          />
          <InfoRow label="E-mail" value={email} styles={styles} />
          <InfoRow
            label="Usuário"
            value={username}
            onEdit={() => setEditModal({ field: 'username', label: 'Usuário', value: username })}
            styles={styles}
          />
          <InfoRow
            label="Bio"
            value={bio || '—'}
            onEdit={() => setEditModal({ field: 'bio', label: 'Bio', value: bio })}
            onDelete={() => handleDeleteField('Bio', 'bio')}
            styles={styles}
          />
        </SectionCard>

        <SectionCard title="Preferências" icon="⚙️" styles={styles}>
          <PrefRow label="Notificações" value={prefs.notifications ?? true} onChange={(value: boolean) => savePreference('notifications', value)} styles={styles} colors={colors} />
          <PrefRow label="Modo escuro" value={prefs.darkMode ?? true} onChange={(value: boolean) => savePreference('darkMode', value)} styles={styles} colors={colors} />
          <PrefRow label="Publicar atividade" value={prefs.publicActivity ?? true} onChange={(value: boolean) => savePreference('publicActivity', value)} styles={styles} colors={colors} />
          <PrefRow label="Biblioteca pública" value={prefs.publicLibrary ?? true} onChange={(value: boolean) => savePreference('publicLibrary', value)} styles={styles} colors={colors} />
        </SectionCard>

        <SectionCard title="Minhas reviews" icon="⭐" styles={styles}>
          {userReviews.length === 0 ? (
            <Text style={styles.emptyReviewText}>Você ainda não publicou reviews.</Text>
          ) : (
            userReviews.slice(0, 5).map((review) => (
              <View key={review.id} style={styles.reviewRow}>
                <ReviewCard review={review} />
              </View>
            ))
          )}
        </SectionCard>

        <SectionCard title="Segurança" icon="🔒" styles={styles}>
          <ActionRow label="Alterar senha" onPress={handlePasswordReset} styles={styles} />
          <ActionRow label="Desconectar outros dispositivos" onPress={handlePasswordReset} styles={styles} />
          <ActionRow label="Sair da conta" onPress={logout} styles={styles} />
        </SectionCard>

        <SectionCard title="Zona de Perigo" icon="⚠️" styles={styles}>
          <ActionRow
            danger
            label="Limpar biblioteca"
            onPress={() => confirmAction('Limpar biblioteca', 'Todos os jogos serão removidos permanentemente.', handleClearLibrary)}
            styles={styles}
          />
          <ActionRow
            danger
            label="Excluir conta"
            onPress={() => confirmAction('Excluir conta', 'Esta ação é irreversível e apagará seus dados.', handleDeleteAccount)}
            styles={styles}
          />
        </SectionCard>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={avatarPickerVisible} transparent animationType="slide" onRequestClose={() => setAvatarPickerVisible(false)} statusBarTranslucent>
        <Pressable style={styles.modalBackdrop} onPress={() => setAvatarPickerVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Escolher Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_LIST.map(({ id, label, Component }) => (
                <TouchableOpacity
                  key={id}
                  style={[styles.avatarOption, avatarId === id && styles.avatarOptionActive]}
                  onPress={() => {
                    saveAvatar(id);
                    setAvatarPickerVisible(false);
                  }}
                >
                  <Component size={72} />
                  <Text style={styles.avatarOptionLabel}>{label}</Text>
                  {avatarId === id ? <View style={styles.avatarCheck}><Text style={styles.avatarCheckIcon}>✓</Text></View> : null}
                </TouchableOpacity>
              ))}
            </View>
            {avatarId ? (
              <TouchableOpacity style={styles.removeAvatarBtn} onPress={() => { saveAvatar(null); setAvatarPickerVisible(false); }}>
                <Text style={styles.removeAvatarText}>🗑️  Remover avatar atual</Text>
              </TouchableOpacity>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      {editModal ? (
        <EditModal
          label={editModal.label}
          value={editModal.value === '—' ? '' : editModal.value}
          saving={saving}
          onClose={() => setEditModal(null)}
          onSave={(value: string) => {
            saveField(editModal.field, value);
            setEditModal(null);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

function EditModal({ label, value, onClose, onSave, saving }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [currentValue, setCurrentValue] = useState(value);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Editar {label}</Text>
          <TextInput
            style={styles.editInput}
            value={currentValue}
            onChangeText={setCurrentValue}
            placeholderTextColor={colors.TEXT_MUTED}
            autoFocus
            selectionColor={colors.ACCENT}
          />
          <View style={styles.editBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(currentValue)} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.BG_PRIMARY} size="small" /> : <Text style={styles.saveBtnText}>Salvar</Text>}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BG_PRIMARY },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  photoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.ACCENT,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.BG_CARD,
    borderWidth: 2,
    borderColor: colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditIcon: { fontSize: 12 },
  heroName: { color: colors.TEXT_PRIMARY, fontSize: 22, fontWeight: '700', marginBottom: 2 },
  heroUsername: { color: colors.ACCENT, fontSize: 14, marginBottom: 4 },
  heroSince: { color: colors.TEXT_MUTED, fontSize: 12, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statItem: {
    alignItems: 'center',
    backgroundColor: colors.BG_CARD,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 70,
  },
  statValue: { color: colors.ACCENT, fontSize: 20, fontWeight: '700' },
  statLabel: { color: colors.TEXT_MUTED, fontSize: 11, marginTop: 2 },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.BG_CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
    backgroundColor: colors.BG_SECONDARY,
  },
  cardIcon: { fontSize: 16 },
  cardTitle: { color: colors.TEXT_PRIMARY, fontSize: 15, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    color: colors.TEXT_MUTED,
    fontSize: 11,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: { color: colors.TEXT_PRIMARY, fontSize: 15 },
  infoActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.BG_INPUT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnDanger: { backgroundColor: 'rgba(229,62,62,0.1)' },
  iconBtnText: { fontSize: 14 },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  prefLabel: { color: colors.TEXT_PRIMARY, fontSize: 15 },
  emptyReviewText: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  reviewRow: {
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  actionRowDanger: { backgroundColor: 'rgba(229,62,62,0.05)' },
  actionLabel: { color: colors.TEXT_SECONDARY, fontSize: 15 },
  actionLabelDanger: { color: colors.DANGER },
  actionChevron: { color: colors.TEXT_MUTED, fontSize: 22, fontWeight: '300' },
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
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarOption: {
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.BORDER,
    backgroundColor: colors.BG_CARD,
    position: 'relative',
  },
  avatarOptionActive: {
    borderColor: colors.ACCENT,
    backgroundColor: colors.ACCENT_GLOW,
  },
  avatarOptionLabel: { color: colors.TEXT_SECONDARY, fontSize: 12, fontWeight: '600' },
  avatarCheck: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCheckIcon: { color: colors.BG_PRIMARY, fontSize: 12, fontWeight: '900' },
  removeAvatarBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.DANGER,
    alignItems: 'center',
    marginBottom: 4,
  },
  removeAvatarText: { color: colors.DANGER, fontSize: 14, fontWeight: '600' },
  editInput: {
    backgroundColor: colors.BG_INPUT,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 16,
  },
  editBtns: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    alignItems: 'center',
  },
  cancelText: { color: colors.TEXT_MUTED, fontSize: 15 },
  saveBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colors.ACCENT,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.BG_PRIMARY, fontSize: 15, fontWeight: '700' },
});
