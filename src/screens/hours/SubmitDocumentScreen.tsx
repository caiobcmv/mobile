import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SubmitDocument'>;

export default function SubmitDocumentScreen({ navigation }: Props) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  // Simula o upload de arquivo preenchendo a barra de progresso de 0 a 100%
  const startUpload = () => {
    setUploadProgress(0);
    setHasUploaded(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setHasUploaded(true);
      }
    }, 150); // 1.5s total para o "loading"
  };

  const handleDeleteFile = () => {
    setUploadProgress(0);
    setHasUploaded(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B3A6B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Corrigir envio</Text>
        </View>
        <View style={styles.avatarPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Enviar Documentação</Text>
        <Text style={styles.pageSubtitle}>
          Siga as instruções para validar sua atividade acadêmica.
        </Text>

        {/* ── INFO ALERT ── */}
        <View style={styles.infoAlert}>
          <Ionicons name="information-circle-outline" size={22} color="#B45309" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Envie seu comprovante em formato PDF, PNG, JPEG ou Imagem. Certifique-se de que todas as informações estejam legíveis
          </Text>
        </View>

        {/* ── BOTÕES DE UPLOAD ── */}
        <View style={styles.uploadButtonsRow}>
          <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7} onPress={startUpload}>
            <View style={styles.uploadIconBg}>
              <Ionicons name="camera-outline" size={24} color="#1B3A6B" />
            </View>
            <Text style={styles.uploadButtonText}>Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7} onPress={startUpload}>
            <View style={styles.uploadIconBg}>
              <Ionicons name="image-outline" size={24} color="#1B3A6B" />
            </View>
            <Text style={styles.uploadButtonText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {/* ── ARQUIVO ANEXADO (SÓ APARECE QUANDO O UPLOAD INICIA) ── */}
        {uploadProgress > 0 && (
          <View style={styles.fileCard}>
            <View style={styles.fileCardLeftLine} />
            
            <View style={styles.fileCardContent}>
              <View style={styles.fileInfoRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    comprovante_atividades_2026.pdf
                  </Text>
                  <Text style={styles.fileDetail}>2.4 MB • PDF Document</Text>
                </View>
                {hasUploaded && (
                  <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteFile}>
                    <Ionicons name="trash-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Barra de progresso do upload */}
              <View style={styles.uploadProgressBg}>
                <View style={[styles.uploadProgressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          </View>
        )}

        {/* ── BOTÕES DE AÇÃO INFERIORES ── */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, !hasUploaded && styles.submitButtonDisabled]} 
            activeOpacity={0.85}
            disabled={!hasUploaded}
            onPress={() => setIsReviewModalVisible(true)}
          >
            <Text style={[styles.submitButtonText, !hasUploaded && styles.submitButtonTextDisabled]}>
              Enviar Atividade
            </Text>
            <Ionicons name="send" size={16} color={hasUploaded ? "#FFFFFF" : "#9CA3AF"} style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── MODAL DE REVISÃO DA ATIVIDADE ── */}
      <Modal
        visible={isReviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHandleBar} />
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Revisar Atividade</Text>
              <Text style={styles.modalSubtitle}>Confira os detalhes antes de enviar para análise.</Text>

              {/* Linha de Cards: Categoria e Carga Horária */}
              <View style={styles.modalRowCards}>
                <View style={styles.modalMiniCard}>
                  <Text style={styles.modalMiniCardLabel}>Categoria</Text>
                  <Text style={styles.modalMiniCardValue}>Extensão Acadêmica</Text>
                </View>
                <View style={styles.modalMiniCard}>
                  <Text style={styles.modalMiniCardLabel}>Carga Horária</Text>
                  <Text style={styles.modalMiniCardValue}>12 Horas</Text>
                </View>
              </View>

              {/* Descrição */}
              <View style={styles.modalBigCard}>
                <Text style={styles.modalMiniCardLabel}>Descrição</Text>
                <Text style={styles.modalDescriptionText}>
                  "Participação no Workshop de UI/UX Design Moderno realizado na Unidade Senac Centro..."
                </Text>
              </View>

              {/* Arquivo */}
              <View style={[styles.modalBigCard, { flexDirection: 'row', alignItems: 'center' }]}>
                {/* Mock da thumbnail da imagem */}
                <View style={styles.thumbnailPlaceholder}>
                  <Ionicons name="image" size={24} color="#00478F" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalMiniCardLabel}>Arquivo Anexado</Text>
                  <Text style={styles.modalMiniCardValue}>certificado_workshop_uiux.pdf</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={24} color="#B45309" />
              </View>

              {/* Info Block (Laranja) */}
              <View style={styles.modalInfoBlock}>
                <Ionicons name="information-circle-outline" size={20} color="#B45309" style={{ marginRight: 8 }} />
                <Text style={styles.modalInfoText}>
                  Ao enviar, sua atividade passará por análise do coordenador. Você será notificado sobre o status.
                </Text>
              </View>

              {/* Modal Buttons */}
              <TouchableOpacity 
                style={styles.modalConfirmButton} 
                activeOpacity={0.85}
                onPress={() => {
                  setIsReviewModalVisible(false);
                  navigation.navigate('SubmitSuccess');
                }}
              >
                <Text style={styles.modalConfirmText}>Confirmar e Enviar</Text>
                <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalEditButton} onPress={() => setIsReviewModalVisible(false)}>
                <Text style={styles.modalEditText}>Editar Dados</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalBackButton} onPress={() => setIsReviewModalVisible(false)}>
                <Text style={styles.modalBackText}>Voltar</Text>
              </TouchableOpacity>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── BOTTOM TAB BAR (Mockup) ── */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.bottomTabItem} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="grid-outline" size={24} color="#9CA3AF" />
          <Text style={styles.bottomTabLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTabItem} onPress={() => navigation.navigate('HoursList')}>
          <Ionicons name="reader" size={24} color="#1B3A6B" />
          <Text style={[styles.bottomTabLabel, { color: '#1B3A6B', fontWeight: '600' }]}>Atividades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTabItem}>
          <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
          <Text style={styles.bottomTabLabel}>Alertas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomTabItem}>
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
    justifyContent: 'space-between',
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
  backButton: {
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B3A6B',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1D5DB',
  },

  // ── SCROLL / LAYOUT ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B3A6B',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },

  // ── INFO ALERT ──
  infoAlert: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },

  // ── BOTÕES DE UPLOAD ──
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  uploadButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B3A6B',
  },

  // ── ARQUIVO ANEXADO ──
  fileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  fileCardLeftLine: {
    width: 4,
    backgroundColor: '#D1D5DB',
  },
  fileCardContent: {
    flex: 1,
    padding: 16,
  },
  fileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  fileDetail: {
    fontSize: 12,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 4,
  },
  uploadProgressBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B', // Laranja amarelado
    borderRadius: 2,
  },

  // ── BOTÕES DE AÇÃO INFERIORES ──
  actionButtonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#00478F', // Azul escuro
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 10,
    shadowColor: '#00478F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#9CA3AF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1B3A6B',
  },
  cancelButtonText: {
    color: '#1B3A6B',
    fontSize: 16,
    fontWeight: '600',
  },

  // ── MODAL ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '85%',
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B3A6B',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  modalRowCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalMiniCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  modalMiniCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalMiniCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  modalBigCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  modalDescriptionText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: '#E0E7FF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalInfoBlock: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED', // Laranja clarinho
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#9A3412',
    lineHeight: 18,
  },
  modalConfirmButton: {
    backgroundColor: '#00478F', // Azul escuro
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalEditButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginBottom: 4,
  },
  modalEditText: {
    color: '#1B3A6B',
    fontSize: 15,
    fontWeight: '500',
  },
  modalBackButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  modalBackText: {
    color: '#6B7280',
    fontSize: 15,
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
    justifyContent: 'space-around',
    alignItems: 'center',
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
