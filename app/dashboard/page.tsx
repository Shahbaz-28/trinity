import { getCurrentProfile, getMyActiveServices } from '@/lib/supabase/queries'
import { DashboardOverview } from '@/components/dashboard-overview'

export default async function DashboardOverviewPage() {
  const [profile, activeServices] = await Promise.all([getCurrentProfile(), getMyActiveServices()])
  // profile/activeServices existing is already guaranteed by the dashboard layout above this page.
  return <DashboardOverview profile={profile!} activeServices={activeServices} />
}
