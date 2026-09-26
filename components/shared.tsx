import type { ReactNode } from 'react'

export function Logo({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark">T</span><span>Trinity</span></div>
}

export function Button({ children, variant = 'primary', onClick, type = 'button' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; onClick?: () => void; type?: 'button' | 'submit' }) {
  return <button type={type} className={`button button-${variant}`} onClick={onClick}>{children}</button>
}

export function StatusPill({ children, tone }: { children: ReactNode; tone: 'blue' | 'green' | 'gold' | 'muted' }) {
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{children}</span>
}
