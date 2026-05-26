import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default function GameStatusButton({ label = 'Status', onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderColor: Colors.ACCENT,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  label: {
    color: Colors.ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },
});
