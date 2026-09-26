import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  FileText,
  Landmark,
  ShieldCheck,
  Tags,
  Users,
} from 'lucide-react'

export type Service = {
  name: string
  category: string
  description: string
  icon: typeof Landmark
}

export const services: Service[] = [
  { name: 'GST Registration', category: 'Tax & GST', description: 'Get registered correctly and start with confidence.', icon: Landmark },
  { name: 'GST Return Filing', category: 'Tax & GST', description: 'Stay current with accurate, timely filings.', icon: ClipboardCheck },
  { name: 'Bookkeeping', category: 'Accounting', description: 'Keep your records clean, clear and up to date.', icon: BookOpen },
  { name: 'Payroll', category: 'Accounting', description: 'Run payroll smoothly and take care of your team.', icon: Users },
  { name: 'MSME Registration', category: 'Business', description: 'Unlock the benefits available to your business.', icon: BriefcaseBusiness },
  { name: 'Business Documentation', category: 'Business', description: 'Get important documents prepared without the back and forth.', icon: FileText },
  { name: 'ROC Support', category: 'Compliance', description: 'Handle recurring company compliance with ease.', icon: ShieldCheck },
  { name: 'Compliance Assistance', category: 'Compliance', description: 'Know what is due and what to do next.', icon: Check },
  { name: 'Trademark Filing', category: 'Intellectual Property', description: 'Protect the name and identity you are building.', icon: Tags },
  { name: 'Virtual CFO', category: 'Finance', description: 'Make sharper decisions with practical financial guidance.', icon: BarChart3 },
]

export const serviceCategories = ['All', 'Tax & GST', 'Accounting', 'Business', 'Compliance', 'Intellectual Property', 'Finance']
