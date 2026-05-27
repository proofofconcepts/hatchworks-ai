import { useAuthStore } from '@/shared/store/auth.store'
import { loginApi, registerApi } from '../infrastructure/auth.api'
import { LoginRequest, RegisterRequest } from '../domain/auth.types'

function decodeEmail(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.email ?? ''
  } catch {
    return ''
  }
}

export async function login(data: LoginRequest): Promise<void> {
  const { access_token } = await loginApi(data)
  useAuthStore.getState().setAuth(access_token, decodeEmail(access_token))
}

export async function register(data: RegisterRequest): Promise<void> {
  const { access_token } = await registerApi(data)
  useAuthStore.getState().setAuth(access_token, decodeEmail(access_token))
}

export function logout(): void {
  useAuthStore.getState().clearAuth()
}
