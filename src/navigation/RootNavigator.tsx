/**
 * RootNavigator.tsx
 *
 * Navegação raiz do aplicativo.
 * Define QUAIS telas existem e em QUAL ORDEM aparecem.
 *
 * Fluxo de navegação:
 *
 *   Não autenticado:
 *     Welcome ──► FirstAccess (1º acesso) ──► Login
 *                        ou
 *     Welcome ──► Login (já tem conta)
 *
 *   Autenticado:
 *     Dashboard ──► SubmitHours / Profile
 *
 * Como funciona o Stack Navigator:
 *   A primeira tela listada é a tela inicial.
 *   Ao chamar navigation.navigate('X'), a tela X é empilhada sobre a atual.
 *   Ao chamar navigation.goBack(), desempilha e volta para a anterior.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// ─── Imports de telas ───────────────────────────────────────────────────
import {
  WelcomeScreen,       // 1ª tela: boas-vindas
  FirstAccessScreen,   // 2ª tela: primeiro acesso (senha inicial)
  LoginScreen,
  DashboardScreen,
  SubmitHoursScreen,
  ProfileScreen,
} from '../screens';

// Cria o Stack Navigator tipado com todas as rotas possíveis
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // TODO: substituir pelo valor real do useAuth() quando implementar auth
  const isAuthenticated = false;

  return (
    // NavigationContainer é o "contexto" que envolve toda a navegação
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,  // remove o header padrão em todas as telas
          animation: 'fade',   // animação suave entre telas
        }}
      >
        {!isAuthenticated ? (
          // ── Fluxo de entrada (não autenticado) ─────────────────────────
          // A primeira Stack.Screen é sempre a tela inicial do app
          <>
            {/* 1ª tela: Boas-vindas */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />

            {/* 2ª tela: Primeiro Acesso — senha inicial do usuário */}
            <Stack.Screen name="FirstAccess" component={FirstAccessScreen} />

            {/* 3ª tela: Login normal */}
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          // ── Fluxo principal (autenticado) ───────────────────────────────
          <>
            <Stack.Screen name="Dashboard"   component={DashboardScreen} />
            <Stack.Screen name="SubmitHours" component={SubmitHoursScreen} />
            <Stack.Screen name="Profile"     component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
