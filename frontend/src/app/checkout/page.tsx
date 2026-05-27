'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/store/auth.store'
import { logout } from '@/modules/auth/application/auth.service'
import CheckoutForm from '@/modules/checkout/presentation/CheckoutForm'

export default function CheckoutPage() {
  const router = useRouter()
  const { token, email } = useAuthStore()

  useEffect(() => {
    if (!token) router.replace('/login')
  }, [token, router])

  if (!token) return null

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{email}</span>
            <button onClick={handleLogout} className="text-indigo-600 hover:underline">
              Sign out
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <CheckoutForm />
        </div>
      </div>
    </main>
  )
}
