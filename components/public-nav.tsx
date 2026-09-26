'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useEnterApp } from '@/lib/use-enter-app'
import { Button, Logo } from './shared'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/partner', label: 'For Professionals' },
]

export function PublicNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const enterApp = useEnterApp()
  const close = () => setOpen(false)

  return (
    <header className="public-nav">
      <div className="container nav-inner">
        <Link href="/" className="logo-button" aria-label="Go to Trinity home"><Logo /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'nav-link active' : 'nav-link'}>{item.label}</Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="login-link" onClick={enterApp}>Login</button>
          <Button onClick={enterApp}>Get Started <ArrowRight size={16} /></Button>
        </div>
        <button className="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>
          ))}
          <button onClick={() => { close(); enterApp() }}>Login</button>
          <Button onClick={() => { close(); enterApp() }}>Get Started <ArrowRight size={16} /></Button>
        </nav>
      )}
    </header>
  )
}
