import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
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
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
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
          <View style={styles.imagePlaceholder}>
            <Ionicons name="football" size={60} color={COLORS.primary} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{turf.name}</Text>
              <View style={styles.sportBadge}>
                <Text style={styles.sportBadgeText}>{turf.sport_type}</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.priceValue}>₹{turf.uniform_price || 'Dynamic'}/hr</Text>
            </View>
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
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.bookButtonContainer}>
            <Button 
              title="Book Now" 
              onPress={() => navigation.navigate('BookTurf', { turfId: turf.id, turfName: turf.name })} 
            />
          </View>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.xl,
    paddingHorizontal: SIZES.xl,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSlider: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  turfImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: 250,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SIZES.xl,
  },
  headerInfo: {
    marginBottom: SIZES.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SIZES.md,
  },
  sportBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sportBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SIZES.sm,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
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
});
