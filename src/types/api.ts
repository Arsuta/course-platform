export interface User {
  id: number
  email: string
  role: 'student' | 'author' | 'admin'
}

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
  role: 'student' | 'author' | 'admin'
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

export interface RefreshInput {
  refresh_token: string
} 