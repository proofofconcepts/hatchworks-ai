// {ComponentName}.tsx
// Follows the frontend component conventions for this repository:
// - No useState: all mutable state lives in a Zustand store.
// - No business logic: validation and async actions live in the store.
// - Pure presentation: reads state, calls store actions, renders markup.

'use client'

import { useAuthStore } from '@/shared/store/auth.store'
import { use{FeatureName}Store /*, FEATURE_FIELD_MAX */ } from '@/shared/store/{feature-name}.store'

export default function {ComponentName}() {
  // Read token only when this component needs to pass it to a store action.
  const token = useAuthStore((s) => s.token)

  // Destructure only the slice of state and actions this component uses.
  const {
    isLoading,
    formError,
    // fieldValue,
    // setFieldValue,
    // submit,
  } = use{FeatureName}Store()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // const success = await submit(token ?? '')
    // if (success) { /* e.g. close modal, redirect */ }
  }

  return (
    <section className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Field example ─────────────────────────────────────────────── */}
        {/*
        <div>
          <label htmlFor="fieldId" className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            id="fieldId"
            type="text"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            maxLength={FEATURE_FIELD_MAX}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        */}

        {/* ── Inline error ──────────────────────────────────────────────── */}
        {formError && (
          <p className="text-sm text-red-600">{formError}</p>
        )}

        {/* ── Submit button ─────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving…' : 'Save'}
        </button>

      </form>
    </section>
  )
}
