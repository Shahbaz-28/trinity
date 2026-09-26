import { redirect } from 'next/navigation'
import { Clock, LogOut, RotateCcw } from 'lucide-react'
import { getMyProviderApplication } from '@/lib/supabase/queries'
import { withdrawApplication } from '@/app/actions/partner'
import { signOut } from '@/app/actions/auth'
import { PartnerApplicationForm } from '@/components/partner-application-form'

// Being signed in is already guaranteed by proxy.ts before this renders.
export default async function PartnerApplyPage() {
  const application = await getMyProviderApplication()

  if (application?.status === 'approved') {
    redirect('/partner/dashboard')
  }

  if (application?.status === 'pending') {
    return (
      <main className="page-shell partner-page">
        <div className="container narrow-header status-header">
          <span className="status-icon status-icon-pending"><Clock size={22} /></span>
          <p className="eyebrow">Application submitted</p>
          <h1>Your application is under review.</h1>
          <p>We&apos;re reviewing your profile as a {application.category}. An admin needs to approve it at <code>/partner/admin</code> before it goes live.</p>
        </div>
        <div className="container">
          <div className="signin-card application-summary">
            <dl>
              <div><dt>Name</dt><dd>{application.name}</dd></div>
              <div><dt>Category</dt><dd>{application.category}</dd></div>
              <div><dt>Specialization</dt><dd>{application.specialization}</dd></div>
              <div><dt>Experience</dt><dd>{application.experience_years}+ years</dd></div>
              <div><dt>Location</dt><dd>{application.location}</dd></div>
            </dl>
            <div className="profile-form-actions">
              <form action={withdrawApplication}>
                <button type="submit" className="button button-secondary"><RotateCcw size={15} /> Withdraw and start over</button>
              </form>
              <form action={signOut}>
                <button type="submit" className="button button-secondary"><LogOut size={15} /> Log out</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (application?.status === 'rejected') {
    return (
      <main className="page-shell partner-page">
        <div className="container narrow-header status-header">
          <p className="eyebrow">Application reviewed</p>
          <h1>Your application wasn&apos;t approved.</h1>
          <p>You can withdraw and submit a new application with updated details.</p>
        </div>
        <div className="container">
          <div className="signin-card application-summary">
            <div className="profile-form-actions">
              <form action={withdrawApplication}>
                <button type="submit" className="button button-secondary"><RotateCcw size={15} /> Withdraw and start over</button>
              </form>
              <form action={signOut}>
                <button type="submit" className="button button-secondary"><LogOut size={15} /> Log out</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return <PartnerApplicationForm />
}
