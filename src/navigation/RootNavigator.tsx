import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import {
  LoginScreen,
  DashboardScreen,
  SubmitHoursScreen,
  ProfileScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegação principal do app.
 * Troca entre AuthStack e AppStack conforme o estado de autenticação.
 */
export default function RootNavigator() {
  // TODO: substituir `isAuthenticated` pelo valor real do useAuth()
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // ── Auth Stack ──────────────────────────────────────────────────
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // ── App Stack ───────────────────────────────────────────────────
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="SubmitHours" component={SubmitHoursScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
