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
  // A onda do topo tem a curva virada para baixo
  // A onda da base tem a curva virada para cima
  const isTop = position === 'top';

  return (
    <View
      style={[
        styles.wave,
        isTop ? styles.waveTop : styles.waveBottom,
      ]}
    />
  );
}

// ─── Estilos internos do componente ────────────────────────────────────
const WAVE_HEIGHT = 200; // altura do bloco da onda

const styles = StyleSheet.create({
  // Base compartilhada entre as duas ondas
  wave: {
    position: 'absolute',       // flutua sobre o layout
    zIndex: 0,                  // fica ATRÁS do conteúdo e do botão
    width: width * 1.3,         // mais largo que a tela para cobrir as bordas
    height: WAVE_HEIGHT,
    backgroundColor: '#F5C9A0', // pêssego/laranja claro
    left: -width * 0.15,        // centraliza o excesso de largura
  },

  // ── Onda do topo ─────────────────────────────────────────────────────
  // borderBottomRadius cria a curva na parte inferior do bloco
  waveTop: {
    top: -WAVE_HEIGHT * 0.5,    // metade da onda fica fora da tela (topo)
    borderBottomLeftRadius: width * 0.6,
    borderBottomRightRadius: width * 0.6,
  },

  // ── Onda da base ─────────────────────────────────────────────────────
  // borderTopRadius cria a curva na parte superior do bloco
  // bottom: 0 → encostada na borda inferior da tela
  waveBottom: {
    bottom: 0,                  // fica colada na borda de baixo
    borderTopLeftRadius: width * 0.6,
    borderTopRightRadius: width * 0.6,
  },
});
