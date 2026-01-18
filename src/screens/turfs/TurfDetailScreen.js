import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { turfService } from '../../services/turfService';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TurfDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  let amenities = [];
  try {
    amenities = turf.amenities ? (Array.isArray(turf.amenities) ? turf.amenities : JSON.parse(turf.amenities)) : [];
  } catch (e) {
    amenities = [];
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{turf?.name || 'Turf Details'}</Text>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.favoriteButton}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF6B6B" : COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Image Gallery */}
        {turf.images && turf.images.length > 0 ? (
          <View style={styles.imageContainer}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentImageIndex(index);
              }}
              style={styles.imageSlider}
            >
              {turf.images.map((img, index) => (
                <TouchableOpacity key={index} onPress={() => setShowImageModal(true)} activeOpacity={0.9}>
                  <Image 
                    source={{ uri: img.image_url }} 
                    style={styles.turfImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {turf.images.map((_, index) => (
                <View 
                  key={index} 
                  style={[styles.indicator, currentImageIndex === index && styles.activeIndicator]} 
                />
              ))}
            </View>
            
            {/* Image Counter */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>{currentImageIndex + 1}/{turf.images.length}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <LinearGradient colors={['#10B981', '#34D399']} style={styles.placeholderGradient}>
              <Ionicons name="football" size={60} color="white" />
            </LinearGradient>
          </View>
        )}

        {/* Enhanced Header Info with Rating */}
        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{turf.name}</Text>
                {turf.is_featured && (
                  <View style={styles.featuredBadge}>
                    <Ionicons name="star" size={10} color="#FFF" />
                    <Text style={styles.featuredText}>FEATURED</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.ratingRow}>
                <View style={styles.sportBadge}>
                  <Text style={styles.sportBadgeText}>{turf.sport_type}</Text>
                </View>
              </View>
              
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.statText}>2.5 km away</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="navigate" size={20} color={COLORS.primary} />
              <Text style={styles.actionText}>Directions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{turf.address_line1 || turf.address || 'N/A'}</Text>
                <Text style={styles.infoSubValue}>{turf.city}, {turf.state} - {turf.pincode}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="resize" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Turf Size</Text>
                <Text style={styles.infoValue}>{turf.size}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Operating Hours</Text>
                <Text style={styles.infoValue}>{turf.opening_time} - {turf.closing_time}</Text>
              </View>
            </View>
          </View>

          {turf.description && (
            <View style={styles.descCard}>
              <Text style={styles.descTitle}>About</Text>
              <Text style={styles.descText}>{turf.description}</Text>
            </View>
          )}

          {amenities.length > 0 && (
            <View style={styles.amenitiesCard}>
              <Text style={styles.amenitiesTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    <Text style={styles.amenityText}>{amenity.amenity_name || amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        
        {/* Image Modal */}
        <Modal visible={showImageModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowImageModal(false)}>
              <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {turf?.images?.map((img, index) => (
                <Image key={index} source={{ uri: img.image_url }} style={styles.modalImage} resizeMode="contain" />
              ))}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      
      {/* Sticky Bottom Bar */}
      <View style={styles.stickyBottom}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceText}>₹{turf?.uniform_price || '500'}/hr</Text>
          <Text style={styles.bottomAvailability}>Available Now</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookNowButton}
          onPress={() => navigation.navigate('BookTurf', { turfId: turf?.id, turfName: turf?.name })}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SIZES.md,
  },
  favoriteButton: {
    padding: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  imageContainer: {
    position: 'relative',
  },
  imageSlider: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  turfImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFF',
    width: 24,
  },
  imageCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  placeholderGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SIZES.xl,
  },
  headerInfo: {
    marginBottom: SIZES.lg,
  },
  titleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SIZES.sm,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 3,
  },
  featuredText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quickStats: {
    flexDirection: 'row',
    gap: SIZES.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceSection: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SIZES.sm,
    alignSelf: 'flex-start',
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: SIZES.lg,
    ...SHADOWS.medium,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    gap: SIZES.lg,
    ...SHADOWS.medium,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  infoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoSubValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  descCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    marginBottom: SIZES.lg,
    ...SHADOWS.medium,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  descText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  amenitiesCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    marginBottom: SIZES.xl,
    ...SHADOWS.medium,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  amenitiesGrid: {
    gap: SIZES.md,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  amenityText: {
    fontSize: 16,
    color: COLORS.text,
  },
  bookButtonContainer: {
    marginTop: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  error: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SIZES.xl,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1001,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  stickyBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
  },
  bottomPrice: {
    flex: 1,
  },
  bottomPriceText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bottomAvailability: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
