import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { Verify } from './bits'

export default function EvidenceDrawer({ report, claimId, n, onClose }) {
  const closeRef = useRef(null)
  const claim = report.claims.find((c) => c.id === claimId)
  useEffect(() => {
    closeRef.current?.focus()
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  if (!claim) return null
  const items = claim.evidence_ids.map((id) => report.evidence.find((e) => e.id === id)).filter(Boolean)
  const src = (id) => report.sources.find((s) => s.id === id)

  return (
    <div className="scrim" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Evidence for claim ${n}`} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Claim {n}</h2>
          <button ref={closeRef} className="iconbtn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <p className="dclaim">{claim.text}</p>
        <Verify v={claim.verification} />
        <h3>Evidence passages</h3>
        {items.map((e) => {
          const s = src(e.source_id)
          return (
            <figure key={e.id} className="passage">
              <blockquote>{e.passage}</blockquote>
              <figcaption>
                <strong>{s.title}</strong>
                <span>{s.publisher}{s.author ? `, ${s.author}` : ''}</span>
                <span>Retrieved {s.retrieved}. {s.license}.</span>
                <span>Relevance {e.relevance.toFixed(2)}</span>
                <a href={s.url} target="_blank" rel="noreferrer">Open original source <ExternalLink size={13} /></a>
              </figcaption>
            </figure>
          )
        })}
      </aside>
    </div>
  )
}
