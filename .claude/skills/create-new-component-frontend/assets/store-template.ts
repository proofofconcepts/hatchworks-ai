// {feature-name}.store.ts
// Zustand store scoped to a single component or feature concern.
// - All component state lives here (no useState in the component).
// - All validation and business logic live here.
// - Async side-effects (API calls, cross-store triggers) live here.

import { create } from 'zustand'
// Import API infrastructure functions for this store's domain.
// import { somethingApi } from '../../modules/{module}/infrastructure/{module}.api'

// Export domain constants so the component can reference them for HTML
// attributes (e.g. maxLength) without duplicating magic numbers.
export const FEATURE_FIELD_MIN = 1
export const FEATURE_FIELD_MAX = 100

interface {FeatureName}State {
  // ── Async / loading flags ────────────────────────────────────────────────
  isLoading: boolean

  // ── Domain state (form fields, selections, etc.) ─────────────────────────
  // fieldValue: string

  // ── Validation / feedback ────────────────────────────────────────────────
  formError: string | null

  // ── Actions ──────────────────────────────────────────────────────────────
  // setFieldValue: (value: string) => void
  // submit: (token: string) => Promise<boolean>
  resetForm: () => void
}

export const use{FeatureName}Store = create<{FeatureName}State>()((set, get) => ({
  isLoading: false,
  // fieldValue: '',
  formError: null,

  // setFieldValue: (value) => set({ fieldValue: value, formError: null }),

  // submit: async (token) => {
  //   // 1. Validate auth
  //   if (!token) {
  //     set({ formError: 'Authentication required.' })
  //     return false
  //   }
  //
  //   // 2. Validate business rules
  //   const { fieldValue } = get()
  //   if (fieldValue.trim().length < FEATURE_FIELD_MIN) {
  //     set({ formError: `Value must be at least ${FEATURE_FIELD_MIN} characters.` })
  //     return false
  //   }
  //
  //   // 3. API call
  //   set({ isLoading: true, formError: null })
  //   try {
  //     await somethingApi({ field: fieldValue.trim() })
  //     // Cross-store side-effect example:
  //     // useOtherStore.getState().reload()
  //     get().resetForm()
  //     return true
  //   } catch (err) {
  //     set({ formError: err instanceof Error ? err.message : 'Unexpected error.' })
  //     return false
  //   } finally {
  //     set({ isLoading: false })
  //   }
  // },

  resetForm: () => set({ formError: null }),
}))
