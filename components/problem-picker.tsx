import Link from 'next/link'
import { Award, Building2, ClipboardCheck, FileSignature, Receipt, Scale, TrendingUp, Wallet } from 'lucide-react'
import { problemTags, type ProblemTag } from '@/lib/problem-tags'

const icons: Record<ProblemTag, typeof Receipt> = {
  'gst-tax': Receipt,
  'bookkeeping-payroll': Wallet,
  'virtual-cfo': TrendingUp,
  'company-registration': Building2,
  'roc-compliance': ClipboardCheck,
  'contracts-business-law': FileSignature,
  'trademark-ip': Award,
  'property-civil': Scale,
}

export function ProblemPicker() {
  return (
    <div className="problem-grid">
      {problemTags.map(({ tag, label }) => {
        const Icon = icons[tag]
        return (
          <Link href={`/providers?tag=${tag}`} className="problem-card" key={tag}>
            <span className="problem-card-icon"><Icon size={18} /></span>
            <span>{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
