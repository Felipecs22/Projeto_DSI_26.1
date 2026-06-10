import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CategoryButton({ label, active, onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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

const createStyles = (colors) => StyleSheet.create({
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.BORDER,
    backgroundColor: colors.BG_CARD,
    marginRight: 8,
  },
  btnActive: {
    backgroundColor: colors.ACCENT,
    borderColor: colors.ACCENT,
  },
  label: {
    color: colors.TEXT_SECONDARY,
    fontSize: 12,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.BG_PRIMARY,
    fontWeight: '700',
  },
});
