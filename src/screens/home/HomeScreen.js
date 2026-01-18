import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl, 
  Image, 
  Dimensions, 
  FlatList,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { turfService } from '../../services/turfService';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const NEARBY_CARD_WIDTH = SCREEN_WIDTH * 0.42;

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { id: 1, title: 'Book Now', icon: 'calendar', color: '#FF6B6B', screen: 'Turfs' },
    { id: 2, title: 'My Bookings', icon: 'list', color: '#4ECDC4', screen: 'Bookings' },
    { id: 3, title: 'Favorites', icon: 'heart', color: '#45B7D1', screen: 'Turfs' },
    { id: 4, title: 'Reviews', icon: 'star', color: '#F7DC6F', screen: 'MyReviews' },
  ];

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={item.icon} size={24} color="white" />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedTurf = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { marginLeft: index === 0 ? SIZES.xl : 0 }]}
      onPress={() => navigation.navigate('TurfDetail', { id: item.id })}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image 
            source={{ uri: item.images[0].image_url }} 
            style={styles.featuredImage}
            defaultSource={require('../../../assets/icon.png')}
          />
        ) : (
          <LinearGradient colors={['#10B981', '#34D399']} style={styles.featuredImagePlaceholder}>
            <Ionicons name="football" size={50} color="white" />
          </LinearGradient>
        )}
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.7)']} 
          style={styles.featuredOverlay}
        >
          {item.is_featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.featuredBadgeText}>FEATURED</Text>
            </View>
          )}
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.featuredLocation}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.featuredLocationText} numberOfLines={1}>
                {item.city || 'Location'}{item.distance ? ` • ${item.distance}km` : ''}
              </Text>
            </View>
            <View style={styles.featuredFooter}>
              <View style={styles.featuredRating}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.featuredRatingText}>4.8</Text>
              </View>
              <Text style={styles.featuredPrice}>₹{item.uniform_price || '500'}/hr</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyTurf = ({ item }) => (
    <TouchableOpacity
      style={styles.nearbyCardVertical}
      onPress={() => navigation.navigate('TurfDetail', { id: item.id })}
      activeOpacity={0.9}
    >
      <View style={styles.nearbyImageContainerVertical}>
        {item.images && item.images.length > 0 ? (
          <Image 
            source={{ uri: item.images[0].image_url }} 
            style={styles.nearbyImageVertical}
            defaultSource={require('../../../assets/icon.png')}
          />
        ) : (
          <LinearGradient colors={['#10B981', '#34D399']} style={styles.nearbyImagePlaceholderVertical}>
            <Ionicons name="football" size={32} color="white" />
          </LinearGradient>
        )}
        <View style={styles.nearbyBadgeVertical}>
          <Text style={styles.nearbyBadgeTextVertical}>{item.sport_type || 'Football'}</Text>
        </View>
        <View style={styles.nearbyRatingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.nearbyRatingBadgeText}>4.5</Text>
        </View>
      </View>
      <View style={styles.nearbyContentVertical}>
        <View style={styles.nearbyHeaderVertical}>
          <Text style={styles.nearbyNameVertical} numberOfLines={2}>{item.name}</Text>
        </View>
        <View style={styles.nearbyLocationVertical}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.nearbyLocationTextVertical} numberOfLines={1}>
            {item.city || 'Location'}{item.distance ? ` • ${item.distance}km` : ''}
          </Text>
        </View>
        <View style={styles.nearbyFooterVertical}>
          <View style={styles.nearbyPriceContainer}>
            <Text style={styles.nearbyPriceVertical}>₹{item.uniform_price || '500'}</Text>
            <Text style={styles.nearbyPriceUnit}>/hr</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <LinearGradient 
        colors={['#10B981', '#059669']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Player'}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.searchContainer} 
          onPress={() => navigation.navigate('Turfs')}
          activeOpacity={0.8}
        >
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchPlaceholder}>Find turfs near you...</Text>
            <View style={styles.searchIcon}>
              <Ionicons name="options" size={16} color={COLORS.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={() => { loadTurfs(); loadFeaturedTurfs(); }}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <FlatList
              data={quickActions}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsList}
            />
          </View>

          {/* Featured Turfs */}
          {featuredTurfs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Turfs')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={featuredTurfs}
                renderItem={renderFeaturedTurf}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 16}
                decelerationRate="fast"
                contentContainerStyle={{ paddingRight: SIZES.xl }}
              />
            </View>
          )}

          {/* Nearby Turfs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {location ? '📍 Near You' : '⚡ Popular'}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Turfs')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {turfs.length === 0 ? (
              <View style={styles.emptyState}>
                <LinearGradient colors={['#10B981', '#34D399']} style={styles.emptyIcon}>
                  <Ionicons name="football-outline" size={32} color="white" />
                </LinearGradient>
                <Text style={styles.emptyTitle}>No turfs found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your location or search filters</Text>
              </View>
            ) : (
              <View style={styles.nearbyVerticalContainer}>
                {turfs.map((item, index) => (
                  <View key={`nearby-turf-${item.id || index}`}>
                    {renderNearbyTurf({ item })}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: SIZES.md,
    paddingBottom: SIZES.xl,
    paddingHorizontal: SIZES.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '700',
  },

  searchContainer: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    ...SHADOWS.medium,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 12,
    fontWeight: '500',
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: SIZES.lg,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickActionsList: {
    paddingHorizontal: SIZES.xl,
  },
  quickActionCard: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...SHADOWS.medium,
  },
  quickActionIcon: {
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    ...SHADOWS.large,
  },
  featuredImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  featuredInfo: {
    flex: 1,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  featuredLocationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  nearbyVerticalContainer: {
    paddingHorizontal: SIZES.xl,
  },
  nearbyCardVertical: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 120,
    ...SHADOWS.medium,
  },
  nearbyImageContainerVertical: {
    width: 120,
    height: '100%',
    position: 'relative',
  },
  nearbyImageVertical: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nearbyImagePlaceholderVertical: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearbyBadgeVertical: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  nearbyBadgeTextVertical: {
    fontSize: 9,
    fontWeight: '700',
    color: 'white',
    textTransform: 'capitalize',
  },
  nearbyRatingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  nearbyRatingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  nearbyContentVertical: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  nearbyHeaderVertical: {
    marginBottom: 8,
  },
  nearbyNameVertical: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  nearbyLocationVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  nearbyLocationTextVertical: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  nearbyFooterVertical: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nearbyPriceVertical: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  nearbyPriceUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SIZES.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
