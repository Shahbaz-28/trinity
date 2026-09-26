'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Briefcase, BriefcaseBusiness, ClipboardCheck, FileText, LogOut, Menu, Settings, ShieldCheck, Users } from 'lucide-react'
import { Logo } from './shared'

// Server Components can't pass component/function references as props to
// Client Components (only plain data and Server Actions cross that boundary),
// so nav items carry an icon *name* here and we resolve it to the real
// lucide-react component client-side.
const iconMap = {
  BarChart3,
  Briefcase,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Users,
} as const

export type ShellIconName = keyof typeof iconMap
export type ShellNavItem = { href: string; label: string; icon: ShellIconName }
type ShellUser = { name: string; email: string }

export function DashboardShell({
  children,
  user,
  navItems,
  settingsHref,
  profileHref,
  onLogout,
}: {
  children: ReactNode
  user: ShellUser
  navItems: ShellNavItem[]
  settingsHref: string
  profileHref: string
  onLogout: () => void
}) {
  const pathname = usePathname()
  const initial = user.name?.[0]?.toUpperCase() ?? 'U'

  return (
    <main className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <Logo />
          <nav>
            {navItems.map((item) => {
              const Icon = iconMap[item.icon]
              return (
                <Link key={item.href} href={item.href} className={pathname === item.href ? 'dashboard-nav-active' : undefined}>
                  <Icon size={17} />{item.label}
                </Link>
              )
            })}
          </nav>
          <div className="sidebar-bottom">
            <Link href={settingsHref} className={pathname === settingsHref ? 'dashboard-nav-active' : undefined}>
              <Settings size={17} />Settings
            </Link>
            <Link href={profileHref} className="user-chip">
              <span>{initial}</span>
              <span><strong>{user.name}</strong><small>{user.email}</small></span>
            </Link>
            <button className="logout-button" onClick={onLogout}><LogOut size={14} /> Log out</button>
          </div>
        </aside>
        <div className="dashboard-content">
          <div className="dashboard-mobile-top"><Logo /><Menu size={21} /></div>
          {children}
        </div>
      </div>
    </main>
  )
}
