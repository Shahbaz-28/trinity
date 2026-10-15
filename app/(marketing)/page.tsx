import Link from 'next/link'
import { ArrowRight, Activity, BarChart3, FileText, ShieldCheck, Users } from 'lucide-react'
import { getApprovedProviders, type ProviderRow } from '@/lib/supabase/queries'
import { GetStartedButton } from '@/components/get-started-button'
import { ExpertsCounter } from '@/components/experts-counter'
import { DashboardPreview } from '@/components/dashboard-preview'
import { ExpertShowcaseCard } from '@/components/expert-showcase-card'
import { ProblemPicker } from '@/components/problem-picker'

// The most-reviewed provider from each distinct category — ordered by
// reviews_count first (not rating) because every new listing defaults to
// rating = 5.0 with zero reviews, which would otherwise let brand-new,
// unproven accounts outrank professionals with hundreds of real reviews.
function pickFeaturedPerCategory(providers: ProviderRow[], limit = 4): ProviderRow[] {
  const reviewed = [...providers]
    .filter((provider) => provider.reviews_count > 0)
    .sort((a, b) => b.reviews_count - a.reviews_count || b.rating - a.rating)

  const seenCategories = new Set<string>()
  const featured: ProviderRow[] = []
  for (const provider of reviewed) {
    if (seenCategories.has(provider.category)) continue
    seenCategories.add(provider.category)
    featured.push(provider)
    if (featured.length >= limit) break
  }
  return featured
}

const whyTrinity: { icon: typeof ShieldCheck; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Verified, not just claimed',
    text: 'Every professional’s registration number — ICAI, Bar Council, ICSI — is checked and shown on their profile, not a self-reported badge.',
  },
  {
    icon: Activity,
    title: 'Real progress tracking',
    text: 'A live timeline and document hub for every engagement, so you always know exactly where things stand — not a one-time promise.',
  },
  {
    icon: Users,
    title: 'Built for founders, not enterprises',
    text: 'Designed around the pace and budget of early-stage founders and small businesses, not big-company retainers.',
  },
]

export default async function HomePage() {
  const providers = await getApprovedProviders()
  const expertsCount = providers.length
  const featured = pickFeaturedPerCategory(providers)

  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy">
        <div className="kicker"><span />Business support, without the complexity</div>
        <h1>
          Your business work.<br />
          <span className="hero-underline-wrap">
            <em>Handled.</em>
            <svg className="hero-heading-squiggle" viewBox="0 0 160 14" fill="none" aria-hidden="true">
              <path d="M2 9C24 2 40 2 56 7C72 12 88 12 104 6C120 1 136 1 158 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="hero-text">From GST and accounting to registrations, compliance and ongoing business support — Trinity helps you get important work done without the usual complexity.</p>
        <div className="hero-actions">
          <GetStartedButton />
          <Link href="/providers" className="button button-secondary">Find an Expert</Link>
        </div>
        <ExpertsCounter target={expertsCount} />
        <p className="trust-line"><span className="hero-info-icon icon-tone-gold"><ShieldCheck size={15} /></span>Built for founders, small businesses and growing teams.</p>
      </div>
      <div className="hero-visual">
        <div className="hero-visual-blob" aria-hidden="true" />
        <div className="hero-visual-dots top-right" aria-hidden="true" />
        <div className="hero-visual-dots bottom-right" aria-hidden="true" />
        <div className="hero-float-card chart" aria-hidden="true"><BarChart3 size={20} /></div>
        <div className="hero-float-card doc" aria-hidden="true"><FileText size={20} /></div>
        <DashboardPreview />
      </div>
    </div></section>

    <section className="section section-tight-top"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Tell us what's going on</p><h2>What do you need help with?</h2></div><p>Pick what matches your situation — we'll show you the right experts.</p></div>
      <ProblemPicker />
    </div></section>

    <section className="section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Why Trinity</p><h2>Not just a directory.</h2></div><p>Built to actually solve the trust problem, not just list names.</p></div>
      <div className="service-grid">
        {whyTrinity.map(({ icon: Icon, title, text }) => (
          <div className="service-card" key={title}>
            <span className="service-icon icon-blue"><Icon size={18} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div></section>

    {featured.length > 0 && (
      <section className="section services-section"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">Real professionals, really verified</p><h2>Meet some of our experts.</h2></div><Link href="/providers" className="center-link">Browse all {expertsCount}+ experts <ArrowRight size={15} /></Link></div>
        <div className="provider-grid">
          {featured.map((provider) => <ExpertShowcaseCard key={provider.id} provider={provider} />)}
        </div>
      </div></section>
    )}

    <section className="section process-section"><div className="container"><div className="section-heading centered"><p className="eyebrow">How it works</p><h2>Less chasing. More doing.</h2><p>We take the busywork off your plate so you can keep moving forward.</p></div><div className="process-grid">{[['01', 'Tell us what you need', 'Choose a service and tell us about your requirement.'], ['02', 'We coordinate it', 'Trinity manages the process and keeps you updated.'], ['03', 'Get it done', 'Track progress and receive the completed work.']].map(([number, title, text]) => <div className="process-step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <section className="container cta-section"><div><p className="eyebrow eyebrow-gold">Your time is better spent elsewhere.</p><h2>Stop chasing paperwork.<br />Start running your business.</h2><GetStartedButton /></div><div className="cta-mark"><span>Trinity</span><span className="cta-line" /></div></section>
  </>
}
