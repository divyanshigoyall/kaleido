import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import Header from './Header'
import AskPanel from './AskPanel'
import ReportView from './ReportView'
import ReportList from './ReportList'
import SettingsPage from './SettingsPage'
import { generateReport, STAGES } from '../api'
import { seedReports } from '../mock'
import { useLocal } from '../store'

const SUGGESTED = ['Should electric vehicle subsidies continue?', 'Does social media harm teen mental health?', 'Is remote work still growing?', 'Should AI replace software engineers?']

export default function Workspace({ user, onUpdateUser, onSignOut, themePref, setThemePref, dark }) {
  const ns = user.guest ? 'guest' : user.email
  const [history, setHistory] = useLocal(`kaleido:${ns}:history`, seedReports)
  const [saved, setSaved] = useLocal(`kaleido:${ns}:saved`, [])
  const [prefs, setPrefs] = useLocal('kaleido-prefs', { scope: 'all', depth: 15, hybrid: true })
  const [view, setView] = useState('search')
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState('idle')
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [last, setLast] = useState(null)
  const [banner, setBanner] = useState(true)

  useEffect(() => {
    const m = location.hash.match(/report=(.+)$/)
    if (!m) return
    const r = [...history, ...saved].find((x) => x.id === m[1])
    if (r) { setReport(r); setStatus('done') }
  }, []) // eslint-disable-line

  async function run(question, opts) {
    setLast([question, opts])
    setView('search'); setStatus('loading'); setStage(0); setError('')
    try {
      const data = await generateReport(question, opts, setStage)
      setReport(data); setStatus('done')
      setHistory((h) => [data, ...h.filter((x) => x.question !== data.question)].slice(0, 50))
    } catch (e) {
      setError(e.message || 'Something went wrong.'); setStatus('error')
    }
  }
  const open = (r) => { setReport(r); setStatus('done'); setView('search') }
  const isSaved = report && saved.some((s) => s.id === report.id)
  const toggleSave = () => setSaved((s) => (isSaved ? s.filter((x) => x.id !== report.id) : [report, ...s]))
  const suggest = (s) => { setQ(s); run(s, { scope: prefs.scope, depth: prefs.depth, hybrid: prefs.hybrid, maxPerspectives: 'auto' }) }

  return (
    <div className="shell">
      <Header view={view} setView={setView} user={user} dark={dark} toggleTheme={() => setThemePref(dark ? 'light' : 'dark')} onSignOut={onSignOut} />
      {user.guest && banner && (
        <p className="banner">
          You are browsing as a guest. Reports stay on this device.
          <button className="link" onClick={onSignOut}>Log in or create an account</button>
          <button className="iconbtn small" onClick={() => setBanner(false)} aria-label="Dismiss"><X size={15} /></button>
        </p>
      )}

      {view === 'search' && (
        <main className="grid">
          <AskPanel q={q} setQ={setQ} prefs={prefs} onSubmit={run} busy={status === 'loading'} recent={history.slice(0, 4)} onOpen={open} onViewAll={() => setView('history')} />
          <section aria-live="polite">
            {status === 'idle' && (
              <div className="empty">
                <h2>Ask something people disagree about.</h2>
                <p>Kaleido reads across sources and sorts what it finds into viewpoints, so you can see where they agree, where they split, and what nobody knows yet.</p>
                <p className="try">Try one of these:</p>
                <ul className="suggest">{SUGGESTED.map((s) => <li key={s}><button onClick={() => suggest(s)}>{s}</button></li>)}</ul>
              </div>
            )}
            {status === 'loading' && (
              <div className="empty" role="status">
                <h2>Building your report</h2>
                <ol className="stages">
                  {STAGES.map((s, i) => (
                    <li key={s} className={i < stage ? 'done' : i === stage ? 'now' : ''}>{i < stage ? <Check size={15} /> : <span className="pip" />}{s}</li>
                  ))}
                </ol>
                <div className="bar"><span /></div>
              </div>
            )}
            {status === 'error' && (
              <div className="empty err" role="alert">
                <h2>The report did not generate</h2>
                <p>{error}</p>
                <p>Your question and history are safe. Try again in a moment.</p>
                <button className="btn primary" onClick={() => last && run(...last)}>Try again</button>
              </div>
            )}
            {status === 'done' && report && <ReportView key={report.id} report={report} saved={!!isSaved} onToggleSave={toggleSave} />}
          </section>
        </main>
      )}
      {view === 'history' && (
        <ReportList title="History" items={history} onOpen={open} onRemove={(r) => setHistory((h) => h.filter((x) => x.id !== r.id))}
          onClear={() => window.confirm('Delete all history on this device?') && setHistory([])} emptyText="Nothing searched yet. Your reports will appear here." />
      )}
      {view === 'saved' && (
        <ReportList title="Saved reports" saved items={saved} onOpen={open} onRemove={(r) => setSaved((s) => s.filter((x) => x.id !== r.id))} emptyText="Save a report with the bookmark button and it will show up here." />
      )}
      {view === 'settings' && (
        <SettingsPage user={user} onUpdateUser={onUpdateUser} themePref={themePref} setThemePref={setThemePref} prefs={prefs} setPrefs={setPrefs}
          onClearHistory={() => setHistory([])} onClearSaved={() => setSaved([])} onSignOut={onSignOut} />
      )}
    </div>
  )
}
