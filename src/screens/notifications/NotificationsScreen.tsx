import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type NotificationType = 'todas' | 'aprovadas' | 'pendentes' | 'reprovadas';

export default function NotificationsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<NotificationType>('todas');

  // Filtros (Chips)
  const TABS: { id: NotificationType; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'aprovadas', label: 'Aprovadas' },
    { id: 'pendentes', label: 'Pendentes' },
    { id: 'reprovadas', label: 'Reprovadas' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.headerTitle}>Notificações</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── CHIPS (TABS) ── */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.chip, activeTab === tab.id && styles.chipActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.chipText, activeTab === tab.id && styles.chipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── RECENTES ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recentes</Text>
          <TouchableOpacity>
            <Text style={styles.markAllReadText}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        </View>

        {/* Card 1: Aprovada */}
        <View style={[styles.notificationCard, { borderLeftColor: '#10B981' }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark" size={20} color="#059669" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Atividade Aprovada</Text>
            <Text style={styles.cardDescription}>
              Certificado de Inglês (40h) foi validado com sucesso.
            </Text>
            <Text style={styles.cardTime}>Há 5 minutos</Text>
          </View>
          <View style={styles.unreadDot} />
        </View>

        {/* Card 2: Feedback */}
        <View style={[styles.notificationCard, { borderLeftColor: '#F59E0B' }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="chatbubble" size={18} color="#D97706" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Feedback Recebido</Text>
            <Text style={styles.cardDescription}>
              Seu relatório da Palestra Acadêmica recebeu um novo comentário do tutor.
            </Text>
            <Text style={styles.cardTime}>Há 2 horas</Text>
          </View>
          <View style={styles.unreadDot} />
        </View>

        {/* Card 3: Reprovada */}
        <View style={[styles.notificationCard, { borderLeftColor: '#DC2626' }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="close" size={20} color="#B91C1C" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Atividade Reprovada</Text>
            <Text style={styles.cardDescription}>
              O documento 'Relatório de Estágio' não atende aos requisitos.
            </Text>
            <Text style={styles.cardTime}>Há 3 horas</Text>
          </View>
          <View style={styles.unreadDot} />
        </View>

        {/* Card 4: Lembrete com Progress Bar */}
        <View style={[styles.notificationCard, { borderLeftColor: '#DC2626' }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="warning" size={18} color="#B91C1C" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lembrete de Meta</Text>
            <Text style={styles.cardDescription}>
              Faltam 20h para concluir sua meta de horas complementares do semestre.
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '70%' }]} />
            </View>
            <Text style={styles.cardTime}>Há 4 horas</Text>
          </View>
          <View style={styles.unreadDot} />
        </View>

        {/* ── ANTERIORES ── */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Anteriores</Text>
        </View>

        {/* Card 5: Lida (sem borda colorida e sem bolinha) */}
        <View style={[styles.notificationCard, { borderLeftColor: 'transparent', paddingLeft: 16 }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Aula Cancelada</Text>
            <Text style={styles.cardDescription}>
              A aula de 'Gestão de Projetos' do dia 15/10 foi reagendada.
            </Text>
            <Text style={styles.cardTime}>Ontem</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── BOTTOM TAB BAR ── */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTabItem} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="grid-outline" size={24} color="#9CA3AF" />
          <Text style={styles.bottomTabLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTabItem} onPress={() => navigation.navigate('HoursList')}>
          <Ionicons name="reader-outline" size={24} color="#9CA3AF" />
          <Text style={styles.bottomTabLabel}>Atividades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTabItem}>
          <Ionicons name="notifications" size={24} color="#1B3A6B" />
          <Text style={[styles.bottomTabLabel, { color: '#1B3A6B', fontWeight: '600' }]}>Alertas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTabItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text style={styles.bottomTabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  
  // ── HEADER ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1B3A6B',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B3A6B',
  },

  // ── SCROLL / LAYOUT ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  // ── CHIPS (TABS) ──
  chipsScroll: {
    marginBottom: 24,
  },
  chipsContainer: {
    gap: 8,
    paddingRight: 16, // Para não colar na borda direita no final do scroll
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: '#00478F',
    borderColor: '#00478F',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // ── SECTIONS ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  markAllReadText: {
    fontSize: 13,
    color: '#00478F',
    fontWeight: '600',
  },

  // ── NOTIFICATION CARDS ──
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    paddingLeft: 12, // espaço para a borda colorida
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B', // Laranja
    marginLeft: 8,
    marginTop: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },

  // ── BOTTOM TAB BAR ──
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    // Removido alignItems: 'center' para que flex: 1 e height: 100% ocupem toda a área de clique
  },
  bottomTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  bottomTabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
