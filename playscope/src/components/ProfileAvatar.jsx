import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

// ─── Ninja ───────────────────────────────────────────────────────────────────
function NinjaAvatar({ size }) {
  const s = size;
  return (
    <View style={[styles.avatarBg, { width: s, height: s, borderRadius: s / 2 }]}>
      {/* Headband */}
      <View style={[styles.ninjaBand, { top: s * 0.22, height: s * 0.13, borderRadius: s * 0.065 }]} />
      {/* Mask */}
      <View style={[styles.ninjaMask, { top: s * 0.38, height: s * 0.24, borderRadius: s * 0.06 }]} />
      {/* Eyes */}
      <View style={{ position: 'absolute', top: s * 0.41, flexDirection: 'row', gap: s * 0.06, left: s * 0.26 }}>
        <View style={[styles.ninjaEye, { width: s * 0.15, height: s * 0.12 }]}>
          <View style={[styles.ninjaIris, { width: s * 0.07, height: s * 0.07 }]} />
        </View>
        <View style={[styles.ninjaEye, { width: s * 0.15, height: s * 0.12 }]}>
          <View style={[styles.ninjaIris, { width: s * 0.07, height: s * 0.07 }]} />
        </View>
      </View>
      {/* Star shuriken accent */}
      <Text style={[styles.shurikenText, { fontSize: s * 0.18, bottom: s * 0.12 }]}>✦</Text>
    </View>
  );
}

// ─── Robot ───────────────────────────────────────────────────────────────────
function RobotAvatar({ size }) {
  const s = size;
  return (
    <View style={[styles.avatarBg, { width: s, height: s, borderRadius: s / 2 }]}>
      {/* Antenna */}
      <View style={[styles.robotAntenna, { width: s * 0.05, height: s * 0.15, top: s * 0.08, left: s * 0.475 }]} />
      <View style={[styles.robotAntennaTop, { width: s * 0.12, height: s * 0.12, top: s * 0.03, left: s * 0.44 }]} />
      {/* Head box */}
      <View style={[styles.robotHead, { top: s * 0.22, left: s * 0.17, width: s * 0.66, height: s * 0.5, borderRadius: s * 0.08 }]}>
        {/* Eye panels */}
        <View style={{ flexDirection: 'row', gap: s * 0.06, marginTop: s * 0.08, marginLeft: s * 0.06 }}>
          <View style={[styles.robotEye, { width: s * 0.22, height: s * 0.15 }]} />
          <View style={[styles.robotEye, { width: s * 0.22, height: s * 0.15 }]} />
        </View>
        {/* Mouth LEDs */}
        <View style={[styles.robotMouth, { marginTop: s * 0.05, marginHorizontal: s * 0.06, height: s * 0.1, borderRadius: s * 0.04 }]}>
          {[0,1,2,3,4].map(i => (
            <View key={i} style={[styles.robotLed, { opacity: i % 2 === 0 ? 1 : 0.3 }]} />
          ))}
        </View>
      </View>
      {/* Ear bolts */}
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
      {/* Hat top */}
      <View style={[styles.cowboyHatTop, { top: s * 0.08, left: s * 0.28, width: s * 0.44, height: s * 0.28, borderRadius: s * 0.06 }]} />
      {/* Hat brim */}
      <View style={[styles.cowboyHatBrim, { top: s * 0.32, height: s * 0.06, left: s * 0.12, right: s * 0.12, borderRadius: s * 0.04 }]} />
      {/* Star badge */}
      <Text style={[styles.cowboyStar, { top: s * 0.14, fontSize: s * 0.12, left: s * 0.44 }]}>★</Text>
      {/* Eyes */}
      <View style={{ position: 'absolute', top: s * 0.45, flexDirection: 'row', gap: s * 0.1, left: s * 0.28 }}>
        <View style={[styles.cowboyEye, { width: s * 0.13, height: s * 0.11 }]}>
          <View style={[styles.cowboyIris, { width: s * 0.065, height: s * 0.065 }]} />
        </View>
        <View style={[styles.cowboyEye, { width: s * 0.13, height: s * 0.11 }]}>
          <View style={[styles.cowboyIris, { width: s * 0.065, height: s * 0.065 }]} />
        </View>
      </View>
      {/* Mustache */}
      <Text style={[styles.mustache, { top: s * 0.56, fontSize: s * 0.14 }]}>〜</Text>
      {/* Bandana */}
      <View style={[styles.cowboyBandana, { bottom: s * 0.1, height: s * 0.12, left: s * 0.15, right: s * 0.15, borderRadius: s * 0.04 }]} />
    </View>
  );
}

// ─── Empty ───────────────────────────────────────────────────────────────────
function EmptyAvatar({ size }) {
  return (
    <View style={[styles.avatarBg, styles.emptyBg, { width: size, height: size, borderRadius: size / 2, borderStyle: 'dashed' }]}>
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

export default function ProfileAvatar({ avatarId, photoURL = null, size = 80 }) {
  if (photoURL) {
    const { Image } = require('react-native');
    return (
      <Image
        source={{ uri: photoURL }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: Colors.ACCENT,
        }}
      />
    );
  }

  const found = AVATAR_LIST.find(a => a.id === avatarId);
  if (!found) return <EmptyAvatar size={size} />;
  const { Component } = found;
  return <Component size={size} />;
}

const styles = StyleSheet.create({
  avatarBg: {
    backgroundColor: '#1A2133',
    borderWidth: 2,
    borderColor: Colors.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  emptyBg: {
    borderColor: Colors.BORDER,
    borderStyle: 'dashed',
  },

  // Ninja
  ninjaBand: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    backgroundColor: '#1A3A1A',
  },
  ninjaMask: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    backgroundColor: '#0D1520',
  },
  ninjaEye: {
    backgroundColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ninjaIris: {
    backgroundColor: '#111',
    borderRadius: 99,
  },
  shurikenText: {
    position: 'absolute',
    color: Colors.ACCENT,
    fontWeight: '900',
  },

  // Robot
  robotAntenna: {
    position: 'absolute',
    backgroundColor: Colors.ACCENT,
    opacity: 0.7,
  },
  robotAntennaTop: {
    position: 'absolute',
    backgroundColor: Colors.ACCENT,
    borderRadius: 99,
  },
  robotHead: {
    position: 'absolute',
    backgroundColor: '#243045',
    borderWidth: 1.5,
    borderColor: Colors.ACCENT,
    overflow: 'hidden',
  },
  robotEye: {
    backgroundColor: Colors.ACCENT,
    borderRadius: 3,
    opacity: 0.85,
  },
  robotMouth: {
    backgroundColor: '#1A2640',
    borderWidth: 1,
    borderColor: 'rgba(0,211,148,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  robotLed: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.ACCENT,
  },
  robotBolt: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.ACCENT,
    opacity: 0.5,
  },

  // Cowboy
  cowboyHatTop: {
    position: 'absolute',
    backgroundColor: '#3A2510',
    borderWidth: 1,
    borderColor: 'rgba(200,134,10,0.5)',
  },
  cowboyHatBrim: {
    position: 'absolute',
    backgroundColor: '#2A1A08',
  },
  cowboyStar: {
    position: 'absolute',
    color: '#F5C842',
  },
  cowboyEye: {
    backgroundColor: '#fff',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cowboyIris: {
    backgroundColor: '#4A2800',
    borderRadius: 99,
  },
  mustache: {
    position: 'absolute',
    color: '#5A3010',
    fontWeight: '900',
    width: '100%',
    textAlign: 'center',
  },
  cowboyBandana: {
    position: 'absolute',
    backgroundColor: '#8B0000',
    opacity: 0.75,
  },
});