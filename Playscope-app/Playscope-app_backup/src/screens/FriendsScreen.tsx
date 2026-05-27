import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SectionTitle from '../components/SectionTitle';
import ReviewCard from '../components/ReviewCard';
import FriendProfileModal from '../components/FriendProfileModal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FriendService, type FriendListItem, type FriendProfileSnapshot } from '../services/FriendService';
import { User } from '../models/User';

function FriendAvatar({ user, styles }: { user: User; styles: any }) {
  return (
    <View style={styles.friendAvatar}>
      <Text style={styles.friendAvatarText}>{user.initials}</Text>
    </View>
  );
}

function FriendItem({
  item,
  styles,
  actionLabel,
  actionTone = 'primary',
  onAction,
  onPress,
}: {
  item: FriendListItem;
  styles: any;
  actionLabel?: string;
  actionTone?: 'primary' | 'danger' | 'neutral';
  onAction?: () => void;
  onPress?: () => void;
}) {
  const actionStyle = actionTone === 'danger'
    ? styles.friendActionDanger
    : actionTone === 'neutral'
      ? styles.friendActionNeutral
      : styles.friendAction;

  const actionTextStyle = actionTone === 'danger'
    ? styles.friendActionDangerText
    : actionTone === 'neutral'
      ? styles.friendActionNeutralText
      : styles.friendActionText;

  const content = (
    <View style={styles.friendItem}>
      <View style={styles.friendIdentity}>
        <FriendAvatar user={item.user} styles={styles} />
        <View style={styles.friendMeta}>
          <Text style={styles.friendName}>{item.user.displayName}</Text>
          <Text style={styles.friendUsername}>{item.user.username}</Text>
        </View>
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity style={actionStyle} onPress={onAction}>
          <Text style={actionTextStyle}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default function FriendsScreen() {
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);
  const { user } = useAuth();
  const friendService = FriendService.getInstance();

  const [loading, setLoading] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [friends, setFriends] = useState<FriendListItem[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendListItem[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendListItem[]>([]);
  const [friendReviews, setFriendReviews] = useState<any[]>([]);
  const [profileVisible, setProfileVisible] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState<FriendProfileSnapshot | null>(null);

  useEffect(() => {
    void loadFriendsData();
  }, [user?.uid]);

  const loadFriendsData = async () => {
    if (!user) {
      setFriends([]);
      setReceivedRequests([]);
      setSentRequests([]);
      setFriendReviews([]);
      return;
    }

    setLoading(true);
    try {
      const [friendItems, received, sent, reviews] = await Promise.all([
        friendService.getFriends(user.uid),
        friendService.getReceivedRequests(user.uid),
        friendService.getSentRequests(user.uid),
        friendService.getFriendReviews(user.uid),
      ]);

      setFriends(friendItems);
      setReceivedRequests(received);
      setSentRequests(sent);
      setFriendReviews(
        reviews.map((review) => ({
          id: review.id,
          user: review.userDisplayName || review.username,
          game: review.gameName,
          rating: review.rating,
          ratingLabel: review.ratingLabel,
          text: review.text,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUser = async () => {
    if (!user || !query.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const result = await friendService.searchUserByUsername(user.uid, query);
      setSearchResult(result);
      if (!result) {
        Alert.alert('Nenhum usuário encontrado', 'Verifique o nome de usuário e tente novamente.');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleSendInvite = async () => {
    if (!user || !searchResult) return;

    setSendingInvite(true);
    try {
      await friendService.sendFriendRequest(user, searchResult);
      setSearchResult(null);
      setQuery('');
      setSearchModalVisible(false);
      await loadFriendsData();
      Alert.alert('Convite enviado', `Seu convite foi enviado para ${searchResult.displayName}.`);
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível enviar o convite.');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleAccept = async (relationId: string) => {
    if (!user) return;

    try {
      await friendService.acceptRequest(user.uid, relationId);
      await loadFriendsData();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível aceitar o convite.');
    }
  };

  const handleDecline = async (relationId: string) => {
    if (!user) return;

    try {
      await friendService.declineRequest(user.uid, relationId);
      await loadFriendsData();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível recusar o convite.');
    }
  };

  const handleOpenFriendProfile = async (item: FriendListItem) => {
    if (!user) return;

    setProfileVisible(true);
    setLoadingProfile(true);
    setFriendProfile(null);

    try {
      const profile = await friendService.getFriendProfile(user.uid, item.user.uid);
      setFriendProfile(profile);
    } catch (error: any) {
      setProfileVisible(false);
      Alert.alert('Erro', error?.message ?? 'Não foi possível carregar o perfil do amigo.');
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionTitle
            title="Amigos"
            subtitle="Adicione usuários e gerencie seus convites"
            rightElement={(
              <View style={styles.titleActions}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => void loadFriendsData()}>
                  <Text style={styles.smallBtnText}>Atualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtnPrimary} onPress={() => setSearchModalVisible(true)}>
                  <Text style={styles.smallBtnPrimaryText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {loading ? (
            <ActivityIndicator color={colors.ACCENT} style={{ marginTop: 24 }} />
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionTitle title="Convites Recebidos" />
          <View style={styles.friendsCard}>
            {receivedRequests.length === 0 ? (
              <Text style={styles.emptyCardText}>Nenhum convite pendente.</Text>
            ) : (
              receivedRequests.map((item) => (
                <View key={item.relation.id} style={styles.requestRow}>
                  <FriendItem item={item} styles={styles} />
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.requestAcceptBtn} onPress={() => void handleAccept(item.relation.id)}>
                      <Text style={styles.requestAcceptText}>Aceitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.requestDeclineBtn} onPress={() => void handleDecline(item.relation.id)}>
                      <Text style={styles.requestDeclineText}>Recusar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Convites Enviados" />
          <View style={styles.friendsCard}>
            {sentRequests.length === 0 ? (
              <Text style={styles.emptyCardText}>Você não tem convites enviados.</Text>
            ) : (
              sentRequests.map((item) => (
                <FriendItem
                  key={item.relation.id}
                  item={item}
                  styles={styles}
                  actionLabel="Pendente"
                  actionTone="neutral"
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Lista de Amigos" />
          <View style={styles.friendsCard}>
            {friends.length === 0 ? (
              <Text style={styles.emptyCardText}>Sua lista de amigos ainda está vazia.</Text>
            ) : (
              friends.map((item) => (
                <FriendItem
                  key={item.relation.id}
                  item={item}
                  styles={styles}
                  onPress={() => void handleOpenFriendProfile(item)}
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Reviews de Amigos" />
          {friendReviews.length === 0 ? (
            <View style={styles.friendsCard}>
              <Text style={styles.emptyCardText}>Nenhuma review de amigos para mostrar ainda.</Text>
            </View>
          ) : (
            friendReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <FriendProfileModal
        visible={profileVisible}
        friendProfile={friendProfile}
        loading={loadingProfile}
        onClose={() => setProfileVisible(false)}
      />

      <Modal visible={searchModalVisible} transparent animationType="slide" onRequestClose={() => setSearchModalVisible(false)} statusBarTranslucent>
        <Pressable style={styles.modalBackdrop} onPress={() => setSearchModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Adicionar amigo</Text>
            <Text style={styles.modalSubtitle}>Busque pelo nome de usuário exato, com ou sem `@`.</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="@nome_de_usuario"
              placeholderTextColor={colors.TEXT_MUTED}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              selectionColor={colors.ACCENT}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSearchBtn} onPress={() => void handleSearchUser()} disabled={searching}>
                {searching ? (
                  <ActivityIndicator color={colors.BG_PRIMARY} size="small" />
                ) : (
                  <Text style={styles.modalSearchBtnText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>

            {searchResult ? (
              <View style={styles.resultCard}>
                <View style={styles.friendIdentity}>
                  <FriendAvatar user={searchResult} styles={styles} />
                  <View style={styles.friendMeta}>
                    <Text style={styles.friendName}>{searchResult.displayName}</Text>
                    <Text style={styles.friendUsername}>{searchResult.username}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.sendInviteBtn} onPress={() => void handleSendInvite()} disabled={sendingInvite}>
                  {sendingInvite ? (
                    <ActivityIndicator color={colors.BG_PRIMARY} size="small" />
                  ) : (
                    <Text style={styles.sendInviteText}>Enviar convite</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSearchModalVisible(false)}>
              <Text style={styles.cancelText}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
  },
  section: {
    marginTop: 20,
  },
  titleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.BG_CARD,
  },
  smallBtnText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '600',
  },
  smallBtnPrimary: {
    borderWidth: 1,
    borderColor: colors.ACCENT,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.ACCENT,
  },
  smallBtnPrimaryText: {
    color: colors.BG_PRIMARY,
    fontSize: 12,
    fontWeight: '700',
  },
  friendsCard: {
    marginHorizontal: 16,
    backgroundColor: colors.BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    overflow: 'hidden',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  friendIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.BG_INPUT,
    borderWidth: 1.5,
    borderColor: colors.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  friendAvatarText: {
    color: colors.ACCENT,
    fontSize: 13,
    fontWeight: '700',
  },
  friendMeta: {
    flex: 1,
  },
  friendName: {
    color: colors.TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  friendUsername: {
    color: colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  friendAction: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.ACCENT,
  },
  friendActionText: {
    color: colors.BG_PRIMARY,
    fontSize: 12,
    fontWeight: '700',
  },
  friendActionDanger: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.DANGER,
  },
  friendActionDangerText: {
    color: colors.DANGER,
    fontSize: 12,
    fontWeight: '700',
  },
  friendActionNeutral: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    backgroundColor: colors.BG_SECONDARY,
  },
  friendActionNeutralText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '600',
  },
  requestRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  requestAcceptBtn: {
    flex: 1,
    backgroundColor: colors.ACCENT,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  requestAcceptText: {
    color: colors.BG_PRIMARY,
    fontSize: 13,
    fontWeight: '700',
  },
  requestDeclineBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.BORDER,
    backgroundColor: colors.BG_SECONDARY,
  },
  requestDeclineText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCardText: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.BG_INPUT,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.TEXT_PRIMARY,
    fontSize: 15,
    marginBottom: 14,
  },
  modalActions: {
    marginBottom: 14,
  },
  modalSearchBtn: {
    backgroundColor: colors.ACCENT,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalSearchBtnText: {
    color: colors.BG_PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: colors.BG_CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER,
    padding: 14,
    marginBottom: 14,
    gap: 14,
  },
  sendInviteBtn: {
    backgroundColor: colors.ACCENT,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendInviteText: {
    color: colors.BG_PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.TEXT_MUTED,
    fontSize: 15,
  },
});
