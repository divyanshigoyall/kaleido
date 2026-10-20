import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react'
import { useLocal } from '../store'
import { useToast } from './Toasts'

const TYPES = [['citation', 'Missing or wrong citation'], ['perspective', 'Perspective misrepresented'], ['evidence', 'Evidence quality'], ['other', 'Something else']]

export default function Feedback({ report }) {
  const toast = useToast()
  const [fb, setFb] = useLocal(`kaleido:feedback:${report.id}`, { rating: null, flags: [] })
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('citation')
  const [note, setNote] = useState('')

  const rate = (r) => { setFb({ ...fb, rating: fb.rating === r ? null : r }); if (fb.rating !== r) toast('Thanks for the rating.') }
  const send = (e) => {
    e.preventDefault()
    setFb({ ...fb, flags: [...fb.flags, { type, note: note.trim() }] })
    setNote(''); setOpen(false); toast('Feedback sent. Thank you.')
  }

  return (
    <section className="fb" aria-label="Feedback">
      <span>Was this report useful?</span>
      <button aria-pressed={fb.rating === 'up'} className={fb.rating === 'up' ? 'on' : ''} onClick={() => rate('up')}><ThumbsUp size={15} /> Yes</button>
      <button aria-pressed={fb.rating === 'down'} className={fb.rating === 'down' ? 'on' : ''} onClick={() => rate('down')}><ThumbsDown size={15} /> No</button>
      <button className="link" onClick={() => setOpen(!open)} aria-expanded={open}><Flag size={14} /> Report a problem{fb.flags.length ? ` (${fb.flags.length} sent)` : ''}</button>
      {open && (
        <form onSubmit={send} className="fbform">
          <label htmlFor="ft">What went wrong?</label>
          <select id="ft" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <label htmlFor="fn">Details</label>
          <textarea id="fn" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Which claim or source, and what is wrong with it?" />
          <button className="btn primary">Send feedback</button>
        </form>
      )}
    </section>
  )
}
