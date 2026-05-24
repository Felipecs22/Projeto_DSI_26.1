import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

// Passando = '' e = null, o TypeScript entende que elas são opcionais
export default function SectionTitle({ title, subtitle = '', rightElement = null }) {
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightElement || null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.ACCENT,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
});