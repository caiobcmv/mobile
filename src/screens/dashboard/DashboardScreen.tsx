import React from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#1B3A6B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SENAC Acadêmico</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton}>
          <Ionicons name="person" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── BEM-VINDO ── */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>BEM-VINDO(A),</Text>
          <Text style={styles.userName}>Rodrigo Silva</Text>
          
          <View style={styles.courseRow}>
            <Ionicons name="school" size={16} color="#E87722" style={{ marginRight: 6 }} />
            <Text style={styles.courseName}>Técnico em Desenvolvimento de Sistemas</Text>
          </View>
        </View>

        {/* ── CARD PRINCIPAL: HORAS ACUMULADAS ── */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Horas Acumuladas</Text>
          
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso total do curso</Text>
            <Text style={styles.progressPercentage}>60%</Text>
          </View>
          
          <Text style={styles.hoursText}>
            <Text style={styles.hoursDone}>120</Text> / 200h
          </Text>

          {/* Barra de Progresso visual */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>

          <View style={styles.divider} />

          <View style={styles.moduleRow}>
            <Text style={styles.moduleLabel}>Módulo Atual</Text>
            <Text style={styles.moduleValue}>Unidade IV</Text>
          </View>
        </View>

        {/* ── CARDS DE RESUMO (STATUS) ── */}
        <View style={styles.summaryRow}>
          {/* Pendentes */}
          <View style={styles.summaryCard}>
            <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.summaryValue}>04</Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </View>

          {/* Aprovadas */}
          <View style={styles.summaryCard}>
            <View style={[styles.iconBg, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="checkmark" size={20} color="#10B981" />
            </View>
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Aprovadas</Text>
          </View>

          {/* Reprovadas */}
          <View style={styles.summaryCard}>
            <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert" size={20} color="#EF4444" />
            </View>
            <Text style={styles.summaryValue}>01</Text>
            <Text style={styles.summaryLabel}>Reprovadas</Text>
          </View>
        </View>

        {/* ── BOTÃO NOVA ATIVIDADE ── */}
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SubmitHours')}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Nova Atividade</Text>
        </TouchableOpacity>

        {/* ── ATIVIDADES RECENTES ── */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Atividades Recentes</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIconBg}>
              <Ionicons name="document-text" size={24} color="#1B3A6B" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityName} numberOfLines={2}>Relatório de Visita Técnica</Text>
              <Text style={styles.activityDate}>Enviado em 12 Out</Text>
            </View>
            <View style={styles.badgeApproved}>
              <Text style={styles.badgeApprovedText}>Aprovada</Text>
            </View>
          </View>
        </View>

        {/* Espaçamento extra pro bottom tab não cobrir o conteúdo */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── BOTTOM TAB BAR (Estática/Mock) ── */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="grid" size={24} color="#1B3A6B" />
          <Text style={[styles.tabLabel, { color: '#1B3A6B', fontWeight: '600' }]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('HoursList')}
        >
          <Ionicons name="reader-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Atividades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Alertas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Fundo levemente azulado/cinza bem claro
  },
  
  // ── HEADER ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F9FC',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B3A6B',
    letterSpacing: -0.3,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // ── SCROLL / LAYOUT ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // ── BEM-VINDO ──
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },

  // ── CARD PRINCIPAL ──
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1B3A6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B3A6B',
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B3A6B',
  },
  hoursText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  hoursDone: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1B3A6B',
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  moduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  moduleValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E87722',
  },

  // ── CARDS DE RESUMO ──
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ── BOTÃO NOVA ATIVIDADE ──
  actionButton: {
    backgroundColor: '#1B3A6B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    borderRadius: 14,
    marginBottom: 32,
    shadowColor: '#1B3A6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── ATIVIDADES RECENTES ──
  recentSection: {
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B3A6B',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF', // Azul bem clarinho
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
    lineHeight: 20,
  },
  activityDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  badgeApproved: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeApprovedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── BOTTOM TAB BAR (Mockup) ──
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
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
