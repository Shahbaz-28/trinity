import Link from 'next/link'
import { ArrowRight, BadgeCheck, ClipboardList, Users } from 'lucide-react'

const points = [
  { icon: Users, title: 'Get matched with clients', text: 'Businesses looking for a CA, Advocate, CS or Accountant find you through Trinity — no cold outreach.' },
  { icon: ClipboardList, title: 'One place for every request', text: 'See what clients need and track the work you’ve taken on, all in one dashboard.' },
  { icon: BadgeCheck, title: 'Verified, not anonymous', text: 'Every application is reviewed before it goes live, so clients know who they’re working with.' },
]

export default function PartnerLandingPage() {
  return (
    <main className="page-shell partner-page">
      <div className="container about-hero">
        <div>
          <p className="eyebrow">For CAs, Advocates, CS &amp; Accountants</p>
          <h1>Grow your practice with Trinity.</h1>
          <p>Join the network of professionals helping Indian founders and small businesses get their GST, compliance, legal and financial work done.</p>
          <div className="hero-actions" style={{ marginTop: 28 }}>
            <Link href="/partner/apply" className="button button-primary">Apply as a Professional <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="about-note">
          <span className="note-mark">“</span>
          <p>Every professional on Trinity is reviewed before clients can find them.</p>
          <span className="note-author">How Trinity keeps quality high</span>
        </div>
      </div>
      <section className="container why-section">
        <div className="section-heading"><div><p className="eyebrow">Why partner with Trinity?</p><h2>Built for how you already work.</h2></div></div>
        <div className="values-grid">
          {points.map((point, index) => {
            const Icon = point.icon
            return (
              <article className="value-card" key={point.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3><Icon size={20} style={{ marginRight: 8, verticalAlign: '-4px' }} />{point.title}</h3>
                <p>{point.text}</p>
              </article>
            )
          })}
        </div>
      </section>
      <section className="container philosophy">
        <div className="philosophy-label">How it works</div>
        <div className="flow">
          <span>Submit your application</span>
          <ArrowRight />
          <span>Trinity reviews it</span>
          <ArrowRight />
          <span>Go live and start getting matched</span>
        </div>
      </section>
    </main>
  )
}
