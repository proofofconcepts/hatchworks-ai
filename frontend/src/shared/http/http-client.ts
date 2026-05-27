import { log } from '../logger/logger'
import { useAuthStore } from '../store/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token
  const url = `${API_URL}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  log('debug', `${options.method ?? 'GET'} ${url}`)

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message: string = body.message ?? res.statusText
    log('error', `API error ${res.status}`, { path, message })
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}
