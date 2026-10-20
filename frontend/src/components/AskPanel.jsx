import { useState } from 'react'
import { Globe, Newspaper, FlaskConical, GraduationCap, ChevronRight, ChevronDown, SlidersHorizontal } from 'lucide-react'

const SCOPES = [['all', 'All sources', Globe], ['news', 'News', Newspaper], ['research', 'Research', FlaskConical], ['academic', 'Academic', GraduationCap]]
const MAX = 500
const MIN = 10

export default function AskPanel({ q, setQ, prefs, onSubmit, busy, recent, onOpen, onViewAll }) {
  const [scope, setScope] = useState(prefs.scope)
  const [adv, setAdv] = useState(false)
  const [depth, setDepth] = useState(prefs.depth)
  const [hybrid, setHybrid] = useState(prefs.hybrid)
  const [maxP, setMaxP] = useState('auto')
  const [touched, setTouched] = useState(false)

  const short = q.trim().length < MIN
  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (short || busy) return
    onSubmit(q.trim(), { scope, depth, hybrid, maxPerspectives: maxP })
  }

  return (
    <aside className="side">
      <form onSubmit={submit} className="ask" noValidate>
        <label htmlFor="q">Your question</label>
        <textarea id="q" rows={4} maxLength={MAX} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q && setTouched(true)}
          placeholder="Should electric vehicle subsidies continue?" aria-invalid={touched && short} aria-describedby="qhelp" />
        <div className="qrow">
          <span id="qhelp" className={touched && short ? 'fe' : 'hint'}>
            {touched && short ? `Add a little more detail. Questions need at least ${MIN} characters.` : 'Ask about a topic people disagree on.'}
          </span>
          <span className="count">{q.length}/{MAX}</span>
        </div>

        <fieldset>
          <legend>Search in</legend>
          <div className="scopes">
            {SCOPES.map(([id, label, Icon]) => (
              <label key={id} className={scope === id ? 'on' : ''}>
                <input type="radio" name="scope" value={id} checked={scope === id} onChange={() => setScope(id)} />
                <Icon size={15} /> {label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" className="advbtn" aria-expanded={adv} onClick={() => setAdv(!adv)}>
          <SlidersHorizontal size={15} /> Advanced options <ChevronDown size={15} className={adv ? 'flip' : ''} />
        </button>
        {adv && (
          <div className="adv">
            <label htmlFor="depth">Passages to retrieve: <strong>{depth}</strong></label>
            <input id="depth" type="range" min="5" max="30" step="5" value={depth} onChange={(e) => setDepth(+e.target.value)} />
            <label className="check"><input type="checkbox" checked={hybrid} onChange={(e) => setHybrid(e.target.checked)} /> Combine keyword and semantic search</label>
            <label htmlFor="maxp">Number of perspectives</label>
            <select id="maxp" value={maxP} onChange={(e) => setMaxP(e.target.value)}>
              <option value="auto">Let Kaleido decide</option>
              <option value="3">Up to 3</option>
              <option value="4">Up to 4</option>
              <option value="5">Up to 5</option>
            </select>
          </div>
        )}

        <button className="go" disabled={busy}>{busy ? 'Generating' : 'Generate report'}</button>
      </form>

      {recent.length > 0 && (
        <div className="recent">
          <div className="rhead"><h3>Recent queries</h3><button className="link" onClick={onViewAll}>View all</button></div>
          <ul>
            {recent.map((r) => (
              <li key={r.id}>
                <button onClick={() => onOpen(r)}>
                  <span>{r.question}<small>{r.searched_on}</small></span>
                  <ChevronRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
