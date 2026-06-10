import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

export default function LogoIcon({ size = 42 }) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
        },
      ]}
    >
      <Ionicons name="game-controller" size={size * 0.52} color={Colors.ACCENT} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1E35',
    borderWidth: 1.5,
    borderColor: Colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
});