'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type EngagementUpdateFormState = { error: string } | undefined

export async function postEngagementUpdate(
  activeServiceId: string,
  _prevState: EngagementUpdateFormState,
  formData: FormData,
): Promise<EngagementUpdateFormState> {
  const title = String(formData.get('title') ?? '').trim()
  const note = String(formData.get('note') ?? '').trim()

  if (!title) {
    return { error: 'Give the update a short title.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { error } = await supabase.from('engagement_updates').insert({
    active_service_id: activeServiceId,
    title,
    note: note || null,
    created_by: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath(`/partner/dashboard/clients/${activeServiceId}`)
  revalidatePath(`/dashboard/services/${activeServiceId}`)
  return undefined
}

export type UploadDocumentFormState = { error: string } | undefined

export async function uploadDocument(
  activeServiceId: string,
  _prevState: UploadDocumentFormState,
  formData: FormData,
): Promise<UploadDocumentFormState> {
  const file = formData.get('file')
  const title = String(formData.get('title') ?? '').trim()

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Choose a file to upload.' }
  }
  if (!title) {
    return { error: 'Give the document a title.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const path = `${activeServiceId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
  if (uploadError) return { error: uploadError.message }

  const { error: insertError } = await supabase.from('documents').insert({
    active_service_id: activeServiceId,
    title,
    storage_path: path,
    uploaded_by: user.id,
  })
  if (insertError) return { error: insertError.message }

  revalidatePath(`/partner/dashboard/clients/${activeServiceId}`)
  revalidatePath(`/dashboard/services/${activeServiceId}`)
  return undefined
}
