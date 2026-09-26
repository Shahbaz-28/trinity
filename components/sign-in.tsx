'use client'

import { useActionState, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { signIn, signUp } from '@/app/actions/auth'

type Mode = 'signin' | 'signup'
type Intent = 'client' | 'professional'

export function SignIn() {
  const [mode, setMode] = useState<Mode>('signin')
  const [intent, setIntent] = useState<Intent>('client')
  const [signInState, signInAction, signInPending] = useActionState(signIn, undefined)
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, undefined)

  const isSignIn = mode === 'signin'
  const isClient = intent === 'client'
  const state = isSignIn ? signInState : signUpState
  const pending = isSignIn ? signInPending : signUpPending
  const formAction = isSignIn ? signInAction : signUpAction

  return (
    <main className="page-shell signin-page">
      <div className="container signin-container">
        <div className="signin-card">
          <p className="eyebrow">Welcome to Trinity</p>
          <h1>{isSignIn ? 'Sign in to continue' : 'Create your account'}</h1>
          <p className="signin-sub">
            {isSignIn ? 'Sign in with the email and password you used to sign up.' : "A few details and you're in — this creates a real account."}
          </p>

          <div className="intent-toggle" role="tablist" aria-label="Continue as">
            <button type="button" role="tab" aria-selected={isClient} className={isClient ? 'intent-option active' : 'intent-option'} onClick={() => setIntent('client')}>
              I need a service
            </button>
            <button type="button" role="tab" aria-selected={!isClient} className={!isClient ? 'intent-option active' : 'intent-option'} onClick={() => setIntent('professional')}>
              I&apos;m a professional
            </button>
          </div>

          <form action={formAction} className="signin-form">
            <input type="hidden" name="intent" value={intent} />
            {!isSignIn && (
              <label>
                <span>Full name</span>
                <input name="fullName" placeholder="Justin John" required />
              </label>
            )}
            <label>
              <span>Email</span>
              <input name="email" type="email" placeholder="justin@acme.in" required />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" placeholder="At least 6 characters" minLength={6} required />
            </label>
            {!isSignIn && (
              <label className="signin-consent">
                <input name="consent" type="checkbox" required />
                <span>I agree to Trinity&apos;s privacy notice for handling my data.</span>
              </label>
            )}
            {state?.error && <p className="signin-error">{state.error}</p>}
            <button type="submit" className="button button-primary signin-submit" disabled={pending}>
              {pending ? 'Please wait…' : isSignIn ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>
          <button type="button" className="signin-toggle" onClick={() => setMode(isSignIn ? 'signup' : 'signin')}>
            {isSignIn ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
          <p className="signin-note"><ShieldCheck size={14} /> Your session is managed securely by Supabase Auth.</p>
        </div>
      </div>
    </main>
  )
}
