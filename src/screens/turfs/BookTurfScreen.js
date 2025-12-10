import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { slotService, bookingService } from '../../services/apiService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

export default function BookTurfScreen({ route, navigation }) {
  const { turfId, turfName } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [date]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDateSelect = (days) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
    setSelectedSlots([]);
    setShowDatePicker(false);
  };

  const loadSlots = async () => {
    setLoading(true);
    try {
      const response = await slotService.getAvailableSlots(turfId, formatDate(date));
      setSlots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Load slots error:', error);
      Alert.alert('Error', 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = (slot) => {
    if (slot.status !== 'available') {
      Alert.alert('Not Available', 'This time slot is not available.');
      return;
    }
    
    const index = selectedSlots.findIndex(s => s.id === slot.id);
    if (index > -1) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
    } else {
      const newSelection = [...selectedSlots, slot].sort((a, b) => 
        new Date(`2000-01-01 ${a.start_time}`) - new Date(`2000-01-01 ${b.start_time}`)
      );
      if (isContinuous(newSelection)) {
        setSelectedSlots(newSelection);
      } else {
        Alert.alert('Error', 'Please select continuous time slots.');
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

  const isSlotSelectable = (slot) => {
    if (slot.status !== 'available') return false;
    if (selectedSlots.length === 0) return true;
    const testSelection = [...selectedSlots, slot].sort((a, b) => 
      new Date(`2000-01-01 ${a.start_time}`) - new Date(`2000-01-01 ${b.start_time}`)
    );
    return isContinuous(testSelection);
  };

  const getSlotStyle = (slot, isSelected, isDisabled) => {
    if (isSelected) return styles.selectedSlot;
    if (slot.status === 'booked_online') return styles.bookedOnlineSlot;
    if (slot.status === 'booked_offline') return styles.bookedOfflineSlot;
    if (slot.status === 'blocked') return styles.blockedSlot;
    if (isDisabled) return styles.unavailableSlot;
    return null;
  };

  const getStatusText = (slot, isDisabled) => {
    if (slot.status === 'available') return isDisabled ? 'Not continuous' : 'Available';
    if (slot.status === 'booked_online') return 'Booked';
    if (slot.status === 'booked_offline') return 'Booked Offline';
    if (slot.status === 'blocked') return 'Blocked';
    return slot.status;
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
      await bookingService.createBooking(slotIds);
      Alert.alert('Success', 'Booking created successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Bookings' }) }
      ]);
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book {turfName}</Text>
      </View>

      <ScrollView>
        <Card style={styles.dateCard}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
        </Card>

        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity style={styles.dateOption} onPress={() => handleDateSelect(0)}>
                <Text style={styles.dateOptionText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateOption} onPress={() => handleDateSelect(1)}>
                <Text style={styles.dateOptionText}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateOption} onPress={() => handleDateSelect(2)}>
                <Text style={styles.dateOptionText}>Day After Tomorrow</Text>
              </TouchableOpacity>
              <Button title="Cancel" variant="secondary" onPress={() => setShowDatePicker(false)} />
            </View>
          </View>
        </Modal>

        <View style={styles.slotsContainer}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : slots.length === 0 ? (
            <Text style={styles.noSlots}>No slots available</Text>
          ) : (
            slots.map((slot) => {
              const isSelected = selectedSlots.some(s => s.id === slot.id);
              const isDisabled = !isSlotSelectable(slot) && !isSelected;
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => toggleSlot(slot)}
                >
                  <Card style={[
                    styles.slotCard,
                    getSlotStyle(slot, isSelected, isDisabled)
                  ]}>
                    <Text style={styles.slotTime}>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</Text>
                    <Text style={styles.slotPrice}>₹{slot.price}</Text>
                    <Text style={styles.slotStatus}>
                      {getStatusText(slot, isDisabled)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {selectedSlots.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>{selectedSlots.length} Slot(s) Selected</Text>
            <Text style={styles.totalAmount}>₹{getTotalAmount()}</Text>
          </View>
          <Button title="Book Now" onPress={handleBooking} loading={booking} style={styles.bookButton} />
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.lg,
    gap: SIZES.md,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  dateCard: {
    margin: SIZES.lg,
  },
  label: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  dateText: {
    ...FONTS.body,
    color: COLORS.text,
  },
  slotsContainer: {
    padding: SIZES.lg,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  noSlots: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.xl,
  },
  slotCard: {
    marginBottom: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedSlot: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#E0F2FE',
  },
  unavailableSlot: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  bookedOnlineSlot: {
    backgroundColor: '#DBEAFE',
    opacity: 0.7,
  },
  bookedOfflineSlot: {
    backgroundColor: '#FED7AA',
    opacity: 0.7,
  },
  blockedSlot: {
    backgroundColor: '#E5E7EB',
    opacity: 0.7,
  },
  slotTime: {
    ...FONTS.body,
    color: COLORS.text,
  },
  slotPrice: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
  slotStatus: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  bookButton: {
    flex: 1,
    marginLeft: SIZES.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    width: '80%',
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  dateOption: {
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateOptionText: {
    ...FONTS.body,
    color: COLORS.text,
  },
});
