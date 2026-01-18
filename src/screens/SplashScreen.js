import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
          />
        </View>
        <Text style={styles.appName}>LTP</Text>
        <Text style={styles.tagline}>Let's Turf Play</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
});