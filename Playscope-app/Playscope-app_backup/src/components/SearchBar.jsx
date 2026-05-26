import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default function SearchBar({ value, onChangeText, placeholder = 'Digite o jogo/gênero' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.TEXT_MUTED}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BG_INPUT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    paddingHorizontal: 14,
    height: 40,
    gap: 8,
  },
  icon: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: Colors.TEXT_PRIMARY,
    fontSize: 13,
    paddingVertical: 0,
  },
});
