import api from './client';
import { HourSubmission, PaginatedResponse } from '../../types';

interface CreateSubmissionPayload {
  title: string;
  description: string;
  hours: number;
  category: string;
  date: string;
  attachmentUrl?: string;
}

export const hoursService = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<HourSubmission>>('/hours', {
      params: { page, limit },
    }),

  getById: (id: string) => api.get<HourSubmission>(`/hours/${id}`),

  create: (payload: CreateSubmissionPayload) =>
    api.post<HourSubmission>('/hours', payload),

  update: (id: string, payload: Partial<CreateSubmissionPayload>) =>
    api.put<HourSubmission>(`/hours/${id}`, payload),

  delete: (id: string) => api.delete(`/hours/${id}`),

  // Coordenador
  review: (id: string, status: 'aprovado' | 'rejeitado', feedback?: string) =>
    api.patch(`/hours/${id}/review`, { status, feedback }),
};
