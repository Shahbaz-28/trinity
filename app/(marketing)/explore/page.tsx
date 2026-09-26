'use client'

import { useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import { services, serviceCategories } from '@/lib/services-data'
import { ServiceCard } from '@/components/service-card'

export default function ExplorePage() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => services.filter((service) => (category === 'All' || service.category === category) && service.name.toLowerCase().includes(query.toLowerCase())),
    [category, query],
  )

  return (
    <main className="page-shell">
      <div className="container narrow-header"><p className="eyebrow">Services directory</p><h1>Explore Services</h1><p>Whatever your business needs, start here.</p></div>
      <div className="container explore-controls">
        <div className="search-box"><Search size={18} /><input aria-label="Search services" placeholder="Search services..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <div className="filters"><Filter size={15} />{serviceCategories.map((item) => <button key={item} className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      <div className="container service-grid explore-grid">{filtered.map((service) => <ServiceCard key={service.name} service={service} />)}</div>
      {filtered.length === 0 && <div className="container empty-state">No services match your search.</div>}
    </main>
  )
}
