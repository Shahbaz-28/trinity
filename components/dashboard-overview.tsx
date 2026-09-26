import Link from 'next/link'
import { ArrowRight, ChevronRight, Landmark, Search, Sparkles } from 'lucide-react'
import type { ActiveServiceWithProvider, ProfileRow } from '@/lib/supabase/queries'
import { StatusPill } from './shared'

const toneForStatus: Record<ActiveServiceWithProvider['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export function DashboardOverview({ profile, activeServices }: { profile: ProfileRow; activeServices: ActiveServiceWithProvider[] }) {
  const firstName = profile.full_name.split(' ')[0] || 'there'
  const initial = profile.full_name[0]?.toUpperCase() ?? 'U'

  return (
    <>
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Good morning, {firstName}</h1>
          <p>Here&apos;s what&apos;s happening with your business.</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="icon-button" aria-label="Search"><Search size={18} /></button>
          <div className="dashboard-avatar">{initial}</div>
        </div>
      </div>
      <div className="stat-grid">
        {[
          ['Active Services', String(activeServices.length), activeServices.length ? 'Up to date' : 'None yet'],
          ['Completed', '0', 'None yet'],
          ['Pending', '0', 'All clear'],
          ['Next Deadline', '—', 'No deadlines yet'],
        ].map(([label, value, meta]) => (
          <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></div>
        ))}
      </div>
      <div className="dashboard-main-grid">
        <section className="dashboard-panel active-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Your work</p><h2>Active Services</h2></div>
            <Link href="/dashboard/services" className="text-link">View All <ArrowRight size={14} /></Link>
          </div>
          {activeServices.length === 0 ? (
            <div className="dashboard-empty">
              <p>You haven&apos;t chosen a service provider yet.</p>
              <Link href="/providers" className="button button-primary">Browse Providers <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <div className="active-list">
              {activeServices.slice(0, 4).map((service) => (
                <Link href={`/dashboard/services/${service.id}`} className="active-row" key={service.id}>
                  <span className="service-icon icon-blue"><Landmark size={18} /></span>
                  <span className="active-name">
                    <strong>{service.provider_profiles.name}</strong>
                    <small>{service.provider_profiles.category} · {service.provider_profiles.specialization}</small>
                  </span>
                  <StatusPill tone={toneForStatus[service.status]}>{service.status}</StatusPill>
                  <ChevronRight size={16} className="row-chevron" />
                </Link>
              ))}
            </div>
          )}
        </section>
        <section className="dashboard-panel upcoming-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Coming up</p><h2>Upcoming</h2></div>
            <span className="calendar-badge">Aug 2026</span>
          </div>
          <div className="tip-card">
            <Sparkles size={16} />
            <span><strong>Stay ahead of deadlines</strong><small>We&apos;ll keep you posted as work moves along.</small></span>
          </div>
        </section>
      </div>
    </>
  )
}
