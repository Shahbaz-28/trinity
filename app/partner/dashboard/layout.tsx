import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentProfile, getMyProviderApplication } from '@/lib/supabase/queries'
import { signOut } from '@/app/actions/auth'
import { DashboardShell, type ShellNavItem } from '@/components/dashboard-shell'
import { ExitPreview } from '@/components/exit-preview'

const navItems: ShellNavItem[] = [
  { href: '/partner/dashboard', label: 'Overview', icon: 'BarChart3' },
  { href: '/partner/dashboard/clients', label: 'Clients', icon: 'Users' },
  { href: '/partner/dashboard/listing', label: 'My Listing', icon: 'Briefcase' },
]

// Being signed in is already guaranteed by proxy.ts before this renders.
export default async function ProviderDashboardLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/signin')

  const application = await getMyProviderApplication()
  if (application?.status !== 'approved') redirect('/partner/apply')

  return <>
    <DashboardShell
      user={{ name: profile.full_name, email: profile.email }}
      navItems={navItems}
      settingsHref="/partner/dashboard/settings"
      profileHref="/partner/dashboard/listing"
      onLogout={signOut}
    >
      {children}
    </DashboardShell>
    <ExitPreview />
  </>
}
