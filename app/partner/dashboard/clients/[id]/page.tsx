import { notFound } from 'next/navigation'
import { Check, RotateCcw, User as UserIcon } from 'lucide-react'
import { StatusPill } from '@/components/shared'
import { EngagementTimeline } from '@/components/engagement-timeline'
import { DocumentsList } from '@/components/documents-list'
import { EngagementUpdateForm } from '@/components/engagement-update-form'
import { DocumentUploadForm } from '@/components/document-upload-form'
import { getEngagementForProvider, getEngagementUpdates, getEngagementDocuments, type ActiveServiceWithClient } from '@/lib/supabase/queries'
import { updateEngagementStatus } from '@/app/actions/provider'

const toneForStatus: Record<ActiveServiceWithClient['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export default async function ProviderEngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const engagement = await getEngagementForProvider(id)
  if (!engagement) notFound()

  const [updates, documents] = await Promise.all([getEngagementUpdates(id), getEngagementDocuments(id)])

  return (
    <>
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Client</p>
          <h1><UserIcon size={26} style={{ verticalAlign: '-4px', marginRight: 8 }} />{engagement.profiles.full_name}</h1>
          <p>{engagement.profiles.email}</p>
        </div>
        <StatusPill tone={toneForStatus[engagement.status]}>{engagement.status}</StatusPill>
      </div>

      <div className="admin-actions" style={{ marginTop: 20 }}>
        {engagement.status !== 'In Progress' && (
          <form action={updateEngagementStatus.bind(null, engagement.id, 'In Progress')}>
            <button type="submit" className="button button-secondary">Mark In Progress</button>
          </form>
        )}
        {engagement.status !== 'Completed' && (
          <form action={updateEngagementStatus.bind(null, engagement.id, 'Completed')}>
            <button type="submit" className="button button-primary"><Check size={15} /> Mark Completed</button>
          </form>
        )}
        {engagement.status !== 'Pending' && (
          <form action={updateEngagementStatus.bind(null, engagement.id, 'Pending')}>
            <button type="submit" className="button button-secondary"><RotateCcw size={15} /> Mark Pending</button>
          </form>
        )}
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel active-panel">
          <div className="panel-heading"><div><p className="eyebrow">Progress</p><h2>Timeline</h2></div></div>
          <EngagementUpdateForm activeServiceId={id} />
          <div style={{ marginTop: 22 }}>
            <EngagementTimeline updates={updates} />
          </div>
        </section>
        <section className="dashboard-panel upcoming-panel">
          <div className="panel-heading"><div><p className="eyebrow">Files</p><h2>Documents</h2></div></div>
          <DocumentUploadForm activeServiceId={id} />
          <div style={{ marginTop: 22 }}>
            <DocumentsList documents={documents} />
          </div>
        </section>
      </div>
    </>
  )
}
