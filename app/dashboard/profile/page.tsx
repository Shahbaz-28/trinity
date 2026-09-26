import { getCurrentProfile } from '@/lib/supabase/queries'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">Your account</p><h1>Profile</h1><p>Keep your details up to date.</p></div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        <ProfileForm profile={profile!} />
      </section>
    </>
  )
}
