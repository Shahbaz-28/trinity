import { Check, RotateCcw, ShieldAlert, X } from 'lucide-react'
import { getAllProviderApplications } from '@/lib/supabase/queries'
import { setApplicationStatus } from '@/app/actions/partner'

export default async function PartnerAdminPage() {
  const applications = await getAllProviderApplications()

  return (
    <>
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Professional applications</h1>
          <p><ShieldAlert size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />Approving or rejecting here writes directly to the database and immediately changes what clients see in Browse Providers.</p>
        </div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        {applications.length === 0 ? (
          <div className="dashboard-empty"><p>No applications yet.</p></div>
        ) : (
          <div className="admin-list">
            {applications.map((application) => (
              <div className="admin-row" key={application.id}>
                <span className="provider-avatar">{application.avatar_initial}</span>
                <span className="admin-info">
                  <strong>{application.name}</strong>
                  <small>{application.category} · {application.specialization} · {application.experience_years}+ yrs · {application.location}</small>
                </span>
                <span className={application.status === 'approved' ? 'status-pill status-green' : application.status === 'rejected' ? 'status-pill status-muted' : 'status-pill status-gold'}>
                  <span className="status-dot" />
                  {application.status === 'approved' ? 'Approved' : application.status === 'rejected' ? 'Rejected' : 'Pending'}
                </span>
                <div className="admin-actions">
                  {application.status !== 'approved' && (
                    <form action={setApplicationStatus.bind(null, application.id, 'approved')}>
                      <button type="submit" className="button button-primary"><Check size={15} /> Approve</button>
                    </form>
                  )}
                  {application.status !== 'rejected' && (
                    <form action={setApplicationStatus.bind(null, application.id, 'rejected')}>
                      <button type="submit" className="button button-secondary"><X size={15} /> Reject</button>
                    </form>
                  )}
                  {application.status !== 'pending' && (
                    <form action={setApplicationStatus.bind(null, application.id, 'pending')}>
                      <button type="submit" className="button button-secondary"><RotateCcw size={15} /> Reset</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
