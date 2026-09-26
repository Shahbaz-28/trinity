'use client'

import { useActionState } from 'react'
import { updateProfileName } from '@/app/actions/services'
import type { ProfileRow } from '@/lib/supabase/queries'

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, formAction, pending] = useActionState(updateProfileName, undefined)

  return (
    <form action={formAction} className="profile-form">
      <label>
        <span>Full name</span>
        <input name="fullName" defaultValue={profile.full_name} required />
      </label>
      <label>
        <span>Email</span>
        <input value={profile.email} disabled title="Email is tied to your login and can't be changed here yet." />
      </label>
      {state && 'error' in state && <p className="signin-error">{state.error}</p>}
      <div className="profile-form-actions">
        <button type="submit" className="button button-primary" disabled={pending}>{pending ? 'Saving…' : 'Save changes'}</button>
        {state && 'success' in state && <span className="profile-saved">Saved</span>}
      </div>
    </form>
  )
}
