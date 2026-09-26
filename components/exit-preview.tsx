import Link from 'next/link'
import { X } from 'lucide-react'

export function ExitPreview() {
  return <Link href="/" className="exit-dashboard"><X size={14} /> Exit preview</Link>
}
