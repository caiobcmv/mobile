/**
 * FirstAccessScreen.tsx
 *
 * Tela de PRIMEIRO ACESSO — design com ondas Senac, logo, avatar e campos.
 *
 * Layout visual:
 * ┌─────────────────────────────────┐
 * │  🟠 Onda topo (pêssego)        │
 * │                                 │
 * │        [ Logo Senac ]           │
 * │                                 │
 * │  [avatar]  Primeiro acesso      │
 * │            Crie uma conta       │
 * │                                 │
 * │  Nome                           │
 * │  [ 👤  João Pereira          ]  │
 * │                                 │
 * │  Matricula ou E-mail            │
 * │  [ 👤  0020015786            ]  │
 * │                                 │
 * │  Senha                          │
 * │  [ 🔒  12345678          👁  ]  │
 * │                                 │
 * │  [          Entrar           ]  │
 * │                                 │
 * │  ────── ou continue com ──────  │
 * │                                 │
 * │  Primeiro acesso? Ative sua c.  │
 * │                                 │
 * │  🟠 Onda base (pêssego)        │
 * └─────────────────────────────────┘
 *
 * Reutiliza WaveBackground e SenacLogo da WelcomeScreen.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { styles } from './FirstAccessScreen.styles';

// ─── Componentes reutilizáveis ───────────────────────────────────────────
// Importa as ondas e o logo já criados para a WelcomeScreen
import WaveBackground from '../../components/common/WaveBackground';
import SenacLogo from '../../components/common/SenacLogo';

// ─── Tipagem de navegação ────────────────────────────────────────────────
type FirstAccessNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FirstAccess'
>;

interface Props {
  navigation: FirstAccessNavigationProp;
}

// ════════════════════════════════════════════════════════════════════════
//  Sub-componente: AvatarPlaceholder
//  Círculo cinza com ícone de pessoa — representa a foto de perfil.
//  Posicionado ao lado do título, alinhado à esquerda.
// ════════════════════════════════════════════════════════════════════════
function AvatarPlaceholder() {
  return (
    <View style={styles.avatarWrapper}>
      {/* Ícone de pessoa dentro do círculo — substitui foto real */}
      <Ionicons name="person" size={36} color="#9CA3AF" />
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  Sub-componente: InputField
//  Campo com ícone Ionicons à esquerda e toggle de senha opcional.
//
//  Props:
//    label       — texto do label acima do campo
//    iconName    — nome do ícone Ionicons
//    placeholder — placeholder do campo
//    value / onChangeText — estado controlado
//    secureEntry — campo de senha com botão de olho
//    isFocused / onFocus / onBlur — borda azul ao focar
// ════════════════════════════════════════════════════════════════════════
interface InputFieldProps {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureEntry?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

function InputField({
  label,
  iconName,
  placeholder,
  value,
  onChangeText,
  secureEntry = false,
  isFocused = false,
  onFocus,
  onBlur,
}: InputFieldProps) {
  // Controla se a senha está visível ou oculta
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.fieldGroup}>

      {/* Label acima do campo */}
      <Text style={styles.label}>{label}</Text>

      {/* Caixa do campo: borda azul quando focado */}
      <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>

        {/* Ícone vetorial à esquerda */}
        <Ionicons
          name={iconName}
          size={18}
          color={isFocused ? '#1A3D6D' : '#9CA3AF'}
          style={{ marginRight: 10 }}
        />

        {/* Campo de texto */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureEntry && !showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {/* Botão de olho — somente em campo de senha */}
        {secureEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(v => !v)}
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  Componente principal: FirstAccessScreen
// ════════════════════════════════════════════════════════════════════════
export default function FirstAccessScreen({ navigation }: Props) {

  // ── Estados dos campos ────────────────────────────────────────────────
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  // Controle de foco por campo (para borda azul)
  const [nomeFocused, setNomeFocused] = useState(false);
  const [matriculaFocused, setMatriculaFocused] = useState(false);
  const [senhaFocused, setSenhaFocused] = useState(false);

  const [loading, setLoading] = useState(false);

  // ── Handler "Entrar" ──────────────────────────────────────────────────
  const handleEntrar = async () => {
    if (!nome || !matricula || !senha) return;
    setLoading(true);
    try {
      // TODO: chamar API de criação de conta / primeiro acesso
      // await authService.firstAccess({ nome, matricula, senha });
      navigation.navigate('Login');
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Renderização ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.screen}>

      {/* ── CAMADA 0: Ondas (renderizadas primeiro = ficam atrás) ──── */}
      <WaveBackground position="top" />
      <WaveBackground position="bottom" />

      {/* ── CAMADA 1: Conteúdo (renderizado depois = fica na frente) ─ */}
      <KeyboardAvoidingView
        style={{ flex: 1, zIndex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Logo Senac centralizado */}
          <View style={styles.logoArea}>
            <SenacLogo />
          </View>

          <View style={styles.content}>

            {/* Avatar + Título lado a lado */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <AvatarPlaceholder />
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.title}>Primeiro acesso</Text>
                <Text style={styles.subtitle}>Crie uma conta</Text>
              </View>
            </View>

            {/* ── Campo: Nome ─────────────────────────────────────── */}
            <InputField
              label="Nome"
              iconName="person-outline"
              placeholder="João Pereira"
              value={nome}
              onChangeText={setNome}
              isFocused={nomeFocused}
              onFocus={() => setNomeFocused(true)}
              onBlur={() => setNomeFocused(false)}
            />

            {/* ── Campo: Matrícula ou E-mail ───────────────────────── */}
            <InputField
              label="Matricula ou E-mail"
              iconName="person-outline"
              placeholder="0020015786"
              value={matricula}
              onChangeText={setMatricula}
              isFocused={matriculaFocused}
              onFocus={() => setMatriculaFocused(true)}
              onBlur={() => setMatriculaFocused(false)}
            />

            {/* ── Campo: Senha com toggle ───────────────────────────── */}
            <InputField
              label="Senha"
              iconName="lock-closed-outline"
              placeholder="12345678"
              value={senha}
              onChangeText={setSenha}
              secureEntry                     // ativa o botão de olho
              isFocused={senhaFocused}
              onFocus={() => setSenhaFocused(true)}
              onBlur={() => setSenhaFocused(false)}
            />

            {/* ── Botão Entrar ─────────────────────────────────────── */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleEntrar}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Entrar"
            >
              <Text style={styles.buttonText}>
                {loading ? 'Aguarde...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            {/* ── Separador "ou continue com" ──────────────────────── */}
            <View style={styles.dividerWrapper}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>ou continue com</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* ── Link "Primeiro acesso? Ative sua conta" ──────────── */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Primeiro acesso? </Text>
              <TouchableOpacity
                onPress={() => {/* TODO: navegar para ativação de conta */ }}
                accessibilityRole="link"
              >
                {/* "Ative sua conta" em laranja — link de ação */}
                <Text style={styles.footerLink}>Ative sua conta</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}
