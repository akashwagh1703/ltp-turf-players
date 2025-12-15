import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import MainNavigator from './MainNavigator';
import TurfDetailScreen from '../screens/turfs/TurfDetailScreen';
import BookTurfScreen from '../screens/turfs/BookTurfScreen';

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
        </>
      )}
    </Stack.Navigator>
  );
}
