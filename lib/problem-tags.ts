export type ProblemTag =
  | 'gst-tax'
  | 'bookkeeping-payroll'
  | 'virtual-cfo'
  | 'company-registration'
  | 'roc-compliance'
  | 'contracts-business-law'
  | 'trademark-ip'
  | 'property-civil'

export const problemTags: { tag: ProblemTag; label: string }[] = [
  { tag: 'contracts-business-law', label: 'Contracts & business law' },
  { tag: 'property-civil', label: 'Property & civil disputes' },
  { tag: 'gst-tax', label: 'GST filing & tax compliance' },
  { tag: 'company-registration', label: 'Company registration & MSME' },
  { tag: 'bookkeeping-payroll', label: 'Bookkeeping & payroll' },
  { tag: 'virtual-cfo', label: 'Virtual CFO support' },
  { tag: 'roc-compliance', label: 'ROC & annual compliance' },
  { tag: 'trademark-ip', label: 'Trademark & brand protection' },
]

export const problemTagLabels: Record<ProblemTag, string> = problemTags.reduce(
  (labels, { tag, label }) => ({ ...labels, [tag]: label }),
  {} as Record<ProblemTag, string>,
)
