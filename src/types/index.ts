// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'aluno' | 'coordenador' | 'superadmin';
  courseId?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Hours / Submissions ──────────────────────────────────────────────────────
export type SubmissionStatus = 'pendente' | 'aprovado' | 'rejeitado';

export interface HourSubmission {
  id: string;
  userId: string;
  title: string;
  description: string;
  hours: number;
  category: string;
  date: string;
  status: SubmissionStatus;
  attachmentUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  feedback?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export type RootStackParamList = {
  // Tela de entrada
  Welcome: undefined;      // ← primeira tela que o usuário vê

  // Fluxo de primeiro acesso
  FirstAccess: undefined;  // ← quando é o primeiro login do usuário

  // Auth stack
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // App stack
  Dashboard: undefined;
  SubmitHours: undefined;
  HoursList: undefined;
  HourDetail: { id: string };
  Profile: undefined;
  Settings: undefined;
};

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
