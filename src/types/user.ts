export interface User {
  id: string
  email: string
  role: 'student' | 'author' | 'admin'
  first_name: string
  last_name: string
  avatar: string
  name?: string
  level?: number
  xp?: number
  following?: string[]
  followers?: string[]
}

export interface TokenPair {
  access_token: string
  refresh_token: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserRegister extends UserLogin {
  first_name: string
  last_name: string
}

export interface UserCreate extends UserRegister {
  role: User['role']
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
} 