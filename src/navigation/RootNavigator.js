import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import MainNavigator from './MainNavigator';
import TurfDetailScreen from '../screens/turfs/TurfDetailScreen';
import BookTurfScreen from '../screens/turfs/BookTurfScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MyReviewsScreen from '../screens/profile/MyReviewsScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import TermsConditionsScreen from '../screens/profile/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, isProfileComplete } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : !isProfileComplete() ? (
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="TurfDetail" component={TurfDetailScreen} />
          <Stack.Screen name="BookTurf" component={BookTurfScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
