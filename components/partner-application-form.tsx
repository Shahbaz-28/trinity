'use client'

import { useActionState, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { submitApplication } from '@/app/actions/partner'
import type { ProviderCategory } from '@/lib/types'
import { problemTags } from '@/lib/problem-tags'

const categories: ProviderCategory[] = ['CA', 'Advocate', 'Company Secretary', 'Accountant']

const membershipLabel: Record<ProviderCategory, string> = {
  CA: 'ICAI membership number',
  Advocate: 'Bar Council enrollment number',
  'Company Secretary': 'ICSI membership number',
  Accountant: 'Professional ID (optional)',
}

const membershipPlaceholder: Record<ProviderCategory, string> = {
  CA: 'e.g. 214589',
  Advocate: 'e.g. MAH/1234/2015',
  'Company Secretary': 'e.g. ACS-12345',
  Accountant: 'Optional',
}

export function PartnerApplicationForm() {
  const [state, formAction, pending] = useActionState(submitApplication, undefined)
  const [category, setCategory] = useState<ProviderCategory>('CA')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]))
  }

  return (
    <main className="page-shell partner-page">
      <div className="container narrow-header">
        <p className="eyebrow">Apply as a professional</p>
        <h1>Tell us about your practice.</h1>
        <p>Submitting creates a real, pending application tied to your account — an admin checks your membership number before approving it.</p>
      </div>
      <div className="container">
        <div className="signin-card">
          <form action={formAction} className="profile-form">
            <label>
              <span>Category</span>
              <select name="category" value={category} onChange={(event) => setCategory(event.target.value as ProviderCategory)}>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label><span>Specialization</span><input name="specialization" placeholder="GST & Tax Filing" required /></label>
            <label><span>Years of experience</span><input name="experienceYears" type="number" min={0} placeholder="6" required /></label>
            <label><span>Location</span><input name="location" placeholder="Mumbai" required /></label>
            <label>
              <span>{membershipLabel[category]}</span>
              <input name="membershipNumber" placeholder={membershipPlaceholder[category]} required={category !== 'Accountant'} />
            </label>
            <label>
              <span>What kind of work do you handle? (select all that apply)</span>
              <div className="tag-checkbox-grid">
                {problemTags.map(({ tag, label }) => (
                  <label key={tag} className={selectedTags.includes(tag) ? 'tag-checkbox active' : 'tag-checkbox'}>
                    <input type="checkbox" name="tags" value={tag} checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} />
                    {label}
                  </label>
                ))}
              </div>
            </label>
            {state?.error && <p className="signin-error">{state.error}</p>}
            <button type="submit" className="button button-primary signin-submit" disabled={pending}>{pending ? 'Submitting…' : 'Submit Application'} <ArrowRight size={16} /></button>
          </form>
        </div>
      </div>
    </main>
  )
}
