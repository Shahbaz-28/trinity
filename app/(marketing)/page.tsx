'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { services } from '@/lib/services-data'
import { useEnterApp } from '@/lib/use-enter-app'
import { Button } from '@/components/shared'
import { ServiceCard } from '@/components/service-card'
import { DashboardPreview } from '@/components/dashboard-preview'

export default function HomePage() {
  const enterApp = useEnterApp()

  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy">
        <div className="kicker"><span />Business support, without the complexity</div>
        <h1>Your business work.<br /><em>Handled.</em></h1>
        <p className="hero-text">From GST and accounting to registrations, compliance and ongoing business support — Trinity helps you get important work done without the usual complexity.</p>
        <div className="hero-actions">
          <Button onClick={enterApp}>Get Started <ArrowRight size={16} /></Button>
          <Link href="/explore" className="button button-secondary">Explore Services</Link>
        </div>
        <p className="trust-line"><ShieldCheck size={16} />Built for founders, small businesses and growing teams.</p>
      </div>
      <DashboardPreview />
    </div></section>
    <section className="section services-section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">The Trinity approach</p><h2>Everything your business needs.</h2></div><p>One place to manage the work that keeps your business moving.</p></div>
      <div className="service-grid home-service-grid">{services.slice(0, 6).map((service) => <ServiceCard key={service.name} service={service} />)}</div>
      <Link href="/explore" className="center-link">Explore all services <ArrowRight size={15} /></Link>
    </div></section>
    <section className="section process-section"><div className="container"><div className="section-heading centered"><p className="eyebrow">How it works</p><h2>Less chasing. More doing.</h2><p>We take the busywork off your plate so you can keep moving forward.</p></div><div className="process-grid">{[['01', 'Tell us what you need', 'Choose a service and tell us about your requirement.'], ['02', 'We coordinate it', 'Trinity manages the process and keeps you updated.'], ['03', 'Get it done', 'Track progress and receive the completed work.']].map(([number, title, text]) => <div className="process-step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
    <section className="container cta-section"><div><p className="eyebrow eyebrow-gold">Your time is better spent elsewhere.</p><h2>Stop chasing paperwork.<br />Start running your business.</h2><Button onClick={enterApp}>Get Started <ArrowRight size={16} /></Button></div><div className="cta-mark"><span>Trinity</span><span className="cta-line" /></div></section>
  </>
}
