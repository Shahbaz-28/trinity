'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProviderCategory, ProviderStatus } from '@/lib/types'

export type ApplyFormState = { error: string } | undefined

export async function submitApplication(_prevState: ApplyFormState, formData: FormData): Promise<ApplyFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const category = String(formData.get('category') ?? '') as ProviderCategory
  const specialization = String(formData.get('specialization') ?? '').trim()
  const experienceYears = Number(formData.get('experienceYears'))
  const location = String(formData.get('location') ?? '').trim()

  if (!specialization || !location || !Number.isFinite(experienceYears) || experienceYears < 0) {
    return { error: 'Please fill in every field with a valid value.' }
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single()
  if (profileError || !profile) {
    return { error: 'Could not find your profile. Try signing in again.' }
  }

  const { error } = await supabase.from('provider_profiles').insert({
    profile_id: user.id,
    name: profile.full_name,
    email: profile.email,
    category,
    specialization,
    experience_years: experienceYears,
    location,
    avatar_initial: profile.full_name[0]?.toUpperCase() ?? 'P',
    status: 'pending',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partner/apply')
  redirect('/partner/apply')
}

export async function withdrawApplication() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { error } = await supabase.from('provider_profiles').delete().eq('profile_id', user.id)
  if (error) throw error

  revalidatePath('/partner/apply')
  redirect('/partner/apply')
}

export async function setApplicationStatus(id: string, status: ProviderStatus) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('Not authorized.')
  }

  const { error } = await supabase
    .from('provider_profiles')
    .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/partner/admin')
}
