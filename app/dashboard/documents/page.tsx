import { Download, FileText } from 'lucide-react'
import { getMyActiveServices } from '@/lib/supabase/queries'

export default async function DocumentsPage() {
  const activeServices = await getMyActiveServices()

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">Paperwork</p><h1>Documents</h1><p>Files shared by your service providers.</p></div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        {activeServices.length === 0 ? (
          <div className="dashboard-empty"><p>No documents yet — they&apos;ll show up here once a provider shares something.</p></div>
        ) : (
          <div className="documents-list">
            {activeServices.map((service) => (
              <div className="document-row" key={service.id}>
                <span className="document-icon"><FileText size={18} /></span>
                <span className="document-info">
                  <strong>{service.provider_profiles.category} Engagement Letter.pdf</strong>
                  <small>Shared by {service.provider_profiles.name}</small>
                </span>
                <button className="icon-button" aria-label="Download"><Download size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
