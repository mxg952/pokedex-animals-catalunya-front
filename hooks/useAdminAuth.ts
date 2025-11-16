import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAdminAuth() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN_ROLE')) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'ADMIN_ROLE',
  }
}