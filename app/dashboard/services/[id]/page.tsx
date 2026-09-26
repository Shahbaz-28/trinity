import { notFound } from 'next/navigation'
import { StatusPill } from '@/components/shared'
import { EngagementTimeline } from '@/components/engagement-timeline'
import { DocumentsList } from '@/components/documents-list'
import { getEngagementForClient, getEngagementUpdates, getEngagementDocuments, type ActiveServiceWithProvider } from '@/lib/supabase/queries'

const toneForStatus: Record<ActiveServiceWithProvider['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export default async function ClientEngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const engagement = await getEngagementForClient(id)
  if (!engagement) notFound()

  const [updates, documents] = await Promise.all([getEngagementUpdates(id), getEngagementDocuments(id)])

  return (
    <>
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Engagement</p>
          <h1>{engagement.provider_profiles.name}</h1>
          <p>{engagement.provider_profiles.category} · {engagement.provider_profiles.specialization}</p>
        </div>
        <StatusPill tone={toneForStatus[engagement.status]}>{engagement.status}</StatusPill>
      </div>
      <div className="dashboard-main-grid">
        <section className="dashboard-panel active-panel">
          <div className="panel-heading"><div><p className="eyebrow">Progress</p><h2>Timeline</h2></div></div>
          <EngagementTimeline updates={updates} />
        </section>
        <section className="dashboard-panel upcoming-panel">
          <div className="panel-heading"><div><p className="eyebrow">Files</p><h2>Documents</h2></div></div>
          <DocumentsList documents={documents} />
        </section>
      </div>
    </>
  )
}
