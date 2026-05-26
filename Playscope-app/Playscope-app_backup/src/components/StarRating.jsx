import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default function StarRating({ rating = 0, label, size = 'sm' }) {
  const filled  = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty   = 5 - filled - (hasHalf ? 1 : 0);
  const starSize = size === 'lg' ? 14 : 11;

  return (
    <View style={styles.row}>
      {Array.from({ length: filled }).map((_, i) => (
        <Text key={`f${i}`} style={[styles.star, { fontSize: starSize }]}>★</Text>
      ))}
      {hasHalf ? (
        <Text style={[styles.starHalf, { fontSize: starSize }]}>★</Text>
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Text key={`e${i}`} style={[styles.starEmpty, { fontSize: starSize }]}>★</Text>
      ))}
      {label ? (
        <Text style={[styles.label, { fontSize: starSize - 1 }]}> {label}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: Colors.STAR,
  },
  starHalf: {
    color: Colors.STAR,
    opacity: 0.6,
  },
  starEmpty: {
    color: Colors.TEXT_MUTED,
  },
  label: {
    color: Colors.ACCENT,
    fontWeight: '600',
    marginLeft: 2,
  },
});
