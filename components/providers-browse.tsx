'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, X } from 'lucide-react'
import type { ProviderCategory } from '@/lib/types'
import type { ProviderRow } from '@/lib/supabase/queries'
import { problemTagLabels, type ProblemTag } from '@/lib/problem-tags'
import { chooseProvider } from '@/app/actions/services'
import { ProviderCard } from './provider-card'
import { ProviderConfirm } from './provider-confirm'

const categories: (ProviderCategory | 'All')[] = ['All', 'CA', 'Advocate', 'Company Secretary', 'Accountant']

export function ProvidersBrowse({
  providers,
  initialCategory = 'All',
  initialQuery = '',
  initialTag,
}: {
  providers: ProviderRow[]
  initialCategory?: ProviderCategory | 'All'
  initialQuery?: string
  initialTag?: ProblemTag
}) {
  const [category, setCategory] = useState<ProviderCategory | 'All'>(initialCategory)
  const [query, setQuery] = useState(initialQuery)
  const [tag, setTag] = useState<ProblemTag | undefined>(initialTag)
  const [picked, setPicked] = useState<ProviderRow | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(
    () =>
      providers.filter(
        (provider) =>
          (category === 'All' || provider.category === category) &&
          (!tag || provider.tags.includes(tag)) &&
          (provider.name.toLowerCase().includes(query.toLowerCase()) ||
            provider.specialization.toLowerCase().includes(query.toLowerCase())),
      ),
    [providers, category, tag, query],
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
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link>
        <p className="eyebrow">Choose your expert</p>
        <h1>
          Find your verified<br />
          <span className="hero-underline-wrap">
            <em>expert.</em>
            <svg className="hero-heading-squiggle" viewBox="0 0 160 14" fill="none" aria-hidden="true">
              <path d="M2 9C24 2 40 2 56 7C72 12 88 12 104 6C120 1 136 1 158 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p>Pick a verified CA, Advocate, Company Secretary or Accountant to handle your work — you can change this anytime.</p>
        {tag && (
          <span className="tag-filter-chip">
            Showing experts for: <strong>{problemTagLabels[tag]}</strong>
            <button type="button" onClick={() => setTag(undefined)} aria-label="Clear filter"><X size={13} /></button>
          </span>
        )}
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
