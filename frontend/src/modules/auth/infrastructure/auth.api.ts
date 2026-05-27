import { apiRequest } from '@/shared/http/http-client'
import { AuthResponse, LoginRequest, RegisterRequest } from '../domain/auth.types'

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function registerApi(data: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
