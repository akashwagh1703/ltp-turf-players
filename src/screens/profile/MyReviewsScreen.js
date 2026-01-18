import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../../services/apiService';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function MyReviewsScreen({ navigation }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getMyReviews();
      setReviews(response.data?.data || []);
    } catch (error) {
      console.error('Load reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#F59E0B"
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.turfInfo}>
          <Ionicons name="football" size={20} color={COLORS.primary} />
          <Text style={styles.turfName}>{item.turf?.name}</Text>
        </View>
        {renderStars(item.rating)}
      </View>
      {item.comment && <Text style={styles.comment}>{item.comment}</Text>}
      <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      {reviews.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Ionicons name="star-outline" size={60} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No reviews yet</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadReviews} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  list: {
    padding: SIZES.xl,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    ...SHADOWS.medium,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  turfInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    flex: 1,
  },
  turfName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SIZES.sm,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SIZES.md,
  },
});
