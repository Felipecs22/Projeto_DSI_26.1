import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  const { user, game, rating, ratingLabel, text, online } = review;

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={[styles.avatar, { borderColor: online ? Colors.ONLINE : Colors.BORDER }]}>
        <Text style={styles.avatarIcon}>👤</Text>
        <View style={[styles.onlineDot, { backgroundColor: online ? Colors.ONLINE : Colors.OFFLINE }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.username} numberOfLines={1}>
            {user}{' '}
            <Text style={styles.gameName}>"{game}"</Text>
          </Text>
          <StarRating rating={rating} label={ratingLabel} />
        </View>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.BG_CARD,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.BG_INPUT,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  avatarIcon: {
    fontSize: 18,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: -1,
    right: -1,
    borderWidth: 2,
    borderColor: Colors.BG_CARD,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 4,
  },
  username: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  gameName: {
    color: Colors.ACCENT,
    fontWeight: '400',
  },
  text: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 12,
    lineHeight: 18,
  },
});
