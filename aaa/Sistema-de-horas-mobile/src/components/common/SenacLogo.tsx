/**
 * SenacLogo.tsx
 *
 * Componente que renderiza o LOGO do Senac usando SVG para as asas
 * e Text para o logotipo, combinando para formar a marca oficial.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SenacLogo() {
  return (
    <View style={styles.container} accessibilityLabel="Logo Senac">
      
      {/* ── Ícone das asas em SVG ─────────────────── */}
      <View style={styles.iconWrapper}>
        <Svg width={80} height={40} viewBox="0 0 80 40">
          {/* Asa Laranja (superior) */}
          <Path
            d="M48 14 C56 5, 72 10, 78 11 C68 15, 56 17, 48 14 Z"
            fill="#F5A547"
          />
          {/* Asa Azul (inferior) */}
          <Path
            d="M32 24 C44 12, 68 18, 76 19 C62 23, 46 26, 32 24 Z"
            fill="#20609C"
          />
        </Svg>
      </View>

      {/* ── Texto "Senac" ─────────────────────────────────────────────── */}
      <Text style={styles.logoText}>Senac</Text>

    </View>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#20609C',
    letterSpacing: -0.5,
    marginTop: -4, // Aproxima o texto do ícone para seguir o padrão oficial
  },
});
