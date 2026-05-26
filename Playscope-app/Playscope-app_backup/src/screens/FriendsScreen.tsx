import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { friendsList, friendReviews, feedItems } from '../constants/data';
import SectionTitle from '../components/SectionTitle';
import ReviewCard from '../components/ReviewCard';
import { useTheme } from '../context/ThemeContext';

function FriendItem({ friend }: { friend: any }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity style={styles.friendItem} activeOpacity={0.75}>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarIcon}>👤</Text>
        <View
          style={[
            styles.onlineDot,
            { backgroundColor: friend.online ? colors.ONLINE : colors.OFFLINE },
          ]}
        />
      </View>
      <Text style={styles.friendName}>{friend.name}</Text>
    </TouchableOpacity>
  );
}

function FeedItem({ item }: { item: any }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.feedItem}>
      <View style={styles.feedDot} />
      <Text style={styles.feedText}>
        <Text style={styles.feedUser}>{item.user}</Text>
        {' '}{item.action}{' '}
        <Text style={styles.feedGame}>{item.game}</Text>
      </Text>
    </View>
  );
}

export default function FriendsScreen() {
  const { colors, darkMode } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.BG_PRIMARY} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Lista de amigos */}
        <View style={styles.section}>
          <SectionTitle title="Lista de Amigos" />
          <View style={styles.friendsCard}>
            {friendsList.map((f) => (
              <FriendItem key={f.id} friend={f} />
            ))}
          </View>
        </View>

        {/* Reviews de amigos */}
        <View style={styles.section}>
          <SectionTitle title="Reviews de Amigos" />
          {friendReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </View>

        {/* Feed recente */}
        <View style={styles.section}>
          <SectionTitle title="Feed Recente" />
          <View style={styles.feedCard}>
            {feedItems.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
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

  // Friend item
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
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
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
    position: 'relative',
  },
  friendAvatarIcon: {
    fontSize: 18,
  },
  onlineDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    position: 'absolute',
    bottom: -1,
    right: -1,
    borderWidth: 2,
    borderColor: colors.BG_CARD,
  },
  friendName: {
    color: colors.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },

  // Feed
  feedCard: {
    marginHorizontal: 16,
    backgroundColor: colors.BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER,
    overflow: 'hidden',
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  feedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ACCENT,
    flexShrink: 0,
  },
  feedText: {
    color: colors.TEXT_SECONDARY,
    fontSize: 13,
    flex: 1,
  },
  feedUser: {
    color: colors.TEXT_PRIMARY,
    fontWeight: '700',
  },
  feedGame: {
    color: colors.ACCENT,
    fontWeight: '600',
  },
});
