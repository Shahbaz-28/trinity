'use client'

import { useActionState } from 'react'
import { updateMyListing } from '@/app/actions/provider'
import type { ProviderRow } from '@/lib/supabase/queries'

export function ListingForm({ application }: { application: ProviderRow }) {
  const [state, formAction, pending] = useActionState(updateMyListing, undefined)

  return (
    <form action={formAction} className="profile-form">
      <label><span>Name</span><input value={application.name} disabled title="Contact support to change your name." /></label>
      <label><span>Category</span><input value={application.category} disabled title="Contact support to change your category." /></label>
      <label><span>Specialization</span><input name="specialization" defaultValue={application.specialization} required /></label>
      <label><span>Years of experience</span><input name="experienceYears" type="number" min={0} defaultValue={application.experience_years} required /></label>
      <label><span>Location</span><input name="location" defaultValue={application.location} required /></label>
      {state && 'error' in state && <p className="signin-error">{state.error}</p>}
      <div className="profile-form-actions">
        <button type="submit" className="button button-primary" disabled={pending}>{pending ? 'Saving…' : 'Save changes'}</button>
        {state && 'success' in state && <span className="profile-saved">Saved</span>}
      </div>
    </form>
  )
}
