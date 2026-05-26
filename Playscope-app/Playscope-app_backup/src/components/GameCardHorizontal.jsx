import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import StarRating from './StarRating';

export default function GameCardHorizontal({ game, onPress = undefined, onWant = undefined, style = undefined }) {
  const [imgError, setImgError] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress && onPress(game)}
      activeOpacity={0.85}
    >
      {/* Cover */}
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
            <Text style={styles.placeholderText}>{game.name}</Text>
          </View>
        )}

        {/* Review overlay */}
        {game.review ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayText} numberOfLines={5}>{game.review}</Text>
          </View>
        ) : null}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.name} numberOfLines={1}>{game.name}</Text>
          <Text style={styles.genres} numberOfLines={1}>{game.genres}</Text>
          {game.rating ? (
            <StarRating rating={game.rating} label={game.ratingLabel} />
          ) : null}
        </View>
        {onWant ? (
          <TouchableOpacity
            style={styles.wantBtn}
            onPress={() => onWant(game)}
          >
            <Text style={styles.wantBtnText}>Quero!</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: {
    width: 200,
    marginRight: 14,
    backgroundColor: colors.BG_CARD,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.BORDER,
  },
  thumb: {
    width: '100%',
    height: 220,
    backgroundColor: colors.BG_INPUT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  placeholderText: {
    color: colors.TEXT_MUTED,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.SURFACE_TINT,
    padding: 10,
  },
  overlayText: {
    color: colors.WHITE,
    fontSize: 10,
    lineHeight: 15,
    opacity: 0.8,
  },
  footer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    color: colors.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: '700',
  },
  genres: {
    color: colors.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 3,
  },
  wantBtn: {
    backgroundColor: colors.ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wantBtnText: {
    color: colors.BG_PRIMARY,
    fontSize: 11,
    fontWeight: '700',
  },
});
