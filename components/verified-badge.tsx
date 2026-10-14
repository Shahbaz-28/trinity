import { BadgeCheck } from 'lucide-react'

export function VerifiedBadge({ membershipNumber }: { membershipNumber?: string | null }) {
  return (
    <span className="verified-badge">
      <BadgeCheck size={13} />
      Verified{membershipNumber ? ` · ${membershipNumber}` : ''}
    </span>
  )
}
