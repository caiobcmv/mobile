/**
 * SelectCourseScreen.tsx
 *
 * Exibida logo após o login.
 * O aluno escolhe em qual curso (matrícula ativa) deseja entrar.
 *
 * Layout baseado no design "Selecione seu curso" do Senac Acadêmico.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

// ─── Tipos ───────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<RootStackParamList, 'SelectCourse'>;

interface Course {
  id: string;
  name: string;
  unit: string;
  module: string;
  modality: 'Presencial' | 'EAD' | 'Híbrido';
  status: 'Ativo' | 'Concluído' | 'Suspenso';
  image: any;
}

// ─── Dados mock (substituir por API) ─────────────────────────────────────────
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: 'Análise e desenvolv. de sistemas',
    unit: 'Unidade De Santo Amaro',
    module: '4º Módulo',
    modality: 'Presencial',
    status: 'Ativo',
    image: require('../../assets/images/course_tech.png'),
  },
  {
    id: '2',
    name: 'Design De Interiores',
    unit: 'Unidade Digital Nacional',
    module: '2º Módulo',
    modality: 'EAD',
    status: 'Ativo',
    image: require('../../assets/images/course_design.png'),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getModalityIcon = (modality: Course['modality']) => {
  if (modality === 'EAD') return 'desktop-outline';
  if (modality === 'Híbrido') return 'business-outline';
  return 'business-outline';
};

// ─── Componente de card de curso ─────────────────────────────────────────────
function CourseCard({ course, onPress }: { course: Course; onPress: () => void }) {
  return (
    <View style={styles.card}>
      {/* Imagem do curso */}
      <Image source={course.image} style={styles.cardImage} resizeMode="cover" />

      {/* Badges de status e modalidade */}
      <View style={styles.cardBadgeRow}>
        <View style={[
          styles.badge,
          course.status === 'Ativo' ? styles.badgeActive : styles.badgeInactive,
        ]}>
          <Text style={[
            styles.badgeText,
            course.status === 'Ativo' ? styles.badgeActiveText : styles.badgeInactiveText,
          ]}>
            {course.status}
          </Text>
        </View>

        <View style={styles.modalityBadge}>
          <Ionicons name={getModalityIcon(course.modality)} size={14} color="#6B7280" />
          <Text style={styles.modalityText}>{course.modality}</Text>
        </View>
      </View>

      {/* Informações do curso */}
      <View style={styles.cardBody}>
        <Text style={styles.courseName}>{course.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={15} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoText}>{course.unit}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={15} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoText}>{course.module}</Text>
        </View>
      </View>

      {/* Botão de ação */}
      <TouchableOpacity style={styles.accessButton} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.accessButtonText}>Acessar curso  ›</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function SelectCourseScreen({ navigation }: Props) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    // TODO: salvar curso selecionado no contexto/storage e navegar pro Dashboard
    navigation.navigate('Dashboard');
  };

  const handleCatalog = () => {
    Alert.alert('Catálogo', 'Funcionalidade de catálogo em breve.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1B3A6B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Senac Acadêmico</Text>

        {/* Logo Senac */}
        <View style={styles.logoContainer}>
          <Ionicons name="school-outline" size={24} color="#1B3A6B" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título da seção */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Selecione seu curso</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha uma das suas matrículas ativas para{'\n'}acessar o ambiente de aprendizagem.
          </Text>
        </View>

        {/* Lista de cursos */}
        {MOCK_COURSES.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => handleSelectCourse(course)}
          />
        ))}

        {/* Card de Novas Oportunidades */}
        <View style={styles.opportunitiesCard}>
          <View style={styles.plusCircle}>
            <Ionicons name="add" size={28} color="#9CA3AF" />
          </View>
          <Text style={styles.opportunitiesTitle}>Novas Oportunidades</Text>
          <Text style={styles.opportunitiesSubtitle}>
            Explore novos cursos e expanda suas{'\n'}habilidades profissionais.
          </Text>
          <TouchableOpacity style={styles.catalogButton} onPress={handleCatalog} activeOpacity={0.8}>
            <Text style={styles.catalogButtonText}>Ver Catálogo</Text>
          </TouchableOpacity>
        </View>

        {/* Banner de aviso */}
        <View style={styles.warningBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#3B82F6" style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Não encontrou seu curso? Verifique se sua matrícula foi confirmada ou entre em contato com a secretaria da sua unidade.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#1B3A6B',
    fontWeight: '300',
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1B3A6B',
    letterSpacing: 0.2,
  },
  logoContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // ── Seção de título ──
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B3A6B',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // ── Card de curso ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: '#E6F4EA',
  },
  badgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeActiveText: {
    color: '#16A34A',
  },
  badgeInactiveText: {
    color: '#DC2626',
  },
  modalityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalityIcon: {
    fontSize: 13,
  },
  modalityText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  courseName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B3A6B',
    marginBottom: 8,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  infoIcon: {
    fontSize: 13,
    width: 18,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  accessButton: {
    margin: 14,
    marginTop: 12,
    backgroundColor: '#1B3A6B',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  accessButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Card de Novas Oportunidades ──
  opportunitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  plusCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  plusIcon: {
    fontSize: 26,
    color: '#9CA3AF',
    lineHeight: 30,
    fontWeight: '300',
  },
  opportunitiesTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  opportunitiesSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  catalogButton: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  catalogButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  // ── Banner de aviso ──
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 8,
  },
  warningIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 18,
  },
});
