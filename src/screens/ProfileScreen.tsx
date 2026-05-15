import React, { useState } from 'react';
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
} from 'react-native';
import Colors from '../constants/colors';
import ProfileAvatar, { AVATAR_LIST } from '../components/ProfileAvatar';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: any) {
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

function InfoRow({ label, value, onEdit, onDelete }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
      <View style={styles.infoActions}>
        {onEdit && (
          <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
            <Text style={styles.iconBtnText}>✏️</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={[styles.iconBtn, styles.iconBtnDanger]} onPress={onDelete}>
            <Text style={styles.iconBtnText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function ActionRow({ label, onPress, danger }: any) {
  return (
    <TouchableOpacity
      style={[styles.actionRow, danger && styles.actionRowDanger]}
      onPress={onPress}
    >
      <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>{label}</Text>
      <Text style={[styles.actionChevron, danger && styles.actionLabelDanger]}>›</Text>
    </TouchableOpacity>
  );
}

function PrefRow({ label, value, onChange }: any) {
  return (
    <View style={styles.prefRow}>
      <Text style={styles.prefLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.BORDER, true: Colors.ACCENT }}
        thumbColor={value ? Colors.BG_PRIMARY : Colors.TEXT_MUTED}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [avatarId, setAvatarId]       = useState<string | null>('robot');
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [editModal, setEditModal]     = useState<{ field: string; label: string; value: string } | null>(null);

  const [userInfo, setUserInfo] = useState({
    nome:    'GamerPro123',
    email:   'gamerpro@email.com',
    usuario: '@gamerpro123',
    bio:     'Vivo para jogar. 🎮',
  });

  const [prefs, setPrefs] = useState({
    notificacoes:      true,
    modoEscuro:        true,
    spoilers:          false,
    publicarAtividade: true,
    bibliotecaPublica: true,
  });

  const stats = [
    { label: 'Jogados', value: '47' },
    { label: 'Jogando', value: '4'  },
    { label: 'Na fila', value: '12' },
    { label: 'Reviews', value: '23' },
  ];

  const openEdit = (field: string, label: string) => {
    setEditModal({ field, label, value: userInfo[field as keyof typeof userInfo] });
  };

  const saveEdit = (field: string, newValue: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: newValue || '—' }));
  };

  const deleteField = (label: string, field: string) => {
    Alert.alert(
      `Remover ${label}`,
      `Deseja remover "${label}" das suas informações?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => setUserInfo((p) => ({ ...p, [field]: '—' })),
        },
      ]
    );
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <ProfileAvatar avatarId={avatarId} size={90} />
            <TouchableOpacity
              style={styles.avatarEditBtn}
              onPress={() => setAvatarPickerVisible(true)}
            >
              <Text style={styles.avatarEditIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroName}>{userInfo.nome}</Text>
          <Text style={styles.heroUsername}>{userInfo.usuario}</Text>
          <Text style={styles.heroSince}>Membro desde Janeiro de 2024</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Informações pessoais ── */}
        <SectionCard title="Informações pessoais" icon="👤">
          <InfoRow
            label="Nome"
            value={userInfo.nome}
            onEdit={() => openEdit('nome', 'Nome')}
            onDelete={() => deleteField('Nome', 'nome')}
          />
          <InfoRow
            label="E-mail"
            value={userInfo.email}
            onEdit={() => openEdit('email', 'E-mail')}
          />
          <InfoRow
            label="Usuário"
            value={userInfo.usuario}
            onEdit={() => openEdit('usuario', 'Usuário')}
          />
          <InfoRow
            label="Bio"
            value={userInfo.bio}
            onEdit={() => openEdit('bio', 'Bio')}
            onDelete={() => deleteField('Bio', 'bio')}
          />
        </SectionCard>

        {/* ── Preferências ── */}
        <SectionCard title="Preferências" icon="⚙️">
          <PrefRow
            label="Notificações"
            value={prefs.notificacoes}
            onChange={(v: boolean) => setPrefs((p) => ({ ...p, notificacoes: v }))}
          />
          <PrefRow
            label="Modo escuro"
            value={prefs.modoEscuro}
            onChange={(v: boolean) => setPrefs((p) => ({ ...p, modoEscuro: v }))}
          />
          <PrefRow
            label="Ocultar spoilers"
            value={prefs.spoilers}
            onChange={(v: boolean) => setPrefs((p) => ({ ...p, spoilers: v }))}
          />
          <PrefRow
            label="Publicar atividade"
            value={prefs.publicarAtividade}
            onChange={(v: boolean) => setPrefs((p) => ({ ...p, publicarAtividade: v }))}
          />
          <PrefRow
            label="Biblioteca pública"
            value={prefs.bibliotecaPublica}
            onChange={(v: boolean) => setPrefs((p) => ({ ...p, bibliotecaPublica: v }))}
          />
        </SectionCard>

        {/* ── Segurança ── */}
        <SectionCard title="Segurança" icon="🔒">
          <ActionRow
            label="Alterar senha"
            onPress={() =>
              confirmAction('Alterar senha', `Um e-mail será enviado para ${userInfo.email}.`, () => {})
            }
          />
          <ActionRow
            label="Desconectar outros dispositivos"
            onPress={() =>
              confirmAction('Desconectar sessões', 'Todas as sessões ativas em outros dispositivos serão encerradas.', () => {})
            }
          />
        </SectionCard>

        {/* ── Zona de perigo ── */}
        <SectionCard title="Zona de Perigo" icon="⚠️">
          <ActionRow
            danger
            label="Limpar biblioteca"
            onPress={() =>
              confirmAction('Limpar biblioteca', 'Todos os jogos serão removidos permanentemente.', () => {})
            }
          />
          <ActionRow
            danger
            label="Excluir conta"
            onPress={() =>
              confirmAction('Excluir conta', 'Esta ação é irreversível. Todos os seus dados serão excluídos.', () => {})
            }
          />
        </SectionCard>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Avatar Picker Modal ── */}
      <Modal
        visible={avatarPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAvatarPickerVisible(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setAvatarPickerVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Escolher Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_LIST.map(({ id, label, Component }) => (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.avatarOption,
                    avatarId === id && styles.avatarOptionActive,
                  ]}
                  onPress={() => { setAvatarId(id); setAvatarPickerVisible(false); }}
                >
                  <Component size={72} />
                  <Text style={styles.avatarOptionLabel}>{label}</Text>
                  {avatarId === id && (
                    <View style={styles.avatarCheck}>
                      <Text style={styles.avatarCheckIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {avatarId && (
              <TouchableOpacity
                style={styles.removeAvatarBtn}
                onPress={() => { setAvatarId(null); setAvatarPickerVisible(false); }}
              >
                <Text style={styles.removeAvatarText}>🗑️  Remover avatar atual</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Edit Modal ── */}
      {editModal && (
        <EditModal
          label={editModal.label}
          value={editModal.value === '—' ? '' : editModal.value}
          onClose={() => setEditModal(null)}
          onSave={(v) => { saveEdit(editModal.field, v); setEditModal(null); }}
        />
      )}
    </SafeAreaView>
  );
}

function EditModal({ label, value, onClose, onSave }: any) {
  const [val, setVal] = useState(value);
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Editar {label}</Text>
          <TextInput
            style={styles.editInput}
            value={val}
            onChangeText={setVal}
            placeholderTextColor={Colors.TEXT_MUTED}
            autoFocus
            selectionColor={Colors.ACCENT}
          />
          <View style={styles.editBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(val)}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_PRIMARY,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.BG_CARD,
    borderWidth: 2,
    borderColor: Colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditIcon: {
    fontSize: 12,
  },
  heroName: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  heroUsername: {
    color: Colors.ACCENT,
    fontSize: 14,
    marginBottom: 4,
  },
  heroSince: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: Colors.BG_CARD,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 70,
  },
  statValue: {
    color: Colors.ACCENT,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },

  // Cards
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.BG_CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    backgroundColor: Colors.BG_SECONDARY,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: Colors.TEXT_MUTED,
    fontSize: 11,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 15,
  },
  infoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.BG_INPUT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnDanger: {
    backgroundColor: 'rgba(229,62,62,0.1)',
  },
  iconBtnText: {
    fontSize: 14,
  },

  // Action rows
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  actionRowDanger: {
    backgroundColor: 'rgba(229,62,62,0.05)',
  },
  actionLabel: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 15,
  },
  actionLabelDanger: {
    color: Colors.DANGER,
  },
  actionChevron: {
    color: Colors.TEXT_MUTED,
    fontSize: 22,
    fontWeight: '300',
  },

  // Pref rows
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  prefLabel: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 15,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.BG_MODAL,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: Colors.BORDER,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.BORDER_LIGHT,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Avatar picker
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
    borderColor: Colors.BORDER,
    backgroundColor: Colors.BG_CARD,
    position: 'relative',
  },
  avatarOptionActive: {
    borderColor: Colors.ACCENT,
    backgroundColor: 'rgba(0,211,148,0.08)',
  },
  avatarOptionLabel: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '600',
  },
  avatarCheck: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCheckIcon: {
    color: Colors.BG_PRIMARY,
    fontSize: 12,
    fontWeight: '900',
  },
  removeAvatarBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.DANGER,
    alignItems: 'center',
    marginBottom: 4,
  },
  removeAvatarText: {
    color: Colors.DANGER,
    fontSize: 14,
    fontWeight: '600',
  },

  // Edit modal
  editInput: {
    backgroundColor: Colors.BG_INPUT,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 16,
  },
  editBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.TEXT_MUTED,
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.ACCENT,
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.BG_PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
});
