'use client'

import { useActionState } from 'react'
import { ArrowRight } from 'lucide-react'
import { submitApplication } from '@/app/actions/partner'
import type { ProviderCategory } from '@/lib/types'

const categories: ProviderCategory[] = ['CA', 'Advocate', 'Company Secretary', 'Accountant']

export function PartnerApplicationForm() {
  const [state, formAction, pending] = useActionState(submitApplication, undefined)

  return (
    <main className="page-shell partner-page">
      <div className="container narrow-header">
        <p className="eyebrow">Apply as a professional</p>
        <h1>Tell us about your practice.</h1>
        <p>Submitting creates a real, pending application tied to your account — an admin reviews it before you go live.</p>
      </div>
      <div className="container">
        <div className="signin-card">
          <form action={formAction} className="profile-form">
            <label>
              <span>Category</span>
              <select name="category" defaultValue="CA">
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label><span>Specialization</span><input name="specialization" placeholder="GST & Tax Filing" required /></label>
            <label><span>Years of experience</span><input name="experienceYears" type="number" min={0} placeholder="6" required /></label>
            <label><span>Location</span><input name="location" placeholder="Mumbai" required /></label>
            {state?.error && <p className="signin-error">{state.error}</p>}
            <button type="submit" className="button button-primary signin-submit" disabled={pending}>{pending ? 'Submitting…' : 'Submit Application'} <ArrowRight size={16} /></button>
          </form>
        </div>
      </div>
    </main>
  )
}
