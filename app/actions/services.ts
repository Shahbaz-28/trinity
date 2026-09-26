'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function chooseProvider(providerProfileId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { error } = await supabase.from('active_services').insert({
    client_id: user.id,
    provider_profile_id: providerProfileId,
    status: 'In Progress',
  })

  if (error) throw error

  redirect('/dashboard')
}

export type ProfileFormState = { error: string } | { success: true } | undefined

export async function updateProfileName(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const fullName = String(formData.get('fullName') ?? '').trim()
  if (!fullName) {
    return { error: 'Name cannot be empty.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}
