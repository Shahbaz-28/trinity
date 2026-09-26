import type { ReactNode } from 'react'
import { PublicNav } from '@/components/public-nav'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      {children}
    </>
  )
}
