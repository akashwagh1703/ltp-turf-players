import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/common/Button';
import { slotService, bookingService } from '../../services/apiService';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

export default function BookTurfScreen({ route, navigation }) {
  const { turfId, turfName } = route.params;
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [date]);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleDateSelect = (days) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
    setSelectedSlots([]);
  };

  const loadSlots = async () => {
    setLoading(true);
    setSelectedSlots([]);
    try {
      const response = await slotService.getAvailableSlots(turfId, formatDate(date));
      let slotsData = Array.isArray(response.data) ? response.data : [];
      
      if (slotsData.length === 0) {
        try {
          await slotService.generateSlots({ turf_id: turfId, date: formatDate(date) });
          const newResponse = await slotService.getAvailableSlots(turfId, formatDate(date));
          slotsData = Array.isArray(newResponse.data) ? newResponse.data : [];
        } catch (genError) {
          console.error('Slot generation error:', genError);
        }
      }
      
      // Filter slots based on current time if today
      const now = new Date();
      const isToday = formatDate(date) === formatDate(now);
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
      
      const processedSlots = slotsData
        .filter(slot => {
          // If not today, show all slots
          if (!isToday) return true;
          // If today, only show slots that haven't started yet
          return slot.start_time > currentTime;
        })
        .map(slot => ({
          ...slot,
          is_booked: slot.is_booked || 
                     slot.status === 'booked_online' || 
                     slot.status === 'booked_offline' ||
                     (slot.booking && ['confirmed', 'completed'].includes(slot.booking.booking_status))
        }));
      
      processedSlots.sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
      setSlots(processedSlots);
    } catch (error) {
      console.error('Load slots error:', error);
      Alert.alert('Error', 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = (slot) => {
    if (slot.is_booked) {
      Alert.alert('Not Available', 'This time slot is already booked.');
      return;
    }
    
    const index = selectedSlots.findIndex(s => s.id === slot.id);
    if (index > -1) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
    } else {
      const newSelection = [...selectedSlots, slot].sort((a, b) => 
        new Date(`2000-01-01 ${a.start_time}`) - new Date(`2000-01-01 ${b.start_time}`));
      if (isContinuous(newSelection)) {
        setSelectedSlots(newSelection);
      } else {
        Alert.alert('Error', 'Please select consecutive time slots only.');
      }
    }
  };

  const isContinuous = (slots) => {
    if (slots.length <= 1) return true;
    for (let i = 1; i < slots.length; i++) {
      if (slots[i].start_time !== slots[i - 1].end_time) return false;
    }
    return true;
  };

  const getTotalAmount = () => {
    return selectedSlots.reduce((sum, slot) => sum + parseFloat(slot.price), 0);
  };

  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      Alert.alert('Error', 'Please select at least one slot');
      return;
    }
    setBooking(true);
    try {
      const slotIds = selectedSlots.map(s => s.id);
      const response = await bookingService.createBooking(slotIds);
      
      Alert.alert('Success', 'Booking created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Bookings' }) }
      ]);
    } catch (error) {
      // Log for debugging only (not shown to user)
      if (__DEV__) {
        console.log('Booking error:', error.response?.status, error.response?.data);
      }
      
      // Reload slots to refresh availability
      await loadSlots();
      
      // Determine user-friendly error message
      let errorTitle = 'Booking Failed';
      let errorMessage = 'Unable to create booking. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data.message?.includes('not available') || data.message?.includes('already')) {
            errorMessage = 'Selected time slots are no longer available. Please choose different slots.';
          } else if (data.errors) {
            errorMessage = 'Please check all booking details and try again.';
          } else {
            errorMessage = 'Selected slots are unavailable. Please select again.';
          }
        } else if (status === 422) {
          errorMessage = 'Invalid booking information. Please check all fields.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again in a moment.';
        } else if (status === 401 || status === 403) {
          errorMessage = 'Session expired. Please login again.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert(errorTitle, errorMessage, [{ text: 'OK' }]);
    } finally {
      setBooking(false);
    }
  };

  const dateOptions = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'Day After', days: 2 },
    { label: formatDateLabel(3), days: 3 },
    { label: formatDateLabel(4), days: 4 },
  ];

  function formatDateLabel(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Turf</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.turfName}>{turfName}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <Text style={styles.sectionLabel}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScrollContent}>
            {dateOptions.map((option) => {
              const optionDate = new Date(Date.now() + option.days * 86400000);
              const isSelected = date.toDateString() === optionDate.toDateString();
              return (
                <TouchableOpacity
                  key={option.days}
                  style={[styles.dateChip, isSelected && styles.dateChipActive]}
                  onPress={() => handleDateSelect(option.days)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateChipText, isSelected && styles.dateChipTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.slotsSection}>
          <Text style={styles.sectionLabel}>Available Time Slots</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : slots.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No slots available for this date</Text>
            </View>
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((slot) => {
                const isSelected = selectedSlots.some(s => s.id === slot.id);
                const isBooked = slot.is_booked;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotCard,
                      isSelected && styles.slotCardSelected,
                      isBooked && styles.slotCardBooked
                    ]}
                    onPress={() => toggleSlot(slot)}
                    disabled={isBooked}
                    activeOpacity={0.8}
                  >
                    <View style={styles.slotTime}>
                      <Ionicons 
                        name={isBooked ? "lock-closed" : isSelected ? "checkmark-circle" : "time-outline"} 
                        size={16} 
                        color={isBooked ? COLORS.textLight : isSelected ? COLORS.primary : COLORS.textSecondary} 
                      />
                      <Text style={[
                        styles.slotTimeText,
                        isSelected && styles.slotTimeTextSelected,
                        isBooked && styles.slotTimeTextBooked
                      ]}>
                        {slot.start_time_display || slot.start_time}
                      </Text>
                    </View>
                    {isBooked ? (
                      <View style={styles.bookedInfo}>
                        <Text style={styles.bookedBadge}>BOOKED</Text>
                        {slot.booking && slot.booking.player_name && (
                          <Text style={styles.bookedBy}>{slot.booking.player_name}</Text>
                        )}
                      </View>
                    ) : (
                      <Text style={[
                        styles.slotPrice,
                        isSelected && styles.slotPriceSelected
                      ]}>
                        ₹{slot.price}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {selectedSlots.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Selected Slots</Text>
              <Text style={styles.summaryValue}>{selectedSlots.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>
                {selectedSlots[0]?.start_time_display} - {selectedSlots[selectedSlots.length - 1]?.end_time_display}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{getTotalAmount()}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {selectedSlots.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>{selectedSlots.length} Slot(s)</Text>
            <Text style={styles.footerAmount}>₹{getTotalAmount()}</Text>
          </View>
          <Button 
            title="Confirm Booking" 
            onPress={handleBooking} 
            loading={booking} 
            style={styles.bookButton} 
          />
        </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  turfName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: SIZES.xl,
  },
  dateSection: {
    marginBottom: SIZES.xl,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  dateScrollContent: {
    paddingRight: SIZES.lg,
  },
  dateChip: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: SIZES.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 90,
    alignItems: 'center',
  },
  dateChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  dateChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  slotsSection: {
    marginBottom: SIZES.xl,
  },
  loadingContainer: {
    paddingVertical: SIZES.xxl,
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: COLORS.card,
    padding: SIZES.xxl,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SIZES.md,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.md,
  },
  slotCard: {
    width: '47.5%',
    backgroundColor: COLORS.card,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  slotCardSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  slotCardBooked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  slotTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SIZES.sm,
  },
  slotTimeText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  slotTimeTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  slotTimeTextBooked: {
    color: COLORS.textLight,
  },
  slotPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  slotPriceSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  bookedInfo: {
    alignItems: 'flex-end',
  },
  bookedBadge: {
    fontSize: 9,
    color: '#991B1B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bookedBy: {
    fontSize: 9,
    color: '#DC2626',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    padding: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.xl,
    ...SHADOWS.medium,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  summaryTotal: {
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SIZES.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.lg,
    padding: SIZES.xl,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  bookButton: {
    flex: 1,
  },
});
