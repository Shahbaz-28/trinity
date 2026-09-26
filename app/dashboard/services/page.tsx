import Link from 'next/link'
import { ArrowRight, ChevronRight, Landmark } from 'lucide-react'
import { StatusPill } from '@/components/shared'
import { getMyActiveServices, type ActiveServiceWithProvider } from '@/lib/supabase/queries'

const toneForStatus: Record<ActiveServiceWithProvider['status'], 'blue' | 'green' | 'gold'> = {
  'In Progress': 'blue',
  Completed: 'green',
  Pending: 'gold',
}

export default async function ServicesPage() {
  const activeServices = await getMyActiveServices()

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">Your work</p><h1>Services</h1><p>Everyone currently working on your business.</p></div>
        <Link href="/providers" className="button button-primary">Browse More <ArrowRight size={15} /></Link>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        {activeServices.length === 0 ? (
          <div className="dashboard-empty">
            <p>You haven&apos;t chosen a service provider yet.</p>
            <Link href="/providers" className="button button-primary">Browse Providers <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <div className="active-list">
            {activeServices.map((service) => (
              <Link href={`/dashboard/services/${service.id}`} className="active-row" key={service.id}>
                <span className="service-icon icon-blue"><Landmark size={18} /></span>
                <span className="active-name">
                  <strong>{service.provider_profiles.name}</strong>
                  <small>{service.provider_profiles.category} · {service.provider_profiles.specialization}</small>
                </span>
                <StatusPill tone={toneForStatus[service.status]}>{service.status}</StatusPill>
                <ChevronRight size={16} className="row-chevron" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
