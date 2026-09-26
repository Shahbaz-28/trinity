import { getApprovedProviders } from '@/lib/supabase/queries'
import { ProvidersBrowse } from '@/components/providers-browse'
import { ExitPreview } from '@/components/exit-preview'

// Being signed in is already guaranteed by proxy.ts before this renders.
export default async function ProvidersPage() {
  const providers = await getApprovedProviders()

  return <>
    <ProvidersBrowse providers={providers} />
    <ExitPreview />
  </>
}
