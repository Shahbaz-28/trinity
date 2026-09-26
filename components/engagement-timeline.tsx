import type { EngagementUpdateRow } from '@/lib/supabase/queries'

export function EngagementTimeline({ updates }: { updates: EngagementUpdateRow[] }) {
  if (updates.length === 0) {
    return <div className="dashboard-empty"><p>No updates posted yet.</p></div>
  }

  return (
    <div className="timeline">
      {updates.map((update) => (
        <div className="timeline-item" key={update.id}>
          <span className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-heading">
              <strong>{update.title}</strong>
              <small>
                {new Date(update.created_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </small>
            </div>
            {update.note && <p>{update.note}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
