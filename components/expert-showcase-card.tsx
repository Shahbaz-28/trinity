import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import type { ProviderRow } from '@/lib/supabase/queries'
import { VerifiedBadge } from './verified-badge'

export function ExpertShowcaseCard({ provider }: { provider: ProviderRow }) {
  return (
    <Link href="/providers" className="provider-card">
      <div className="provider-top">
        <span className="provider-avatar">{provider.avatar_initial}</span>
        <span className="provider-category-badge">{provider.category}</span>
      </div>
      <h3>{provider.name}</h3>
      <p className="provider-spec">{provider.specialization}</p>
      <VerifiedBadge membershipNumber={provider.membership_number} />
      <div className="provider-meta">
        <span><Star size={13} /> {provider.rating} <small>({provider.reviews_count})</small></span>
        <span><MapPin size={13} /> {provider.location}</span>
      </div>
    </Link>
  )
}
