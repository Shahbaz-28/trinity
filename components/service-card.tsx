import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/services-data'

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon
  return (
    <article className="service-card">
      <div className="service-icon"><Icon size={20} /></div>
      <div><h3>{service.name}</h3><p>{service.description}</p></div>
      <Link href="/explore" className="text-link">Explore <ArrowRight size={14} /></Link>
    </article>
  )
}
