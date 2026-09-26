import Link from 'next/link'
import { ArrowRight, ChevronRight, Star, User as UserIcon } from 'lucide-react'
import { StatusPill } from '@/components/shared'
import { getMyClientEngagements, getMyProviderApplication } from '@/lib/supabase/queries'
import type { ActiveServiceWithClient } from '@/lib/supabase/queries'

const toneForStatus: Record<ActiveServiceWithClient['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export default async function ProviderOverviewPage() {
  const [application, engagements] = await Promise.all([getMyProviderApplication(), getMyClientEngagements()])
  const firstName = application!.name.split(' ')[0] || 'there'
  const activeCount = engagements.filter((engagement) => engagement.status !== 'Completed').length
  const completedCount = engagements.filter((engagement) => engagement.status === 'Completed').length

  return (
    <>
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Your practice</p>
          <h1>Good morning, {firstName}</h1>
          <p>Here&apos;s who&apos;s working with you right now.</p>
        </div>
      </div>
      <div className="stat-grid">
        {[
          ['Active Clients', String(activeCount), activeCount ? 'Up to date' : 'None yet'],
          ['Completed', String(completedCount), completedCount ? 'Nice work' : 'None yet'],
          ['Rating', application!.rating.toFixed(1), `${application!.reviews_count} reviews`],
          ['Listing', application!.category, application!.location],
        ].map(([label, value, meta]) => (
          <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></div>
        ))}
      </div>
      <div className="dashboard-main-grid">
        <section className="dashboard-panel active-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Your clients</p><h2>Recent Clients</h2></div>
            <Link href="/partner/dashboard/clients" className="text-link">View All <ArrowRight size={14} /></Link>
          </div>
          {engagements.length === 0 ? (
            <div className="dashboard-empty">
              <p>No clients yet — you&apos;ll see them here once someone chooses you in Browse Providers.</p>
            </div>
          ) : (
            <div className="active-list">
              {engagements.slice(0, 4).map((engagement) => (
                <Link href={`/partner/dashboard/clients/${engagement.id}`} className="active-row" key={engagement.id}>
                  <span className="service-icon icon-blue"><UserIcon size={18} /></span>
                  <span className="active-name">
                    <strong>{engagement.profiles.full_name}</strong>
                    <small>{engagement.profiles.email}</small>
                  </span>
                  <StatusPill tone={toneForStatus[engagement.status]}>{engagement.status}</StatusPill>
                  <ChevronRight size={16} className="row-chevron" />
                </Link>
              ))}
            </div>
          )}
        </section>
        <section className="dashboard-panel upcoming-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Your listing</p><h2>How clients see you</h2></div>
          </div>
          <div className="tip-card">
            <Star size={16} />
            <span><strong>{application!.specialization}</strong><small>{application!.experience_years}+ years experience · {application!.location}</small></span>
          </div>
        </section>
      </div>
    </>
  )
}
