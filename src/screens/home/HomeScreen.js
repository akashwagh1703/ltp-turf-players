import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { turfService } from '../../services/turfService';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);
  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation();
    loadTurfs();
    loadFeaturedTurfs();
  }, []);

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
      const params = location ? { lat: location.latitude, lng: location.longitude } : {};
      const response = await turfService.getTurfs(params);
      const turfsData = response.data?.data || response.data || [];
      setTurfs(Array.isArray(turfsData) ? turfsData.slice(0, 10) : []);
    } catch (error) {
      console.error('Load turfs error:', error);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedTurfs = async () => {
    try {
      const response = await turfService.getFeaturedTurfs();
      const turfsData = response.data?.data || response.data || [];
      setFeaturedTurfs(Array.isArray(turfsData) ? turfsData : []);
    } catch (error) {
      console.error('Load featured turfs error:', error);
    }
  };

  const renderFeaturedTurf = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('TurfDetail', { id: item.id })}
      activeOpacity={0.9}
    >
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0].image_url }} style={styles.featuredImage} />
      ) : (
        <View style={styles.featuredImagePlaceholder}>
          <Ionicons name="football" size={50} color={COLORS.primary} />
        </View>
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.featuredOverlay}>
        {item.is_featured && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.premiumText}>FEATURED</Text>
          </View>
        )}
        <Text style={styles.featuredName}>{item.name}</Text>
        <View style={styles.featuredInfo}>
          <View style={styles.featuredLocation}>
            <Ionicons name="location" size={14} color="#FFF" />
            <Text style={styles.featuredLocationText}>
              {item.city}{item.distance ? ` • ${item.distance} km` : ''}
            </Text>
          </View>
          <Text style={styles.featuredPrice}>₹{item.uniform_price || 'Dynamic'}/hr</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderNearbyTurf = ({ item }) => (
    <TouchableOpacity
      style={styles.nearbyCard}
      onPress={() => navigation.navigate('TurfDetail', { id: item.id })}
      activeOpacity={0.9}
    >
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0].image_url }} style={styles.nearbyImage} />
      ) : (
        <View style={styles.nearbyImagePlaceholder}>
          <Ionicons name="football" size={32} color={COLORS.primary} />
        </View>
      )}
      <View style={styles.nearbyContent}>
        <Text style={styles.nearbyName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.nearbyLocation}>
          <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.nearbyLocationText} numberOfLines={1}>
            {item.city}{item.distance ? ` • ${item.distance} km` : ''}
          </Text>
        </View>
        <View style={styles.nearbyFooter}>
          <View style={styles.nearbySportBadge}>
            <Text style={styles.nearbySportText}>{item.sport_type}</Text>
          </View>
          <Text style={styles.nearbyPrice}>₹{item.uniform_price || 'Dyn'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { loadTurfs(); loadFeaturedTurfs(); }} />} 
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'Player'} 👋</Text>
              <Text style={styles.headerTitle}>Book Your Game</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Turfs')}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchText}>Search turfs, sports...</Text>
          </TouchableOpacity>
        </LinearGradient>

        {featuredTurfs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Featured Turfs</Text>
            </View>
            <FlatList
              data={featuredTurfs}
              renderItem={renderFeaturedTurf}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
            />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{location ? '📍 Nearby Turfs' : '🏆 Top Turfs'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Turfs')}>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          {turfs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="football-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No turfs available</Text>
            </View>
          ) : (
            <FlatList
              data={turfs}
              renderItem={renderNearbyTurf}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.nearbyList}
            />
          )}
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
    paddingTop: SIZES.lg,
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xl,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.lg,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '700',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: SIZES.lg,
    paddingVertical: 12,
    borderRadius: 12,
    gap: SIZES.sm,
  },
  searchText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  featuredList: {
    paddingHorizontal: SIZES.xl,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: SIZES.lg,
    ...SHADOWS.large,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.lg,
    justifyContent: 'flex-end',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SIZES.xs,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: SIZES.xs,
  },
  featuredInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredLocationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  nearbyList: {
    paddingHorizontal: SIZES.xl,
  },
  nearbyCard: {
    width: 160,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginRight: SIZES.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  nearbyImage: {
    width: '100%',
    height: 100,
  },
  nearbyImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearbyContent: {
    padding: SIZES.md,
  },
  nearbyName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  nearbyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: SIZES.sm,
  },
  nearbyLocationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  nearbyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbySportBadge: {
    backgroundColor: COLORS.infoLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nearbySportText: {
    fontSize: 9,
    color: COLORS.secondary,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  nearbyPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    padding: SIZES.xxl,
    marginHorizontal: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SIZES.md,
  },
});
