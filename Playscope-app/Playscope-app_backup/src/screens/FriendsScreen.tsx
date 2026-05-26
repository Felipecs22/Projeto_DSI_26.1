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
import Colors from '../constants/colors';
import { friendsList, friendReviews, feedItems } from '../constants/data';
import SectionTitle from '../components/SectionTitle';
import ReviewCard from '../components/ReviewCard';

function FriendItem({ friend }: { friend: any }) {
  return (
    <TouchableOpacity style={styles.friendItem} activeOpacity={0.75}>
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarIcon}>👤</Text>
        <View
          style={[
            styles.onlineDot,
            { backgroundColor: friend.online ? Colors.ONLINE : Colors.OFFLINE },
          ]}
        />
      </View>
      <Text style={styles.friendName}>{friend.name}</Text>
    </TouchableOpacity>
  );
}

function FeedItem({ item }: { item: any }) {
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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BG_PRIMARY} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_PRIMARY,
  },
  section: {
    marginTop: 20,
  },

  // Friend item
  friendsCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: 'hidden',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BG_INPUT,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
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
    borderColor: Colors.BG_CARD,
  },
  friendName: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },

  // Feed
  feedCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: 'hidden',
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  feedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.ACCENT,
    flexShrink: 0,
  },
  feedText: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 13,
    flex: 1,
  },
  feedUser: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: '700',
  },
  feedGame: {
    color: Colors.ACCENT,
    fontWeight: '600',
  },
});
