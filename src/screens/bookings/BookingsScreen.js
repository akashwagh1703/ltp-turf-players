import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { bookingService } from '../../services/bookingService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

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

  const handleCancel = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      loadBookings();
    } catch (error) {
      console.error('Cancel booking error:', error);
    }
  };

  const renderBooking = ({ item }) => (
    <Card style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingId}>#{item.id}</Text>
        <Text style={[styles.status, styles[item.booking_status]]}>{item.booking_status}</Text>
      </View>
      <Text style={styles.turfName}>{item.turf?.name || 'Turf'}</Text>
      <Text style={styles.bookingDate}>{item.booking_date} • {item.start_time} - {item.end_time}</Text>
      <View style={styles.bookingFooter}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        {item.booking_status === 'confirmed' && (
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => handleCancel(item.id)}
            style={styles.cancelButton}
          />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>
      {bookings.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadBookings} />}
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
    padding: SIZES.lg,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  list: {
    padding: SIZES.lg,
  },
  bookingCard: {
    marginBottom: SIZES.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  bookingId: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  status: {
    ...FONTS.small,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.xs,
    textTransform: 'capitalize',
  },
  confirmed: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  completed: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  cancelled: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  turfName: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  bookingDate: {
    ...FONTS.caption,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cancelButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
});
