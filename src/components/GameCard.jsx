import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Colors from '../constants/colors';
import StarRating from './StarRating';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 12) / 2; // 2 cols with padding + gap

export default function GameCard({ 
  game, 
  onPress = () => {}, 
  showRating = false, 
  showWantBtn = false, 
  onWant = () => {} 
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(game)} activeOpacity={0.85}>
      <View style={styles.thumb}>
        {game.image && !imgError ? (
          <Image
            source={{ uri: game.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText} numberOfLines={3}>{game.name}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{game.name}</Text>
        <Text style={styles.genres} numberOfLines={1}>{game.genres}</Text>

        {showRating && game.rating ? (
          <View style={styles.ratingRow}>
            <StarRating rating={game.rating} label={game.ratingLabel} />
          </View>
        ) : null}

        {showWantBtn ? (
          <TouchableOpacity
            style={styles.wantBtn}
            onPress={() => onWant && onWant(game)}
          >
            <Text style={styles.wantBtnText}>Quero!</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  thumb: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.BG_CARD,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.BG_CARD,
  },
  placeholderText: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  info: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  name: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  genres: {
    color: Colors.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 4,
  },
  wantBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  wantBtnText: {
    color: Colors.BG_PRIMARY,
    fontSize: 11,
    fontWeight: '700',
  },
});
