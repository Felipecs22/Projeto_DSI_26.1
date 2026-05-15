import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default function CategoryButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.btn, active && styles.btnActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.BG_CARD,
    marginRight: 8,
  },
  btnActive: {
    backgroundColor: Colors.ACCENT,
    borderColor: Colors.ACCENT,
  },
  label: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.BG_PRIMARY,
    fontWeight: '700',
  },
});
