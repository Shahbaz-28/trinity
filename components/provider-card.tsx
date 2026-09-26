import { Star, MapPin } from 'lucide-react'
import type { ProviderRow } from '@/lib/supabase/queries'

export function ProviderCard({ provider, onChoose }: { provider: ProviderRow; onChoose: () => void }) {
  return (
    <article className="provider-card">
      <div className="provider-top">
        <span className="provider-avatar">{provider.avatar_initial}</span>
        <span className="provider-category-badge">{provider.category}</span>
      </div>
      <h3>{provider.name}</h3>
      <p className="provider-spec">{provider.specialization}</p>
      <div className="provider-meta">
        <span><Star size={13} /> {provider.rating} <small>({provider.reviews_count})</small></span>
        <span><MapPin size={13} /> {provider.location}</span>
      </div>
      <p className="provider-exp">{provider.experience_years}+ years experience</p>
      <button className="button button-secondary provider-choose" onClick={onChoose}>Choose {provider.name.split(' ')[0]}</button>
    </article>
  )
}
