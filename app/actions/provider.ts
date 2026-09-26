'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type EngagementStatus = 'In Progress' | 'Pending' | 'Completed'

export async function updateEngagementStatus(activeServiceId: string, status: EngagementStatus) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: myProvider } = await supabase.from('provider_profiles').select('id').eq('profile_id', user.id).maybeSingle()
  if (!myProvider) throw new Error('Not a professional.')

  const { error } = await supabase
    .from('active_services')
    .update({ status })
    .eq('id', activeServiceId)
    .eq('provider_profile_id', myProvider.id)

  if (error) throw error

  revalidatePath('/partner/dashboard')
  revalidatePath('/partner/dashboard/clients')
}

export type UpdateListingState = { error: string } | { success: true } | undefined

export async function updateMyListing(_prevState: UpdateListingState, formData: FormData): Promise<UpdateListingState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const specialization = String(formData.get('specialization') ?? '').trim()
  const location = String(formData.get('location') ?? '').trim()
  const experienceYears = Number(formData.get('experienceYears'))

  if (!specialization || !location || !Number.isFinite(experienceYears) || experienceYears < 0) {
    return { error: 'Please fill in every field with a valid value.' }
  }

  const { error } = await supabase
    .from('provider_profiles')
    .update({ specialization, location, experience_years: experienceYears })
    .eq('profile_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/partner/dashboard')
  revalidatePath('/partner/dashboard/listing')
  return { success: true }
}
