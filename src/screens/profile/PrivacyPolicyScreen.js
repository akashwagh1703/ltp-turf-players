import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: January 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We collect information you provide directly to us:{'\n\n'}
            • Name and contact information{'\n'}
            • Phone number and email address{'\n'}
            • Booking and payment information{'\n'}
            • Device and usage information{'\n'}
            • Location data (with permission)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to:{'\n\n'}
            • Process your bookings and payments{'\n'}
            • Send booking confirmations and updates{'\n'}
            • Provide customer support{'\n'}
            • Improve our services{'\n'}
            • Send promotional offers (with consent){'\n'}
            • Prevent fraud and ensure security
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.text}>
            We may share your information with:{'\n\n'}
            • Turf owners for booking fulfillment{'\n'}
            • Payment processors for transactions{'\n'}
            • Service providers who assist our operations{'\n'}
            • Law enforcement when required by law{'\n\n'}
            We do not sell your personal information to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:{'\n\n'}
            • Access your personal information{'\n'}
            • Correct inaccurate data{'\n'}
            • Request deletion of your data{'\n'}
            • Opt-out of marketing communications{'\n'}
            • Withdraw consent at any time
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
          <Text style={styles.text}>
            We use cookies and similar technologies to improve user experience, analyze usage patterns, and personalize content.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.text}>
            Our services are not intended for children under 13. We do not knowingly collect information from children.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to Privacy Policy</Text>
          <Text style={styles.text}>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.text}>
            If you have questions about this privacy policy:{'\n\n'}
            Email: privacy@letsplayturf.com{'\n'}
            Phone: +91 9876543210{'\n'}
            Address: Mumbai, Maharashtra, India
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
