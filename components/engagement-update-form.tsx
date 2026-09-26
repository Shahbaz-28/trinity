'use client'

import { useActionState } from 'react'
import { postEngagementUpdate } from '@/app/actions/engagement'

export function EngagementUpdateForm({ activeServiceId }: { activeServiceId: string }) {
  const action = postEngagementUpdate.bind(null, activeServiceId)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="profile-form">
      <label><span>Update title</span><input name="title" placeholder="Documents requested" required /></label>
      <label><span>Note (optional)</span><input name="note" placeholder="Please share your PAN and Aadhaar copies" /></label>
      {state?.error && <p className="signin-error">{state.error}</p>}
      <button type="submit" className="button button-primary" disabled={pending}>{pending ? 'Posting…' : 'Post update'}</button>
    </form>
  )
}
