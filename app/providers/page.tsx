import { getApprovedProviders, getCurrentProfile } from '@/lib/supabase/queries'
import { ProvidersBrowse } from '@/components/providers-browse'
import { ExitPreview } from '@/components/exit-preview'
import { PublicNav } from '@/components/public-nav'
import type { ProviderCategory } from '@/lib/types'

const validCategories: ProviderCategory[] = ['CA', 'Advocate', 'Company Secretary', 'Accountant']

// Public page — anyone can browse without an account. Choosing a provider
// still requires sign-in, enforced inside the chooseProvider Server Action.
export default async function ProvidersPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [providers, profile, params] = await Promise.all([getApprovedProviders(), getCurrentProfile(), searchParams])
  const initialCategory = validCategories.find((category) => category === params.category) ?? 'All'

  return <>
    {!profile && <PublicNav />}
    <ProvidersBrowse providers={providers} initialCategory={initialCategory} />
    {profile && <ExitPreview />}
  </>
}
