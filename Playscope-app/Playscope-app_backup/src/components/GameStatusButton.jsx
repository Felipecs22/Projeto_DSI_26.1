import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function GameStatusButton({ label = 'Status', onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderColor: colors.ACCENT,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  label: {
    color: colors.ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },
});
