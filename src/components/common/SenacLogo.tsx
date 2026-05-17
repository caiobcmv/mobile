/**
 * SenacLogo.tsx
 *
 * Componente que renderiza o LOGO do Senac usando apenas primitivos do
 * React Native (View + Text), sem depender de imagem externa.
 *
 * Por que separar em componente?
 *  - O logo aparece em várias telas (Welcome, Login, Header).
 *  - Centraliza qualquer mudança futura em um único lugar.
 *  - Mantém a WelcomeScreen limpa e legível.
 *
 * Anatomia visual:
 *
 *      ╱▔▔╲            ← triângulo laranja (asa superior)
 *    ╱______╲          ← triângulo azul    (asa inferior)
 *   [ S E N A C ]      ← texto do logotipo
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SenacLogo() {
  return (
    <View style={styles.container} accessibilityLabel="Logo Senac">

      {/* ── Ícone estilizado (símbolo de "asa/avião") ─────────────────── */}
      <View style={styles.iconWrapper}>

        {/* Triângulo laranja — asa superior */}
        <View style={styles.triangleOrange} />

        {/* Triângulo azul — asa inferior */}
        <View style={styles.triangleBlue} />

      </View>

      {/* ── Texto "Senac" ─────────────────────────────────────────────── */}
      <Text style={styles.logoText}>Senac</Text>

    </View>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Coluna centralizada: ícone acima, texto abaixo
  container: {
    alignItems: 'center',
  },

  // Agrupa os dois triângulos
  iconWrapper: {
    width: 60,
    height: 36,
    marginBottom: 6,
    position: 'relative',
    alignItems: 'center',
  },

  // ── Técnica de triângulo no React Native ─────────────────────────────
  // Para criar um triângulo: bordas transparentes + uma borda colorida.
  // A borda de baixo (borderBottomColor) forma o preenchimento visível.

  // Triângulo laranja (topo) — aponta para cima
  triangleOrange: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 22,
    borderRightWidth: 22,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E87722', // laranja Senac
    zIndex: 2,
  },

  // Triângulo azul (base) — aponta para baixo (invertido)
  triangleBlue: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1A3D6D',   // azul Senac
    zIndex: 1,
  },

  // Texto "Senac" em azul e negrito
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A3D6D',
    letterSpacing: 1,
    marginTop: 8,
  },
});
