import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({ value, onChangeText, placeholder = 'Digite o jogo/gênero' }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.TEXT_MUTED}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.BG_INPUT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.BORDER,
    paddingHorizontal: 14,
    height: 40,
    gap: 8,
  },
  icon: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: colors.TEXT_PRIMARY,
    fontSize: 13,
    paddingVertical: 0,
  },
});
