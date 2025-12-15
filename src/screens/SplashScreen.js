import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#10B981', '#059669', '#047857']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="football" size={60} color="#FFF" />
        </View>
        <Text style={styles.appName}>Let's Turf Play</Text>
        <Text style={styles.tagline}>Book Your Game, Play Your Way</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.xxl * 2,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    ...FONTS.h1,
    color: '#FFF',
    fontWeight: '700',
    marginBottom: SIZES.sm,
  },
  tagline: {
    ...FONTS.body,
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    alignItems: 'center',
  },
  version: {
    ...FONTS.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: SIZES.md,
  },
});
