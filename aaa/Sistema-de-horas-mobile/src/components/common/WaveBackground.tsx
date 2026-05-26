/**
 * WaveBackground.tsx
 *
 * Componente responsável pelas ONDAS decorativas do topo e da base da tela.
 * Usa a View padrão do React Native com borderRadius para simular as curvas.
 *
 * Props:
 *  - position: 'top' | 'bottom' — define se a onda fica em cima ou embaixo
 *
 * Por que separar em componente?
 *  Reutilizável em outras telas (Login, Cadastro, etc.) sem duplicar código.
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ─── Tipos das props ────────────────────────────────────────────────────
interface WaveBackgroundProps {
  position: 'top' | 'bottom';
}

// ─── Componente ─────────────────────────────────────────────────────────
export default function WaveBackground({ position }: WaveBackgroundProps) {
  const isTop = position === 'top';

  return (
    <View style={isTop ? styles.containerTop : styles.containerBottom} pointerEvents="none">
      {/* Wave 1: Peach/Orange */}
      <View
        style={[
          styles.wave,
          styles.waveOrange,
          isTop ? styles.waveTopOrange : styles.waveBottomOrange,
        ]}
      />
      {/* Wave 2: Deep Blue */}
      <View
        style={[
          styles.wave,
          styles.waveBlue,
          isTop ? styles.waveTopBlue : styles.waveBottomBlue,
        ]}
      />
    </View>
  );
}

// ─── Estilos internos do componente ────────────────────────────────────
const WAVE_HEIGHT = 220; // altura do bloco da onda

const styles = StyleSheet.create({
  containerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: WAVE_HEIGHT,
    zIndex: 0,
  },
  containerBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: WAVE_HEIGHT,
    zIndex: 0,
  },
  wave: {
    position: 'absolute',
    width: width * 1.45,
    height: WAVE_HEIGHT,
    left: -width * 0.225,
  },
  waveOrange: {
    backgroundColor: '#F5C9A0', // pêssego/laranja claro
  },
  waveBlue: {
    backgroundColor: '#1B3D6D', // azul Senac
  },
  waveTopOrange: {
    top: -WAVE_HEIGHT * 0.38,
    borderBottomLeftRadius: width * 0.75,
    borderBottomRightRadius: width * 0.75,
  },
  waveTopBlue: {
    top: -WAVE_HEIGHT * 0.48,
    borderBottomLeftRadius: width * 0.75,
    borderBottomRightRadius: width * 0.75,
  },
  waveBottomOrange: {
    bottom: -WAVE_HEIGHT * 0.38,
    borderTopLeftRadius: width * 0.75,
    borderTopRightRadius: width * 0.75,
  },
  waveBottomBlue: {
    bottom: -WAVE_HEIGHT * 0.48,
    borderTopLeftRadius: width * 0.75,
    borderTopRightRadius: width * 0.75,
  },
});
