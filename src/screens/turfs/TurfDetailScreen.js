import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { turfService } from '../../services/turfService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

export default function TurfDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTurf();
  }, []);

  const loadTurf = async () => {
    try {
      const response = await turfService.getTurf(id);
      setTurf(response.data?.data || response.data);
    } catch (error) {
      console.error('Load turf error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!turf) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Turf not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Card style={styles.card}>
          <Text style={styles.name}>{turf.name}</Text>
          <Text style={styles.location}>{turf.address}, {turf.city}, {turf.state}</Text>
          <Text style={styles.sport}>{turf.sport_type}</Text>
          <Text style={styles.price}>₹{turf.uniform_price || 'Dynamic Pricing'}/hr</Text>
          {turf.description && <Text style={styles.description}>{turf.description}</Text>}
        </Card>
        <Button title="Book Now" onPress={() => navigation.navigate('BookTurf', { turfId: turf.id, turfName: turf.name })} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: SIZES.lg,
  },
  card: {
    margin: SIZES.lg,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  location: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  sport: {
    ...FONTS.body,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SIZES.md,
  },
  description: {
    ...FONTS.body,
    color: COLORS.text,
  },
  error: {
    ...FONTS.body,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SIZES.xl,
  },
});
