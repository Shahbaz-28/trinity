import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="page-shell about-page">
      <div className="container about-hero">
        <div><p className="eyebrow">A better way to get things done</p><h1>Making business support simpler.</h1><p>Trinity brings the people, processes and support businesses need into one simple experience.</p></div>
        <div className="about-note"><span className="note-mark">“</span><p>Good business support should give you clarity, not more work.</p><span className="note-author">The Trinity philosophy</span></div>
      </div>
      <section className="container why-section">
        <div className="section-heading"><div><p className="eyebrow">Why Trinity?</p><h2>Built around how you work.</h2></div><p>Professional support, delivered with the ease and transparency modern businesses expect.</p></div>
        <div className="values-grid">{[['Simple', 'No unnecessary complexity or confusing processes.', '01'], ['Transparent', 'Clear services, pricing and progress at every step.', '02'], ['Human', 'Real support when your business needs it.', '03']].map(([title, text, number]) => <article className="value-card" key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowRight size={18} /></article>)}</div>
      </section>
      <section className="container philosophy">
        <div className="philosophy-label">The Trinity flow</div>
        <div className="flow"><span>You tell us what you need</span><ArrowRight /><span>Trinity coordinates the work</span><ArrowRight /><span>You stay focused on your business</span></div>
      </section>
      <section className="container story-section">
        <div><p className="eyebrow">Why we started</p><h2>Business owners have enough to think about.</h2></div>
        <p>From your first registration to the next stage of growth, Trinity exists to make the important work feel clear, coordinated and under control. We are building the support layer modern Indian businesses deserve.</p>
      </section>
    </main>
  )
}
