'use client'

import { ArrowRight } from 'lucide-react'
import { useEnterApp } from '@/lib/use-enter-app'
import { Button } from './shared'

export function GetStartedButton() {
  const enterApp = useEnterApp()
  return <Button onClick={enterApp}>Get Started <ArrowRight size={16} /></Button>
}
