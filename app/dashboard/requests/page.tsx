import { StatusPill } from '@/components/shared'
import { getMyActiveServices, type ActiveServiceWithProvider } from '@/lib/supabase/queries'

const toneForStatus: Record<ActiveServiceWithProvider['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export default async function RequestsPage() {
  const activeServices = await getMyActiveServices()

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">Track progress</p><h1>Requests</h1><p>Every request you&apos;ve raised and its current status.</p></div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        {activeServices.length === 0 ? (
          <div className="dashboard-empty"><p>No requests yet — choose a provider to get started.</p></div>
        ) : (
          <div className="requests-table">
            <div className="requests-row requests-head"><span>Request</span><span>Provider</span><span>Raised on</span><span>Status</span></div>
            {activeServices.map((service) => (
              <div className="requests-row" key={service.id}>
                <span>{service.provider_profiles.category} Engagement</span>
                <span>{service.provider_profiles.name}</span>
                <span>{new Date(service.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <StatusPill tone={toneForStatus[service.status]}>{service.status}</StatusPill>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
