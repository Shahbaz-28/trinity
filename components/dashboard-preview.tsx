'use client'

import { useRef } from 'react'
import { ArrowRight, BarChart3, Bell, BookOpen, BriefcaseBusiness, CheckCircle2, ChevronRight, FileText, Landmark, Layers, Sparkles, Users } from 'lucide-react'
import { useEnterApp } from '@/lib/use-enter-app'
import { Logo, StatusPill } from './shared'

const MAX_TILT_DEG = 6

export function DashboardPreview() {
  const enterApp = useEnterApp()
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateX(${(-y * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(x * MAX_TILT_DEG).toFixed(2)}deg) translateY(-4px)`
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (el) el.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      className="dashboard-preview"
      role="button"
      tabIndex={0}
      onClick={enterApp}
      onKeyDown={(event) => { if (event.key === 'Enter') enterApp() }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="preview-body">
        <aside className="preview-sidebar">
          <Logo />
          <div className="preview-side-links">
            <span className="selected"><BarChart3 size={14} />Overview</span>
            <span><BriefcaseBusiness size={14} />Services</span>
            <span><FileText size={14} />Documents</span>
          </div>
        </aside>
        <div className="preview-main">
          <div className="preview-heading">
            <div>
              <p className="eyebrow">Business overview</p>
              <h3>Good morning, Justin</h3>
              <p className="preview-heading-sub">Here&apos;s what&apos;s happening with your business today.</p>
            </div>
            <div className="preview-heading-actions">
              <span className="preview-bell"><Bell size={14} /><span className="preview-bell-dot" /></span>
              <span className="preview-avatar">R</span>
            </div>
          </div>
          <div className="mini-stats">
            <div>
              <span className="mini-stat-icon icon-blue"><Layers size={14} /></span>
              <div><span>Active Services</span><strong>4</strong><small>↑ +1 this month</small></div>
            </div>
            <div>
              <span className="mini-stat-icon icon-green"><CheckCircle2 size={14} /></span>
              <div><span>Completed</span><strong>12</strong><small>All up to date</small></div>
            </div>
          </div>
          <div className="preview-section-title"><span>Current work</span><span>View all <ChevronRight size={13} /></span></div>
          <div className="mini-work">
            <div><span className="mini-icon icon-blue"><Landmark size={14} /></span><span><strong>GST Filing</strong><small>Updated today</small></span><StatusPill tone="blue">In Progress</StatusPill><ChevronRight size={13} className="mini-chevron" /></div>
            <div><span className="mini-icon icon-green"><BookOpen size={14} /></span><span><strong>Bookkeeping</strong><small>Updated yesterday</small></span><StatusPill tone="green">Completed</StatusPill><ChevronRight size={13} className="mini-chevron" /></div>
            <div><span className="mini-icon icon-gold"><Users size={14} /></span><span><strong>Payroll</strong><small>Due in 4 days</small></span><StatusPill tone="gold">Due Soon</StatusPill><ChevronRight size={13} className="mini-chevron" /></div>
          </div>
        </div>
      </div>
      <div className="preview-footer"><span><Sparkles size={13} />A clear view of your business work</span><span>Open dashboard <ArrowRight size={13} /></span></div>
    </div>
  )
}
