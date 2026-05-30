import api from './client';
import { User, AuthState } from '../../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<User>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),

  redefinirSenha: (email: string, novaSenha: string) =>
    api.post<{ mensagem: string }>('/auth/redefinir-senha', { email, novaSenha }),
};
