import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile, getMyActiveServices } from '@/lib/supabase/queries'
import { signOut } from '@/app/actions/auth'
import { DashboardShell, type ShellNavItem } from '@/components/dashboard-shell'
import { ExitPreview } from '@/components/exit-preview'

const baseNavItems: ShellNavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: 'BarChart3' },
  { href: '/dashboard/services', label: 'Services', icon: 'BriefcaseBusiness' },
  { href: '/dashboard/requests', label: 'Requests', icon: 'ClipboardCheck' },
  { href: '/dashboard/documents', label: 'Documents', icon: 'FileText' },
  { href: '/dashboard/profile', label: 'Profile', icon: 'Users' },
]

// Being signed in is already guaranteed by proxy.ts before this renders.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/signin')

  const activeServices = await getMyActiveServices()
  if (activeServices.length === 0) redirect('/providers')

  const navItems: ShellNavItem[] =
    profile.role === 'admin' ? [...baseNavItems, { href: '/partner/admin', label: 'Admin', icon: 'ShieldCheck' }] : baseNavItems

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
