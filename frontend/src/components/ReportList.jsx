import { useState } from 'react'
import { Search, Trash2, BookmarkMinus } from 'lucide-react'

export default function ReportList({ title, items, onOpen, onRemove, saved, emptyText, onClear }) {
  const [q, setQ] = useState('')
  const shown = items.filter((r) => r.question.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <main className="list-page">
      <div className="lp-head">
        <h2>{title}</h2>
        {onClear && items.length > 0 && <button className="link" onClick={onClear}>Clear all</button>}
      </div>
      {items.length > 0 && (
        <div className="lsearch">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your reports" aria-label="Search your reports" />
        </div>
      )}
      {items.length === 0 && <p className="muted empty-line">{emptyText}</p>}
      {items.length > 0 && shown.length === 0 && <p className="muted empty-line">No reports match "{q}".</p>}
      <ul className="rows">
        {shown.map((r) => (
          <li key={r.id}>
            <button className="rowmain" onClick={() => onOpen(r)}>
              <span className="rq">{r.question}</span>
              <span className="muted">{r.searched_on}. {r.perspectives.length} perspectives, {r.sources.length} sources</span>
            </button>
            <button className="iconbtn" onClick={() => onRemove(r)} aria-label={`${saved ? 'Remove bookmark for' : 'Delete'} ${r.question}`}>
              {saved ? <BookmarkMinus size={17} /> : <Trash2 size={17} />}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
