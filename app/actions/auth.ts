'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthFormState = { error: string } | undefined

// Where to land right after sign-in/sign-up — driven by the explicit
// Client / Professional choice on the sign-in form, not guessed from
// account history. "Professional" always goes through /partner/apply,
// which itself shows the application form, the pending/rejected status,
// or redirects on to /partner/dashboard once approved.
function redirectByIntent(formData: FormData): never {
  const intent = formData.get('intent')
  redirect(intent === 'professional' ? '/partner/apply' : '/dashboard')
}

export async function signUp(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const consent = formData.get('consent') === 'on'

  if (!fullName || !email || !password) {
    return { error: 'Please fill in every field.' }
  }
  if (!consent) {
    return { error: 'Please agree to the privacy notice to continue.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // The DB trigger already created the profiles row from full_name/email;
    // record consent separately since that's not part of auth signup itself.
    await supabase.from('profiles').update({ consent_given_at: new Date().toISOString() }).eq('id', data.user.id)
  }

  redirectByIntent(formData)
}

export async function signIn(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Please fill in every field.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirectByIntent(formData)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
