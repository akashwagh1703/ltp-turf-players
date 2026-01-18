import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert('Error', 'Please enter valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      await authService.sendOtp(phone);
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter valid 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await login(phone, otp);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/icon.png')} style={styles.logoImage} />
            </View>
            <Text style={styles.appName}>LTP Player</Text>
            <Text style={styles.brandTagline}>Let's Turf Play</Text>
            <Text style={styles.subtitle}>Book premium turfs instantly</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>Enter your phone number to continue</Text>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <Input
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  editable={!otpSent}
                  style={styles.phoneInput}
                />
              </View>

              {otpSent && (
                <>
                  <Input
                    label="Verification Code"
                    placeholder="Enter 6-digit OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <View style={styles.otpInfo}>
                    <Text style={styles.otpNote}>Code sent to +91 {phone}</Text>
                    <Text style={styles.otpTimer}>Expires in 2:00</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.buttonSection}>
              {!otpSent ? (
                <Button title="Send Verification Code" onPress={handleSendOtp} loading={loading} />
              ) : (
                <>
                  <Button title="Verify & Continue" onPress={handleVerifyOtp} loading={loading} />
                  <Button
                    title="Resend Code"
                    variant="secondary"
                    onPress={handleSendOtp}
                    style={styles.resendButton}
                  />
                </>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>By continuing, you agree to our Terms & Privacy Policy</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 50,
    backgroundColor: '#F8FAFC',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  logoImage: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 28,
    paddingTop: 40,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 15,
  },
  welcomeSection: {
    marginBottom: 36,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 36,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneInput: {
    flex: 1,
  },
  otpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  otpNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  otpTimer: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttonSection: {
    gap: 16,
    marginBottom: 32,
  },
  resendButton: {
    marginTop: 0,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
