import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export const VLABEL = { supported: 'Supported', weak: 'Weakly supported', unsupported: 'Unsupported' }
const VICON = { supported: CheckCircle2, weak: AlertTriangle, unsupported: XCircle }

export function Verify({ v }) {
  const Icon = VICON[v]
  return <span className={`vbadge ${v}`}><Icon size={14} />{VLABEL[v]}</span>
}

const EV = { strong: ['Strong evidence', 4], moderate: ['Moderate evidence', 3], mixed: ['Mixed evidence', 2], limited: ['Limited evidence', 1] }
export function Evidence({ level }) {
  const [label, n] = EV[level] || EV.limited
  return (
    <span className="ev">
      <span className="dots" aria-hidden="true">{[1, 2, 3, 4].map((i) => <i key={i} className={i <= n ? 'f' : ''} />)}</span>
      {label}
    </span>
  )
}

export function Cite({ n, onClick }) {
  return <button className="cite" onClick={onClick} aria-label={`Show evidence for claim ${n}`}>{n}</button>
}

export function Menu({ trigger, children, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', off)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <div className="menu" ref={ref}>
      <button className="menu-trigger" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>{trigger}</button>
      {open && <div className="menu-pop" role="menu" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}
