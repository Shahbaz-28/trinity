import Link from 'next/link'
import { ChevronRight, User as UserIcon } from 'lucide-react'
import { StatusPill } from '@/components/shared'
import { getMyClientEngagements } from '@/lib/supabase/queries'
import type { ActiveServiceWithClient } from '@/lib/supabase/queries'

const toneForStatus: Record<ActiveServiceWithClient['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export default async function ProviderClientsPage() {
  const engagements = await getMyClientEngagements()

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">Your work</p><h1>Clients</h1><p>Everyone who has chosen you, and where things stand.</p></div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        {engagements.length === 0 ? (
          <div className="dashboard-empty"><p>No clients yet — you&apos;ll see them here once someone chooses you in Browse Providers.</p></div>
        ) : (
          <div className="active-list">
            {engagements.map((engagement) => (
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
    </>
  )
}
