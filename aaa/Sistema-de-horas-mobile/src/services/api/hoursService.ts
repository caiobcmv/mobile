import api from './client';
import { HourSubmission } from '../../types';

export interface CreateSubmissionPayload {
  course_id: number;
  category_id: number;
  title: string;
  description: string;
  requested_hours: number;
  activity_date: string;
  institution_name?: string;
  certificate_number?: string;
  organizer_name?: string;
}

export interface ResumoHorasResponse {
  course_id: number;
  curso: string;
  total_obrigatorio: number;
  total_integralizado: number;
  total_em_analise: number;
  percentual_total: number;
  limites: Array<{
    category_id: number;
    categoria: string;
    min_horas: number;
    max_horas: number;
    horas_aprovadas: number;
    percentual: number;
  }>;
}

export interface MeusDadosResponse {
  aluno: {
    nome: string;
    email: string;
    curso_nome: string;
  };
  total_submissoes: number;
  pendentes: number;
  horas_aprovadas: number;
}

export const hoursService = {
  getAll: (status?: string, courseId?: string) =>
    api.get<HourSubmission[]>('/aluno/submissoes', {
      params: { status, course_id: courseId },
    }),

  create: (payload: CreateSubmissionPayload) =>
    api.post<{ mensagem: string; submissao: HourSubmission }>('/aluno/submissao', payload),

  update: (id: string, payload: Partial<CreateSubmissionPayload>) =>
    api.put<{ mensagem: string; submissao: HourSubmission }>(`/aluno/submissao/${id}`, payload),

  delete: (id: string) => api.delete<{ mensagem: string }>(`/aluno/submissao/${id}`),

  getResumoHoras: () => api.get<ResumoHorasResponse>('/aluno/resumo-horas'),

  getMeusDados: () => api.get<MeusDadosResponse>('/aluno/meus-dados'),

  uploadFile: (submissionId: string, fileUri: string, fileName: string, fileMimeType: string) => {
    const formData = new FormData();
    formData.append('certificado', {
      uri: fileUri,
      name: fileName,
      type: fileMimeType,
    } as any);

    return api.post<{ mensagem: string; arquivo: any }>(
      `/aluno/submissao/${submissionId}/arquivo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};
