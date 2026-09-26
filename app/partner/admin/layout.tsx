import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/supabase/queries'
import { signOut } from '@/app/actions/auth'
import { DashboardShell, type ShellNavItem } from '@/components/dashboard-shell'
import { ExitPreview } from '@/components/exit-preview'

const navItems: ShellNavItem[] = [
  { href: '/partner/admin', label: 'Applications', icon: 'ClipboardCheck' },
]

// Being signed in is already guaranteed by proxy.ts before this renders.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/signin')
  if (profile.role !== 'admin') redirect('/dashboard')

  return <>
    <DashboardShell
      user={{ name: profile.full_name, email: profile.email }}
      navItems={navItems}
      settingsHref="/dashboard/settings"
      profileHref="/dashboard/profile"
      onLogout={signOut}
    >
      {children}
    </DashboardShell>
    <ExitPreview />
  </>
}
