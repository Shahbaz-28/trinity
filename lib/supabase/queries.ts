import 'server-only'
import { createClient } from './server'
import type { Database } from './database.types'

export type ProviderRow = Database['public']['Tables']['provider_profiles']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ActiveServiceWithProvider = Database['public']['Tables']['active_services']['Row'] & {
  provider_profiles: ProviderRow
}
export type ActiveServiceWithClient = Database['public']['Tables']['active_services']['Row'] & {
  profiles: Pick<ProfileRow, 'full_name' | 'email'>
}
export type EngagementUpdateRow = Database['public']['Tables']['engagement_updates']['Row']
export type DocumentWithUrl = Database['public']['Tables']['documents']['Row'] & { downloadUrl: string | null }

export async function getApprovedProviders(): Promise<ProviderRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error) throw error
  return data
}

export async function getMyActiveServices(): Promise<ActiveServiceWithProvider[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('active_services')
    .select('*, provider_profiles ( * )')
    .eq('client_id', user.id)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data as unknown as ActiveServiceWithProvider[]
}

export async function getMyProviderApplication(): Promise<ProviderRow | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from('provider_profiles').select('*').eq('profile_id', user.id).maybeSingle()
  if (error) throw error
  return data
}

export async function getAllProviderApplications(): Promise<ProviderRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('provider_profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getMyClientEngagements(): Promise<ActiveServiceWithClient[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: myProvider } = await supabase.from('provider_profiles').select('id').eq('profile_id', user.id).maybeSingle()
  if (!myProvider) return []

  const { data, error } = await supabase
    .from('active_services')
    .select('*, profiles ( full_name, email )')
    .eq('provider_profile_id', myProvider.id)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data as unknown as ActiveServiceWithClient[]
}

export async function getEngagementForClient(activeServiceId: string): Promise<ActiveServiceWithProvider | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('active_services')
    .select('*, provider_profiles ( * )')
    .eq('id', activeServiceId)
    .eq('client_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data as unknown as ActiveServiceWithProvider | null
}

export async function getEngagementForProvider(activeServiceId: string): Promise<ActiveServiceWithClient | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: myProvider } = await supabase.from('provider_profiles').select('id').eq('profile_id', user.id).maybeSingle()
  if (!myProvider) return null

  const { data, error } = await supabase
    .from('active_services')
    .select('*, profiles ( full_name, email )')
    .eq('id', activeServiceId)
    .eq('provider_profile_id', myProvider.id)
    .maybeSingle()

  if (error) throw error
  return data as unknown as ActiveServiceWithClient | null
}

export async function getEngagementUpdates(activeServiceId: string): Promise<EngagementUpdateRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('engagement_updates')
    .select('*')
    .eq('active_service_id', activeServiceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getEngagementDocuments(activeServiceId: string): Promise<DocumentWithUrl[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('active_service_id', activeServiceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (data.length === 0) return []

  const withUrls = await Promise.all(
    data.map(async (doc) => {
      if (!doc.storage_path) return { ...doc, downloadUrl: null }
      const { data: signed } = await supabase.storage.from('documents').createSignedUrl(doc.storage_path, 60 * 10)
      return { ...doc, downloadUrl: signed?.signedUrl ?? null }
    }),
  )
  return withUrls
}
