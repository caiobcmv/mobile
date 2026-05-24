import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, HourSubmission } from '../../types';
import { hoursService, ResumoHorasResponse, MeusDadosResponse } from '../../services/api/hoursService';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [resumo, setResumo] = useState<ResumoHorasResponse | null>(null);
  const [meusDados, setMeusDados] = useState<MeusDadosResponse | null>(null);
  const [recentActivities, setRecentActivities] = useState<HourSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setLoading(true);
      Promise.all([
        hoursService.getResumoHoras(),
        hoursService.getMeusDados(),
        hoursService.getAll()
      ]).then(([{ data: resumoData }, { data: meusDadosData }, { data: activitiesData }]) => {
        if (isMounted) {
          setResumo(resumoData);
          setMeusDados(meusDadosData);
          setRecentActivities(activitiesData.slice(0, 3));
          setLoading(false);
        }
      }).catch(err => {
        console.error('Erro ao buscar dados do dashboard:', err);
        if (isMounted) setLoading(false);
      });
      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#1B3A6B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SENAC Acadêmico</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1B3A6B" />
          <Text style={{ marginTop: 12, color: '#6B7280' }}>Carregando dados acadêmicos...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── BEM-VINDO ── */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeLabel}>BEM-VINDO(A),</Text>
            <Text style={styles.userName}>{meusDados?.aluno?.nome || 'Estudante'}</Text>
            
            <View style={styles.courseRow}>
              <Ionicons name="school" size={16} color="#E87722" style={{ marginRight: 6 }} />
              <Text style={styles.courseName}>{meusDados?.aluno?.curso_nome || resumo?.curso || 'Curso não identificado'}</Text>
            </View>
          </View>

          {/* ── CARD PRINCIPAL: HORAS ACUMULADAS ── */}
          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Horas Acumuladas</Text>
            
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progresso total do curso</Text>
              <Text style={styles.progressPercentage}>{resumo ? Math.round(resumo.percentual_total) : 0}%</Text>
            </View>
            
            <Text style={styles.hoursText}>
              <Text style={styles.hoursDone}>{resumo ? resumo.total_integralizado : 0}</Text> / {resumo ? resumo.total_obrigatorio : 0}h
            </Text>

            {/* Barra de Progresso visual */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${resumo ? Math.round(resumo.percentual_total) : 0}%` }]} />
            </View>

            <View style={styles.divider} />

            <View style={styles.moduleRow}>
              <Text style={styles.moduleLabel}>Horas Em Análise</Text>
              <Text style={styles.moduleValue}>{resumo ? resumo.total_em_analise : 0}h</Text>
            </View>
          </View>

          {/* ── CARDS DE RESUMO (STATUS) ── */}
          <View style={styles.summaryRow}>
            {/* Pendentes */}
            <View style={styles.summaryCard}>
              <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.summaryValue}>{String(meusDados?.pendentes || 0).padStart(2, '0')}</Text>
              <Text style={styles.summaryLabel}>Pendentes</Text>
            </View>

            {/* Aprovadas */}
            <View style={styles.summaryCard}>
              <View style={[styles.iconBg, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="checkmark" size={20} color="#10B981" />
              </View>
              <Text style={styles.summaryValue}>{resumo ? resumo.total_integralizado : 0}h</Text>
              <Text style={styles.summaryLabel}>Aprovadas</Text>
            </View>

            {/* Total Envios */}
            <View style={styles.summaryCard}>
              <View style={[styles.iconBg, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="document-text" size={20} color="#0284C7" />
              </View>
              <Text style={styles.summaryValue}>{String(meusDados?.total_submissoes || 0).padStart(2, '0')}</Text>
              <Text style={styles.summaryLabel}>Total Envios</Text>
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
            
            {recentActivities.map((activity) => {
              const dateStr = activity.submitted_at || activity.created_at || new Date().toISOString();
              const dateFormatted = new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
              return (
                <TouchableOpacity
                  key={activity.id}
                  style={[styles.activityCard, { marginBottom: 12 }]}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('HoursList')}
                >
                  <View style={styles.activityIconBg}>
                    <Ionicons name="document-text" size={24} color="#1B3A6B" />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName} numberOfLines={2}>{activity.title}</Text>
                    <Text style={styles.activityDate}>Enviado em {dateFormatted}</Text>
                  </View>
                  <View style={[
                    activity.status === 'approved' ? styles.badgeApproved :
                    activity.status === 'rejected' ? styles.badgeRejected : styles.badgePending
                  ]}>
                    <Text style={[
                      activity.status === 'approved' ? styles.badgeApprovedText :
                      activity.status === 'rejected' ? styles.badgeRejectedText : styles.badgePendingText
                    ]}>
                      {activity.status === 'approved' ? 'Aprovada' :
                       activity.status === 'rejected' ? 'Reprovada' : 'Pendente'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {recentActivities.length === 0 && (
              <Text style={styles.emptyRecentText}>Nenhuma atividade enviada recentemente.</Text>
            )}
          </View>

          {/* Espaçamento extra pro bottom tab não cobrir o conteúdo */}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* ── BOTTOM TAB BAR (Estática/Mock) ── */}
      <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
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
  badgePending: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgePendingText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeRejected: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeRejectedText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyRecentText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },

  // ── BOTTOM TAB BAR (Mockup) ──
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
