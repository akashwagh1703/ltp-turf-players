import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/common/Card';
import { turfService } from '../../services/turfService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

export default function HomeScreen({ navigation }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    setLoading(true);
    try {
      const response = await turfService.getFeatured();
      setFeatured(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Load featured error:', error);
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  };

  const sports = ['Football', 'Cricket', 'Badminton', 'Basketball'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadFeatured} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Turf</Text>
          <Text style={styles.subtitle}>Book and play your favorite sport</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sports</Text>
          <View style={styles.sportsGrid}>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport}
                style={styles.sportCard}
                onPress={() => navigation.navigate('Turfs', { sport })}
              >
                <Text style={styles.sportName}>{sport}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Turfs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Turfs')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {featured.map((turf) => (
            <TouchableOpacity
              key={turf.id}
              onPress={() => navigation.navigate('TurfDetail', { id: turf.id })}
            >
              <Card style={styles.turfCard}>
                <Text style={styles.turfName}>{turf.name}</Text>
                <Text style={styles.turfLocation}>{turf.city}, {turf.state}</Text>
                <Text style={styles.turfSport}>{turf.sport_type}</Text>
                <Text style={styles.turfPrice}>₹{turf.uniform_price || 'Dynamic'}/hr</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.lg,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  section: {
    padding: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  seeAll: {
    ...FONTS.caption,
    color: COLORS.primary,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.md,
  },
  sportCard: {
    width: '47%',
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    marginBottom: SIZES.md,
    marginRight: '3%',
  },
  sportName: {
    ...FONTS.body,
    fontWeight: '600',
    color: '#FFF',
  },
  turfCard: {
    marginBottom: SIZES.md,
  },
  turfName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  turfLocation: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  turfSport: {
    ...FONTS.caption,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  turfPrice: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
