import { getApprovedProviders, getCurrentProfile } from '@/lib/supabase/queries'
import { ProvidersBrowse } from '@/components/providers-browse'
import { ExitPreview } from '@/components/exit-preview'
import { PublicNav } from '@/components/public-nav'
import type { ProviderCategory } from '@/lib/types'
import { problemTags, type ProblemTag } from '@/lib/problem-tags'

const validCategories: ProviderCategory[] = ['CA', 'Advocate', 'Company Secretary', 'Accountant']
const validTags: ProblemTag[] = problemTags.map((item) => item.tag)

// Public page — anyone can browse without an account. Choosing a provider
// still requires sign-in, enforced inside the chooseProvider Server Action.
export default async function ProvidersPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string; tag?: string }> }) {
  const [providers, profile, params] = await Promise.all([getApprovedProviders(), getCurrentProfile(), searchParams])
  const initialCategory = validCategories.find((category) => category === params.category) ?? 'All'
  const initialQuery = params.q ?? ''
  const initialTag = validTags.find((tag) => tag === params.tag)

  return <>
    {!profile && <PublicNav />}
    <ProvidersBrowse providers={providers} initialCategory={initialCategory} initialQuery={initialQuery} initialTag={initialTag} />
    {profile && <ExitPreview />}
  </>
}
