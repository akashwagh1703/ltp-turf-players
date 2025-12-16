import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { bookingService } from '../../services/bookingService';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookings();
      setBookings(response.data?.data || []);
    } catch (error) {
      console.error('Load bookings error:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel this booking?\n\nBooking: #${booking.booking_number}\nTurf: ${booking.turf?.name}\nDate: ${booking.booking_date}\n\n⚠️ Cancellation Policy:\n• Free cancellation 24h before\n• Refund in 5-7 business days`,
      [
        { text: 'No, Keep It', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => confirmCancel(booking.id)
        }
      ]
    );
  };

  const confirmCancel = async (id) => {
    setLoading(true);
    try {
      await bookingService.cancelBooking(id);
      Alert.alert('Success', 'Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      console.error('Cancel booking error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#E0E7FF', text: '#4338CA' };
      case 'completed': return { bg: '#D1FAE5', text: '#047857' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626' };
      case 'no_show': return { bg: '#FEF3C7', text: '#92400E' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const renderBooking = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity 
        style={styles.bookingCard}
        onPress={() => showBookingDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.bookingIconCircle}>
            <Ionicons name="football" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.bookingHeaderContent}>
            <Text style={styles.turfName}>{item.turf?.name || 'Turf'}</Text>
            <Text style={styles.bookingId}>#{item.booking_number || item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {item.status === 'no_show' ? 'No Show' : item.status}
            </Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{item.booking_date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {item.start_time} - {item.end_time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="wallet-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>₹{item.final_amount || item.amount}</Text>
          </View>
        </View>

        {item.status === 'confirmed' && (
          <View style={styles.bookingFooter}>
            <Button
              title="Cancel Booking"
              variant="secondary"
              onPress={() => handleCancel(item)}
              style={styles.cancelButton}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const showBookingDetails = (booking) => {
    const statusColor = getStatusColor(booking.status);
    const statusText = booking.status === 'no_show' ? 'No Show' : booking.status;
    Alert.alert(
      `Booking #${booking.booking_number}`,
      `Turf: ${booking.turf?.name}\nDate: ${booking.booking_date}\nTime: ${booking.start_time} - ${booking.end_time}\nAmount: ₹${booking.final_amount || booking.amount}\nStatus: ${statusText}\nPayment: ${booking.payment_status}`,
      booking.status === 'confirmed' ? [
        { text: 'Close', style: 'cancel' },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => handleCancel(booking) }
      ] : [
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track all your turf bookings</Text>
      </LinearGradient>

      {bookings.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="calendar-outline" size={60} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Bookings Yet</Text>
          <Text style={styles.emptyText}>Start booking your favorite turfs now!</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadBookings} />}
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
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    ...SHADOWS.medium,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    gap: SIZES.md,
  },
  bookingIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingHeaderContent: {
    flex: 1,
  },
  turfName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  bookingDetails: {
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
  },
  bookingFooter: {
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    paddingVertical: SIZES.sm,
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
