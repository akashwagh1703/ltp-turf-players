import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function HelpSupportScreen({ navigation }) {
  const contactOptions = [
    { icon: 'call', label: 'Call Us', value: '+91 9876543210', action: 'tel:+919876543210' },
    { icon: 'mail', label: 'Email Us', value: 'support@letsplayturf.com', action: 'mailto:support@letsplayturf.com' },
    { icon: 'logo-whatsapp', label: 'WhatsApp', value: '+91 9876543210', action: 'whatsapp://send?phone=919876543210' },
  ];

  const faqs = [
    {
      question: 'How do I book a turf?',
      answer: 'Browse available turfs, select your preferred date and time slots, then confirm your booking with payment.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel bookings up to 24 hours before the scheduled time for a full refund.'
    },
    {
      question: 'How do I get a refund?',
      answer: 'Refunds are processed within 5-7 business days to your original payment method after cancellation.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept UPI, Credit/Debit Cards, Net Banking, and Wallets through Razorpay.'
    },
  ];

  const handleContact = async (action) => {
    try {
      const supported = await Linking.canOpenURL(action);
      if (supported) {
        await Linking.openURL(action);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={() => handleContact(option.action)}
              activeOpacity={0.7}
            >
              <View style={styles.contactIcon}>
                <Ionicons name={option.icon} size={22} color={COLORS.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{option.label}</Text>
                <Text style={styles.contactValue}>{option.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <Text style={styles.question}>{faq.question}</Text>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          ))}
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
  },
  section: {
    padding: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  faqCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  answer: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
