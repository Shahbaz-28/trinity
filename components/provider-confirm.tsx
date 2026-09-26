import { X, Check } from 'lucide-react'
import type { ProviderRow } from '@/lib/supabase/queries'

export function ProviderConfirm({ provider, onCancel, onConfirm, pending }: { provider: ProviderRow; onCancel: () => void; onConfirm: () => void; pending: boolean }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close" aria-label="Close" onClick={onCancel}><X size={16} /></button>
        <p className="eyebrow">Confirm your choice</p>
        <h2>Work with {provider.name}?</h2>
        <p className="modal-text">{provider.name} ({provider.category}) specializes in {provider.specialization}. This adds them as your active service provider on your dashboard.</p>
        <div className="modal-actions">
          <button className="button button-secondary" onClick={onCancel} disabled={pending}>Cancel</button>
          <button className="button button-primary" onClick={onConfirm} disabled={pending}><Check size={15} /> {pending ? 'Confirming…' : 'Confirm'}</button>
        </div>
      </div>
    </div>
  )
}
