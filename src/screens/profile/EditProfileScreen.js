import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.updateProfile({ name, email });
      updateUser(response.data.user);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(name || 'U')[0].toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user?.phone}
              editable={false}
            />
            <Text style={styles.helperText}>Phone number cannot be changed</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Save Changes" onPress={handleSave} loading={loading} />
      </View>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: '700',
  },
  form: {
    padding: SIZES.xl,
  },
  inputGroup: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    fontSize: 16,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textLight,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
  footer: {
    padding: SIZES.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
