'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

export function ExpertsCounter({ target }: { target: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target <= 0) return
    const duration = 1100
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out so it settles rather than stopping abruptly
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return (
    <div className="hero-stats">
      <span className="hero-info-icon icon-tone-blue"><Users size={15} /></span>
      <span>
        <strong>{value}+</strong> Verified professionals across CA, Advocate, CS &amp; Accounting
      </span>
    </div>
  )
}
