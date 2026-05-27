'use client'

import { create } from 'zustand'
import { login } from '@/modules/auth/application/auth.service'
import { ApiError } from '@/shared/http/http-client'

interface LoginFormState {
  email: string
  password: string
  isLoading: boolean
  formError: string | null
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  submit: () => Promise<boolean>
  resetForm: () => void
}

export const useLoginFormStore = create<LoginFormState>()((set, get) => ({
  email: '',
  password: '',
  isLoading: false,
  formError: null,

  setEmail: (value) => set({ email: value, formError: null }),
  setPassword: (value) => set({ password: value, formError: null }),

  submit: async () => {
    const { email, password } = get()
    set({ isLoading: true, formError: null })
    try {
      await login({ email, password })
      get().resetForm()
      return true
    } catch (err) {
      set({ formError: err instanceof ApiError ? err.message : 'Something went wrong' })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  resetForm: () => set({ email: '', password: '', formError: null }),
}))
