import { useState } from 'react'
import { Bookmark, Download, Printer, Link2, Copy, FileText, ChevronDown, Clock, Library, ExternalLink, AlertTriangle } from 'lucide-react'
import PerspectiveCard from './PerspectiveCard'
import Feedback from './Feedback'
import EvidenceDrawer from './EvidenceDrawer'
import { Verify, Evidence, Cite, Menu, VLABEL } from './bits'
import { useToast } from './Toasts'

function toMarkdown(r) {
  const n = (id) => r.claims.findIndex((c) => c.id === id) + 1
  let md = `# ${r.question}\n\nSearched on ${r.searched_on}\n\n## Summary\n\n${r.summary}\n\n## Perspectives\n`
  for (const p of r.perspectives) {
    md += `\n### ${p.label}\n${p.stance}\n\n`
    for (const c of r.claims.filter((c) => c.perspective === p.key)) md += `- ${c.text} [${n(c.id)}] (${VLABEL[c.verification]})\n`
  }
  const list = (t, a) => `\n## ${t}\n\n${a.map((i) => `- ${i.text}`).join('\n')}\n`
  md += list('Agreement', r.agreement) + list('Disagreement', r.disagreement) + list('Uncertainty', r.uncertainty)
  md += '\n## Sources\n\n' + r.sources.map((s, i) => `${i + 1}. ${s.title}. ${s.publisher}. ${s.url} (retrieved ${s.retrieved}, ${s.license})`).join('\n')
  return md
}

function Findings({ items, num, onCite, intro }) {
  return (
    <div className="findings">
      <p className="intro">{intro}</p>
      <ul>
        {items.map((i) => (
          <li key={i.text}>
            <span>{i.text}</span>
            {i.claims?.length > 0 && <span className="cites">{i.claims.map((id) => <Cite key={id} n={num(id)} onClick={() => onCite(id)} />)}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PerspectivesTab({ report, sel, setSel, num, onOpen }) {
  const list = sel === 'all' ? report.perspectives : report.perspectives.filter((p) => p.key === sel)
  const groups = [['support', 'Supporting claims'], ['oppose', 'Opposing claims'], ['neutral', 'Neutral claims']]
  return (
    <>
      <div className="chips" role="group" aria-label="Choose a perspective">
        <button className={`chip ${sel === 'all' ? 'on' : ''}`} aria-pressed={sel === 'all'} onClick={() => setSel('all')}>All ({report.perspectives.length})</button>
        {report.perspectives.map((p) => (
          <button key={p.key} className={`chip ${p.key} ${sel === p.key ? 'on' : ''}`} aria-pressed={sel === p.key} onClick={() => setSel(p.key)}>{p.label}</button>
        ))}
      </div>
      <div className="psections">
        {list.map((p) => {
          const claims = report.claims.filter((c) => c.perspective === p.key)
          return (
            <section key={p.key} className={`psec persp ${p.key}`}>
              <h2>{p.label}</h2>
              <p className="stance">{p.stance}</p>
              <p className="details">{p.details}</p>
              <div className="meters">
                <div>
                  <span className="mlabel">How widely held</span>
                  <div className="meter"><span style={{ width: `${Math.round((p.sources_count / report.source_total) * 100)}%` }} /></div>
                  <small>Cited by {p.sources_count} of {report.source_total} sources</small>
                </div>
                <div><span className="mlabel">How well supported</span><Evidence level={p.evidence} /></div>
              </div>
              {groups.map(([k, label]) => {
                const cs = claims.filter((c) => c.stance === k)
                return cs.length > 0 && (
                  <div key={k} className="cgroup">
                    <h3>{label}</h3>
                    <ul>{cs.map((c) => (
                      <li key={c.id}><span className="ctext">{c.text}</span><Verify v={c.verification} /><Cite n={num(c.id)} onClick={() => onOpen(c.id)} /></li>
                    ))}</ul>
                  </div>
                )
              })}
            </section>
          )
        })}
      </div>
    </>
  )
}

function EvidenceTab({ report, vf, setVf, num, onOpen }) {
  const keys = ['all', 'supported', 'weak', 'unsupported']
  const count = (k) => (k === 'all' ? report.claims.length : report.claims.filter((c) => c.verification === k).length)
  const rows = report.claims.filter((c) => vf === 'all' || c.verification === vf)
  const pl = Object.fromEntries(report.perspectives.map((p) => [p.key, p.label]))
  const note = { weak: 'Evidence is thin or indirect. Read the passage before relying on this.', unsupported: 'No passage backs this claim well. Treat it as unverified.' }
  return (
    <>
      <p className="intro">Every claim in this report is checked against the passage it cites.</p>
      <div className="chips" role="group" aria-label="Filter by verification">
        {keys.map((k) => (
          <button key={k} className={`chip ${vf === k ? 'on' : ''}`} aria-pressed={vf === k} onClick={() => setVf(k)}>
            {k === 'all' ? 'All claims' : VLABEL[k]} ({count(k)})
          </button>
        ))}
      </div>
      <ul className="claims">
        {rows.map((c) => (
          <li key={c.id} className={`claim ${c.verification}`}>
            <div>
              <p>{c.text}</p>
              {note[c.verification] && <p className="cnote">{note[c.verification]}</p>}
              <div className="cmeta">
                <span className="ptag">{pl[c.perspective]}</span>
                <Verify v={c.verification} />
                <button className="link" onClick={() => onOpen(c.id)}>View {c.evidence_ids.length} {c.evidence_ids.length === 1 ? 'passage' : 'passages'}</button>
              </div>
            </div>
            <Cite n={num(c.id)} onClick={() => onOpen(c.id)} />
          </li>
        ))}
      </ul>
    </>
  )
}

function SourcesTab({ report }) {
  const used = (sid) => report.evidence.filter((e) => e.source_id === sid).length
  return (
    <ol className="sources">
      {report.sources.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noreferrer">{s.title} <ExternalLink size={13} /></a>
          <span>{s.publisher}{s.author ? `, ${s.author}` : ''}</span>
          <span className="muted">{s.type}. Retrieved {s.retrieved}. {s.license}. {used(s.id)} {used(s.id) === 1 ? 'passage' : 'passages'} used.</span>
        </li>
      ))}
    </ol>
  )
}

export default function ReportView({ report, saved, onToggleSave }) {
  const toast = useToast()
  const [tab, setTab] = useState('overview')
  const [sel, setSel] = useState('all')
  const [vf, setVf] = useState('all')
  const [open, setOpen] = useState(null)
  const num = (id) => report.claims.findIndex((c) => c.id === id) + 1
  const flagged = report.claims.filter((c) => c.verification !== 'supported').length

  const tabs = [
    ['overview', 'Overview'], ['perspectives', `Perspectives (${report.perspectives.length})`], ['evidence', 'Evidence'],
    ['agreement', 'Agreement'], ['disagreement', 'Disagreement'], ['uncertainty', 'Uncertainty'], ['sources', `Sources (${report.sources.length})`],
  ]

  const copy = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg) } catch { toast('Copy failed. Select the text and copy it manually.') }
  }
  const link = `${location.origin}${location.pathname}#report=${report.id}`
  const citation = `Kaleido (${new Date().getFullYear()}). "${report.question}" Multi-perspective report, generated ${report.searched_on}. ${link}`
  const saveMd = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([toMarkdown(report)], { type: 'text/markdown' }))
    a.download = 'kaleido-report.md'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const explore = (key) => { setSel(key); setTab('perspectives') }
  const review = () => { setVf('weak'); setTab('evidence') }

  return (
    <article className="report">
      <header className="r-head">
        <div>
          <p className="kicker">Multi-perspective report</p>
          <h1>{report.question}</h1>
          <p className="meta">
            <span><Clock size={14} /> Searched {report.searched_on}</span>
            <span><Library size={14} /> {report.sources.length} sources</span>
            <span>{report.reading_minutes} min read</span>
            {report.scope !== 'all' && <span>Scope: {report.scope}</span>}
            {report.mock && <span className="sample-tag">Sample data</span>}
          </p>
        </div>
        <div className="actions">
          <button onClick={onToggleSave} className={saved ? 'on' : ''} aria-pressed={saved}>
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
          </button>
          <Menu label="Export options" trigger={<><Download size={16} /> Export <ChevronDown size={14} /></>}>
            <button role="menuitem" onClick={() => window.print()}><Printer size={15} /> Print or save as PDF</button>
            <button role="menuitem" onClick={saveMd}><FileText size={15} /> Download as Markdown</button>
            <button role="menuitem" onClick={() => copy(citation, 'Citation copied.')}><Copy size={15} /> Copy citation</button>
            <button role="menuitem" onClick={() => copy(link, 'Link copied.')}><Link2 size={15} /> Copy report link</button>
          </Menu>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <p className="summary">{report.summary}</p>
          {flagged > 0 && (
            <p className="notice"><AlertTriangle size={16} /> {flagged} of {report.claims.length} claims have weak or missing support. <button className="link" onClick={review}>Review them</button></p>
          )}
          <div className="persp-grid">
            {report.perspectives.map((p) => <PerspectiveCard key={p.key} p={p} onExplore={() => explore(p.key)} />)}
          </div>
          <div className="trio">
            {[['Where they agree', report.agreement, 'agreement'], ['Where they split', report.disagreement, 'disagreement'], ['What is still unknown', report.uncertainty, 'uncertainty']].map(([t, items, id]) => (
              <div className="trio-col" key={id}>
                <h3>{t}</h3>
                <ul>{items.map((i) => <li key={i.text}>{i.text}</li>)}</ul>
                <button className="link" onClick={() => setTab(id)}>See evidence</button>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === 'perspectives' && <PerspectivesTab report={report} sel={sel} setSel={setSel} num={num} onOpen={setOpen} />}
      {tab === 'evidence' && <EvidenceTab report={report} vf={vf} setVf={setVf} num={num} onOpen={setOpen} />}
      {tab === 'agreement' && <Findings items={report.agreement} num={num} onCite={setOpen} intro="Findings that several sources share." />}
      {tab === 'disagreement' && <Findings items={report.disagreement} num={num} onCite={setOpen} intro="Claims, readings or evidence that conflict." />}
      {tab === 'uncertainty' && <Findings items={report.uncertainty} num={num} onCite={setOpen} intro="Open questions and claims that could not be confidently verified." />}
      {tab === 'sources' && <SourcesTab report={report} />}

      <Feedback report={report} />
      {open && <EvidenceDrawer report={report} claimId={open} n={num(open)} onClose={() => setOpen(null)} />}
    </article>
  )
}
