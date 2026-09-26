'use client'

import { useRouter } from 'next/navigation'

// Where to send someone who clicks "Get Started"/"Login" from a public page.
// We don't need to know their auth state here: proxy.ts redirects to
// /signin if they're not authenticated, and the dashboard layout redirects
// to /providers if they have no active services yet — both server-side,
// both the actual source of truth.
export function useEnterApp() {
  const router = useRouter()
  return () => router.push('/dashboard')
}
