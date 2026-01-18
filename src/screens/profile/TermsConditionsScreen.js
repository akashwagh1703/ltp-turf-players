import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function TermsConditionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: January 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using Let's Turf Play mobile application, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Booking Policy</Text>
          <Text style={styles.text}>
            • All bookings are subject to availability{'\n'}
            • Booking confirmation will be sent via SMS/Email{'\n'}
            • Minimum booking duration is 1 hour{'\n'}
            • Maximum advance booking is 30 days
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Payment Terms</Text>
          <Text style={styles.text}>
            • Full payment required at time of booking{'\n'}
            • All prices are in Indian Rupees (INR){'\n'}
            • Payment gateway charges may apply{'\n'}
            • Invoices will be sent to registered email
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Cancellation Policy</Text>
          <Text style={styles.text}>
            • Free cancellation up to 24 hours before booking{'\n'}
            • 50% refund for cancellations within 24 hours{'\n'}
            • No refund for no-shows{'\n'}
            • Refunds processed in 5-7 business days
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
          <Text style={styles.text}>
            • Arrive on time for your booking{'\n'}
            • Follow turf rules and regulations{'\n'}
            • Respect other users and staff{'\n'}
            • Report any damages immediately{'\n'}
            • Maintain cleanliness of the facility
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Liability</Text>
          <Text style={styles.text}>
            The platform is not liable for any injuries, accidents, or loss of personal belongings during turf usage. Users participate at their own risk.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Modifications</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact</Text>
          <Text style={styles.text}>
            For questions about these terms, contact us at:{'\n'}
            Email: support@letsplayturf.com{'\n'}
            Phone: +91 9876543210
          </Text>
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
  content: {
    flex: 1,
    padding: SIZES.xl,
  },
  updated: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: SIZES.xl,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
