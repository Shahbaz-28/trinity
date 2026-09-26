'use client'

import { ArrowRight, BarChart3, BookOpen, BriefcaseBusiness, ChevronRight, FileText, Landmark, Sparkles, Users } from 'lucide-react'
import { useEnterApp } from '@/lib/use-enter-app'
import { Logo, StatusPill } from './shared'

export function DashboardPreview() {
  const enterApp = useEnterApp()
  return (
    <div className="dashboard-preview" role="button" tabIndex={0} onClick={enterApp} onKeyDown={(event) => { if (event.key === 'Enter') enterApp() }}>
      <div className="preview-topbar"><div className="preview-dots"><span /><span /><span /></div><span className="preview-label">Trinity workspace</span><span className="preview-avatar">R</span></div>
      <div className="preview-body">
        <aside className="preview-sidebar"><Logo /><div className="preview-side-links"><span className="selected"><BarChart3 size={14} />Overview</span><span><BriefcaseBusiness size={14} />Services</span><span><FileText size={14} />Documents</span></div></aside>
        <div className="preview-main">
          <div className="preview-heading"><div><p className="eyebrow">Business overview</p><h3>Good morning, Justin</h3></div><span className="preview-date">Aug 2026</span></div>
          <div className="mini-stats"><div><span>Active Services</span><strong>4</strong><small>+1 this month</small></div><div><span>Completed</span><strong>12</strong><small>All up to date</small></div></div>
          <div className="preview-section-title"><span>Current work</span><span>View all <ChevronRight size={13} /></span></div>
          <div className="mini-work">
            <div><span className="mini-icon icon-blue"><Landmark size={14} /></span><span><strong>GST Filing</strong><small>Updated today</small></span><StatusPill tone="blue">In Progress</StatusPill></div>
            <div><span className="mini-icon icon-green"><BookOpen size={14} /></span><span><strong>Bookkeeping</strong><small>Updated yesterday</small></span><StatusPill tone="green">Completed</StatusPill></div>
            <div><span className="mini-icon icon-gold"><Users size={14} /></span><span><strong>Payroll</strong><small>Due in 4 days</small></span><StatusPill tone="gold">Due Soon</StatusPill></div>
          </div>
        </div>
      </div>
      <div className="preview-footer"><span><Sparkles size={13} />A clear view of your business work</span><span>Open dashboard <ArrowRight size={13} /></span></div>
    </div>
  )
}
