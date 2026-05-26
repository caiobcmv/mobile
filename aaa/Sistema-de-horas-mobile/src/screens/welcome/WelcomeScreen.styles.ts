/**
 * WelcomeScreen.styles.ts
 *
 * Arquivo exclusivo de estilos da tela de boas-vindas.
 * Separar os estilos do componente deixa o código mais limpo e fácil de manter.
 *
 * Paleta de cores:
 *   - Fundo branco:       #FFFFFF
 *   - Onda/pêssego:       #F5C9A0  (laranja claro do Senac)
 *   - Azul Senac:         #1A3D6D
 *   - Laranja Senac:      #E87722
 *   - Texto secundário:   #6B7280
 */

import { StyleSheet, Dimensions } from 'react-native';

// Largura e altura da tela do dispositivo
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ─── Container principal ────────────────────────────────────────────
  // Ocupa toda a tela com fundo branco
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ─── Área de conteúdo central ────────────────────────────────────
  // Centraliza logo + textos no meio da tela
  // zIndex: 1 garante que fica na frente das ondas (zIndex: 0)
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 1,                  // ← na frente das ondas
  },

  // ─── Espaço entre o logo e os textos ────────────────────────────────
  logoSpacing: {
    marginBottom: 40,
  },

  // ─── Título principal ────────────────────────────────────────────────
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A3D6D',          // azul Senac
    textAlign: 'center',
    marginBottom: 10,
  },

  // ─── Subtítulo / tagline ─────────────────────────────────────────────
  subtitle: {
    fontSize: 14,
    color: '#6B7280',          // cinza suave
    textAlign: 'center',
    lineHeight: 20,
  },

  // ─── Linha decorativa curta ──────────────────────────────────────────
  // Pequena barra horizontal entre o texto e o botão
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#E87722', // laranja Senac
    borderRadius: 2,
    marginTop: 36,
  },

  // ─── Área inferior (botão) ───────────────────────────────────────
  // zIndex: 1 garante que fica na frente das ondas
  // paddingBottom: 56 afasta o botão da borda inferior (acima da onda)
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 160,         // espaço suficiente acima da onda inferior
    zIndex: 1,                  // ← na frente da onda inferior
  },

  // ─── Botão principal ─────────────────────────────────────────────────
  button: {
    backgroundColor: '#1A3D6D', // azul Senac escuro
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',

    // Sombra para dar profundidade ao botão
    shadowColor: '#1A3D6D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,               // sombra no Android
  },

  // ─── Texto do botão ──────────────────────────────────────────────────
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ─── Botão secundário (Outlined) ──────────────────────────────────────
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A3D6D',
    marginTop: 12,
  },

  // ─── Texto do botão secundário ────────────────────────────────────────
  buttonSecondaryText: {
    color: '#1A3D6D',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

// Exporta dimensões para uso nos componentes de onda
export { width, height };
