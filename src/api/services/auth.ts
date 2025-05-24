import { BaseAPI } from '../base'
import type { User, UserLogin, UserRegister } from '@/types/user'
import type { APIResponse } from '../base'
import { AUTH } from '../endpoints'

interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

export class AuthService extends BaseAPI {
  async login(email: string, password: string): Promise<APIResponse<AuthResponse>> {
    return this.post<AuthResponse>(AUTH.LOGIN, { email, password })
  }

  async register(data: UserRegister): Promise<APIResponse<AuthResponse>> {
    return this.post<AuthResponse>(AUTH.REGISTER, data)
  }

  async logout(): Promise<APIResponse<void>> {
    return this.post<void>(AUTH.LOGOUT)
  }

  async refresh(refresh_token: string): Promise<APIResponse<AuthResponse>> {
    return this.post<AuthResponse>(AUTH.REFRESH, { refresh_token })
  }

  async me(): Promise<APIResponse<User>> {
    return this.get<User>(AUTH.ME)
  }
} 