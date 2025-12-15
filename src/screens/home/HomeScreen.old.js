import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { turfService } from '../../services/turfService';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTurfs();
  }, []);

  const loadTurfs = async () => {
    setLoading(true);
    try {
      const response = await turfService.getTurfs();
      const turfsData = response.data?.data || response.data || [];
      setTurfs(Array.isArray(turfsData) ? turfsData : []);
    } catch (error) {
      console.error('Load turfs error:', error);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTurfs} />} 
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#10B981', '#059669', '#047857']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'Player'} 👋</Text>
              <Text style={styles.headerTitle}>Find Your Perfect Turf</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
              <Ionicons name="notifications" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.searchCard}>
          <TouchableOpacity 
            style={styles.searchBar} 
            activeOpacity={0.8} 
            onPress={() => navigation.navigate('Turfs')}
          >
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchText}>Search turfs, sports...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Turfs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Turfs')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          {turfs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="football-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No turfs available</Text>
            </View>
          ) : (
            turfs.map((turf) => (
              <TouchableOpacity
                key={turf.id}
                onPress={() => navigation.navigate('TurfDetail', { id: turf.id })}
                activeOpacity={0.9}
              >
                <View style={styles.turfCard}>
                  {turf.images && turf.images.length > 0 ? (
                    <ScrollView 
                      horizontal 
                      pagingEnabled 
                      showsHorizontalScrollIndicator={false}
                      style={styles.imageSlider}
                    >
                      {turf.images.map((img, index) => (
                        <Image 
                          key={index}
                          source={{ uri: img.image_url }} 
                          style={styles.turfImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={styles.turfImagePlaceholder}>
                      <Ionicons name="football" size={40} color={COLORS.primary} />
                    </View>
                  )}
                  <View style={styles.turfContent}>
                    <Text style={styles.turfName}>{turf.name}</Text>
                    <View style={styles.turfLocationRow}>
                      <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.turfLocation}>{turf.city}, {turf.state}</Text>
                    </View>
                    <View style={styles.turfFooter}>
                      <View style={styles.sportBadge}>
                        <Text style={styles.sportBadgeText}>{turf.sport_type}</Text>
                      </View>
                      <Text style={styles.turfPrice}>₹{turf.uniform_price || 'Dynamic'}/hr</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
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
    paddingBottom: SIZES.xxl * 2,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: SIZES.xs,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '700',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCard: {
    marginTop: -SIZES.xxl,
    marginHorizontal: SIZES.xl,
    marginBottom: SIZES.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.lg,
    borderRadius: SIZES.radiusLg,
    gap: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SIZES.xl,
    marginBottom: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    padding: SIZES.xxl,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SIZES.md,
  },
  turfCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageSlider: {
    width: '100%',
    height: 180,
  },
  turfImage: {
    width: SCREEN_WIDTH - 48,
    height: 180,
  },
  turfImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turfContent: {
    padding: SIZES.lg,
  },
  turfName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  turfLocationRow: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportBadge: {
    backgroundColor: COLORS.infoLight,
    paddingHorizontal: SIZES.md,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sportBadgeText: {
    fontSize: 10,
    color: COLORS.secondary,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  turfPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
