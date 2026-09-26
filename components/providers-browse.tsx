'use client'

import { useMemo, useState, useTransition } from 'react'
import { Search, Filter } from 'lucide-react'
import type { ProviderCategory } from '@/lib/types'
import type { ProviderRow } from '@/lib/supabase/queries'
import { chooseProvider } from '@/app/actions/services'
import { ProviderCard } from './provider-card'
import { ProviderConfirm } from './provider-confirm'

const categories: (ProviderCategory | 'All')[] = ['All', 'CA', 'Advocate', 'Company Secretary', 'Accountant']

export function ProvidersBrowse({ providers }: { providers: ProviderRow[] }) {
  const [category, setCategory] = useState<ProviderCategory | 'All'>('All')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<ProviderRow | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(
    () =>
      providers.filter(
        (provider) =>
          (category === 'All' || provider.category === category) &&
          (provider.name.toLowerCase().includes(query.toLowerCase()) ||
            provider.specialization.toLowerCase().includes(query.toLowerCase())),
      ),
    [providers, category, query],
  )

  const confirm = () => {
    if (!picked) return
    startTransition(() => {
      chooseProvider(picked.id)
    })
  }

  return (
    <main className="page-shell">
      <div className="container narrow-header">
        <p className="eyebrow">Choose your expert</p>
        <h1>Find a CA, Advocate or Compliance Expert</h1>
        <p>Pick a verified professional to handle your work — you can change this anytime.</p>
      </div>
      <div className="container explore-controls">
        <div className="search-box">
          <Search size={18} />
          <input aria-label="Search providers" placeholder="Search by name or specialization..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="filters">
          <Filter size={15} />
          {categories.map((item) => (
            <button key={item} className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="container provider-grid">
        {filtered.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} onChoose={() => setPicked(provider)} />
        ))}
      </div>
      {filtered.length === 0 && <div className="container empty-state">No providers match your search.</div>}
      {picked && <ProviderConfirm provider={picked} onCancel={() => setPicked(null)} onConfirm={confirm} pending={pending} />}
    </main>
  )
}
