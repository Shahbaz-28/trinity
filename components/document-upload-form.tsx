'use client'

import { useActionState } from 'react'
import { uploadDocument } from '@/app/actions/engagement'

export function DocumentUploadForm({ activeServiceId }: { activeServiceId: string }) {
  const action = uploadDocument.bind(null, activeServiceId)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="profile-form">
      <label><span>Document title</span><input name="title" placeholder="Engagement Letter" required /></label>
      <label><span>File</span><input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" required /></label>
      {state?.error && <p className="signin-error">{state.error}</p>}
      <button type="submit" className="button button-primary" disabled={pending}>{pending ? 'Uploading…' : 'Upload document'}</button>
    </form>
  )
}
