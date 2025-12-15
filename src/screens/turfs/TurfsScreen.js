import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { turfService } from '../../services/turfService';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

export default function TurfsScreen({ navigation, route }) {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const sport = route.params?.sport;

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    loadTurfs();
  }, [sport, location]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const loadTurfs = async () => {
    setLoading(true);
    try {
      const params = sport ? { sport_type: sport } : {};
      if (location) {
        params.lat = location.latitude;
        params.lng = location.longitude;
      }
      const response = await turfService.getTurfs(params);
      const turfsData = response.data?.data || response.data || [];
      setTurfs(Array.isArray(turfsData) ? turfsData : []);
    } catch (error) {
      console.error('Load turfs error:', error);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  const renderTurf = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('TurfDetail', { id: item.id })}
      activeOpacity={0.9}
    >
      <View style={[styles.turfCard, item.is_featured && styles.featuredCard]}>
        {item.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFF" />
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
        <View style={styles.turfIconCircle}>
          <Ionicons name="football" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.turfContent}>
          <Text style={styles.turfName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.turfLocation}>
              {item.city}, {item.state}
              {item.distance && ` • ${item.distance} km`}
            </Text>
          </View>
          <View style={styles.turfFooter}>
            <View style={styles.sportBadge}>
              <Text style={styles.sportBadgeText}>{item.sport_type}</Text>
            </View>
            <View style={styles.sizeInfo}>
              <Ionicons name="resize-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.sizeText}>{item.size}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.turfPrice}>₹{item.uniform_price || 'Dynamic'}</Text>
          <Text style={styles.priceLabel}>/hr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Text style={styles.headerTitle}>{sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : 'All'} Turfs</Text>
        <Text style={styles.headerSubtitle}>Find the perfect turf for your game</Text>
      </LinearGradient>

      {turfs.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="football-outline" size={60} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Turfs Found</Text>
          <Text style={styles.emptyText}>Try searching for different sports or locations</Text>
        </View>
      ) : (
        <FlatList
          data={turfs}
          renderItem={renderTurf}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTurfs} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.xl,
    paddingHorizontal: SIZES.xl,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: SIZES.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  list: {
    padding: SIZES.xl,
  },
  turfCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    flexDirection: 'row',
    gap: SIZES.md,
    ...SHADOWS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    ...SHADOWS.large,
  },
  featuredBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    zIndex: 10,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    zIndex: 10,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  newBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    zIndex: 10,
  },
  newText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  turfIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turfContent: {
    flex: 1,
  },
  turfName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SIZES.sm,
  },
  turfLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  turfFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  sportBadge: {
    backgroundColor: COLORS.infoLight,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sportBadgeText: {
    fontSize: 10,
    color: COLORS.secondary,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  sizeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  turfPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xxl,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
