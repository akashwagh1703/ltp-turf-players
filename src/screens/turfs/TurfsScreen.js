import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
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
        
        <View style={styles.turfImageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image 
              source={{ uri: item.images[0].image_url }} 
              style={styles.turfImage}
              defaultSource={require('../../../assets/icon.png')}
            />
          ) : (
            <LinearGradient colors={['#10B981', '#34D399']} style={styles.turfImagePlaceholder}>
              <Ionicons name="football" size={32} color="white" />
            </LinearGradient>
          )}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>
        
        <View style={styles.turfContent}>
          <Text style={styles.turfName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.turfLocation} numberOfLines={1}>
              {item.city || 'Location'}{item.distance ? ` • ${item.distance}km` : ''}
            </Text>
          </View>
          <View style={styles.turfFooter}>
            <View style={styles.sportBadge}>
              <Text style={styles.sportBadgeText}>{item.sport_type || 'Football'}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.turfPrice}>₹{item.uniform_price || '500'}</Text>
              <Text style={styles.priceLabel}>/hr</Text>
            </View>
          </View>
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
    marginBottom: SIZES.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
    position: 'relative',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    ...SHADOWS.large,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  featuredText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  turfImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  turfImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  turfImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  turfContent: {
    padding: SIZES.lg,
  },
  turfName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.sm,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SIZES.md,
  },
  turfLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  turfFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sportBadgeText: {
    fontSize: 11,
    color: COLORS.primary,
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  turfPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
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
