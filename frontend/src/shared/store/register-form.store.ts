'use client'

import { create } from 'zustand'
import { register } from '@/modules/auth/application/auth.service'
import { ApiError } from '@/shared/http/http-client'

export const PASSWORD_MIN_LENGTH = 6

interface RegisterFormState {
  email: string
  password: string
  isLoading: boolean
  formError: string | null
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  submit: () => Promise<boolean>
  resetForm: () => void
}

export const useRegisterFormStore = create<RegisterFormState>()((set, get) => ({
  email: '',
  password: '',
  isLoading: false,
  formError: null,

  setEmail: (value) => set({ email: value, formError: null }),
  setPassword: (value) => set({ password: value, formError: null }),

  submit: async () => {
    const { email, password } = get()

    if (password.length < PASSWORD_MIN_LENGTH) {
      set({ formError: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
      return false
    }

    set({ isLoading: true, formError: null })
    try {
      await register({ email, password })
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
