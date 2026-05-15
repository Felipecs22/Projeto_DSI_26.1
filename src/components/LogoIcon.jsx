import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <Text style={[styles.icon, { fontSize: size * 0.52 }]}>🎮</Text>
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
  icon: {
    lineHeight: undefined,
  },
});
