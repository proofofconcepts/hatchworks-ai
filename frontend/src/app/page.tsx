'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/store/auth.store'

export default function HomePage() {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    router.replace(token ? '/checkout' : '/login')
  }, [token, router])

  return null
}
