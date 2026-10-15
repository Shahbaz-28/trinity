'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProviderCategory, ProviderStatus } from '@/lib/types'
import { problemTags, type ProblemTag } from '@/lib/problem-tags'

const validTagSlugs = new Set<string>(problemTags.map((item) => item.tag))

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
  const membershipNumber = String(formData.get('membershipNumber') ?? '').trim()
  const tags = formData.getAll('tags').map(String).filter((tag): tag is ProblemTag => validTagSlugs.has(tag))

  if (!specialization || !location || !Number.isFinite(experienceYears) || experienceYears < 0) {
    return { error: 'Please fill in every field with a valid value.' }
  }
  if (category !== 'Accountant' && !membershipNumber) {
    return { error: 'Please provide your professional membership/enrollment number.' }
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
    membership_number: membershipNumber || null,
    avatar_initial: profile.full_name[0]?.toUpperCase() ?? 'P',
    status: 'pending',
    tags,
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
