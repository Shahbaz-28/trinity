import { Download, FileText } from 'lucide-react'
import type { DocumentWithUrl } from '@/lib/supabase/queries'

export function DocumentsList({ documents }: { documents: DocumentWithUrl[] }) {
  if (documents.length === 0) {
    return <div className="dashboard-empty"><p>No documents yet.</p></div>
  }

  return (
    <div className="documents-list">
      {documents.map((doc) => (
        <div className="document-row" key={doc.id}>
          <span className="document-icon"><FileText size={18} /></span>
          <span className="document-info">
            <strong>{doc.title}</strong>
            <small>{new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
          </span>
          {doc.downloadUrl && (
            <a href={doc.downloadUrl} target="_blank" rel="noreferrer" className="icon-button" aria-label={`Download ${doc.title}`}>
              <Download size={16} />
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
