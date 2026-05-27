import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// The accent color used for avatar decorations
const ACCENT = '#00D394';
const BORDER_DASH = '#1C2633';

// ─── Ninja ───────────────────────────────────────────────────────────────────
function NinjaAvatar({ size }) {
  const s = size;
  return (
    <View style={[styles.avatarBg, { width: s, height: s, borderRadius: s / 2 }]}>
      <View style={[styles.ninjaBand, { top: s * 0.22, height: s * 0.13, borderRadius: s * 0.065 }]} />
      <View style={[styles.ninjaMask, { top: s * 0.38, height: s * 0.24, borderRadius: s * 0.06 }]} />
      <View style={{ position: 'absolute', top: s * 0.41, flexDirection: 'row', gap: s * 0.06, left: s * 0.26 }}>
        <View style={[styles.ninjaEye, { width: s * 0.15, height: s * 0.12 }]}>
          <View style={[styles.ninjaIris, { width: s * 0.07, height: s * 0.07 }]} />
        </View>
        <View style={[styles.ninjaEye, { width: s * 0.15, height: s * 0.12 }]}>
          <View style={[styles.ninjaIris, { width: s * 0.07, height: s * 0.07 }]} />
        </View>
      </View>
      <Text style={[styles.shurikenText, { fontSize: s * 0.18, bottom: s * 0.12 }]}>✦</Text>
    </View>
  );
}

// ─── Robot ───────────────────────────────────────────────────────────────────
function RobotAvatar({ size }) {
  const s = size;
  return (
    <View style={[styles.avatarBg, { width: s, height: s, borderRadius: s / 2 }]}>
      <View style={[styles.robotAntenna, { width: s * 0.05, height: s * 0.15, top: s * 0.08, left: s * 0.475 }]} />
      <View style={[styles.robotAntennaTop, { width: s * 0.12, height: s * 0.12, top: s * 0.03, left: s * 0.44 }]} />
      <View style={[styles.robotHead, { top: s * 0.22, left: s * 0.17, width: s * 0.66, height: s * 0.5, borderRadius: s * 0.08 }]}>
        <View style={{ flexDirection: 'row', gap: s * 0.06, marginTop: s * 0.08, marginLeft: s * 0.06 }}>
          <View style={[styles.robotEye, { width: s * 0.22, height: s * 0.15 }]} />
          <View style={[styles.robotEye, { width: s * 0.22, height: s * 0.15 }]} />
        </View>
        <View style={[styles.robotMouth, { marginTop: s * 0.05, marginHorizontal: s * 0.06, height: s * 0.1, borderRadius: s * 0.04 }]}>
          {[0,1,2,3,4].map(i => (
            <View key={i} style={[styles.robotLed, { opacity: i % 2 === 0 ? 1 : 0.3 }]} />
          ))}
        </View>
      </View>
      <View style={[styles.robotBolt, { top: s * 0.35, left: s * 0.08 }]} />
      <View style={[styles.robotBolt, { top: s * 0.35, right: s * 0.08 }]} />
    </View>
  );
}

// ─── Cowboy ──────────────────────────────────────────────────────────────────
function CowboyAvatar({ size }) {
  const s = size;
  return (
    <View style={[styles.avatarBg, { width: s, height: s, borderRadius: s / 2 }]}>
      <View style={[styles.cowboyHatTop, { top: s * 0.08, left: s * 0.28, width: s * 0.44, height: s * 0.28, borderRadius: s * 0.06 }]} />
      <View style={[styles.cowboyHatBrim, { top: s * 0.32, height: s * 0.06, left: s * 0.12, right: s * 0.12, borderRadius: s * 0.04 }]} />
      <Text style={[styles.cowboyStar, { top: s * 0.14, fontSize: s * 0.12, left: s * 0.44 }]}>★</Text>
      <View style={{ position: 'absolute', top: s * 0.45, flexDirection: 'row', gap: s * 0.1, left: s * 0.28 }}>
        <View style={[styles.cowboyEye, { width: s * 0.13, height: s * 0.11 }]}>
          <View style={[styles.cowboyIris, { width: s * 0.065, height: s * 0.065 }]} />
        </View>
        <View style={[styles.cowboyEye, { width: s * 0.13, height: s * 0.11 }]}>
          <View style={[styles.cowboyIris, { width: s * 0.065, height: s * 0.065 }]} />
        </View>
      </View>
      <Text style={[styles.mustache, { top: s * 0.56, fontSize: s * 0.14 }]}>〜</Text>
      <View style={[styles.cowboyBandana, { bottom: s * 0.1, height: s * 0.12, left: s * 0.15, right: s * 0.15, borderRadius: s * 0.04 }]} />
    </View>
  );
}

// ─── Empty ───────────────────────────────────────────────────────────────────
function EmptyAvatar({ size }) {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.avatarBg,
      {
        width: size, height: size, borderRadius: size / 2,
        borderStyle: 'dashed', borderColor: colors.BORDER,
      },
    ]}>
      <Text style={{ fontSize: size * 0.4 }}>👤</Text>
    </View>
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────
export const AVATAR_LIST = [
  { id: 'ninja',  label: 'Ninja',  Component: NinjaAvatar  },
  { id: 'robot',  label: 'Robô',   Component: RobotAvatar  },
  { id: 'cowboy', label: 'Cowboy', Component: CowboyAvatar },
];

export default function ProfileAvatar({ avatarId, size = 80 }) {
  const found = AVATAR_LIST.find(a => a.id === avatarId);
  if (!found) return <EmptyAvatar size={size} />;
  const { Component } = found;
  return <Component size={size} />;
}

// Avatars use fixed artistic colors — the ACCENT is the app's green (#00D394)
// which is part of the character design and doesn't change with theme.
const styles = StyleSheet.create({
  avatarBg: {
    backgroundColor: '#1A2133',
    borderWidth: 2,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  // Ninja
  ninjaBand:   { position: 'absolute', left: '15%', right: '15%', backgroundColor: '#1A3A1A' },
  ninjaMask:   { position: 'absolute', left: '15%', right: '15%', backgroundColor: '#0D1520' },
  ninjaEye:    { backgroundColor: '#fff', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  ninjaIris:   { backgroundColor: '#111', borderRadius: 99 },
  shurikenText:{ position: 'absolute', color: ACCENT, fontWeight: '900' },

  // Robot
  robotAntenna:    { position: 'absolute', backgroundColor: ACCENT, opacity: 0.7 },
  robotAntennaTop: { position: 'absolute', backgroundColor: ACCENT, borderRadius: 99 },
  robotHead:       { position: 'absolute', backgroundColor: '#243045', borderWidth: 1.5, borderColor: ACCENT, overflow: 'hidden' },
  robotEye:        { backgroundColor: ACCENT, borderRadius: 3, opacity: 0.85 },
  robotMouth:      { backgroundColor: '#1A2640', borderWidth: 1, borderColor: 'rgba(0,211,148,0.4)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 6 },
  robotLed:        { width: 5, height: 5, borderRadius: 3, backgroundColor: ACCENT },
  robotBolt:       { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT, opacity: 0.5 },

  // Cowboy
  cowboyHatTop:  { position: 'absolute', backgroundColor: '#3A2510', borderWidth: 1, borderColor: 'rgba(200,134,10,0.5)' },
  cowboyHatBrim: { position: 'absolute', backgroundColor: '#2A1A08' },
  cowboyStar:    { position: 'absolute', color: '#F5C842' },
  cowboyEye:     { backgroundColor: '#fff', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  cowboyIris:    { backgroundColor: '#4A2800', borderRadius: 99 },
  mustache:      { position: 'absolute', color: '#5A3010', fontWeight: '900', width: '100%', textAlign: 'center' },
  cowboyBandana: { position: 'absolute', backgroundColor: '#8B0000', opacity: 0.75 },
});