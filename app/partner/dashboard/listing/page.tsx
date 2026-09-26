import { getMyProviderApplication } from '@/lib/supabase/queries'
import { ListingForm } from '@/components/listing-form'

export default async function ProviderListingPage() {
  const application = await getMyProviderApplication()

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">How clients find you</p><h1>My Listing</h1><p>Keep your public profile accurate.</p></div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        <ListingForm application={application!} />
      </section>
    </>
  )
}
