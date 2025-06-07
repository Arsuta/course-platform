// Типы для аутентификации
import type { UserProfile as APIUserProfile, UserRole } from '@/api/types';

// Реэкспортируем тип UserProfile из API типов для обратной совместимости
export type UserProfile = APIUserProfile;

export interface TokenPair {
  access_token: string
  refresh_token: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserCreate {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface VerificationRequest {
  email: string
  code: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  email: string
  code: string
  new_password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginVerificationRequest {
  email: string
  code: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface EmailVerificationRequest {
  email: string
  code: string
}

export interface PasswordResetConfirmRequest {
  email: string
  code: string
  new_password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
}

export interface TokenPayload {
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  roles: string[];
  email: string;
}

export interface TokenResponse {
  access_token: string
}

// Ответ от API аутентификации
export interface AuthApiResponse {
  verification_id?: string;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  [key: string]: any;
} 