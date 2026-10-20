import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Mark from './Mark'

const users = () => { try { return JSON.parse(localStorage.getItem('kaleido-users')) || [] } catch { return [] } }
const SAMPLE = [['Supportive', 'sup', 4], ['Critical', 'cri', 2], ['Balanced', 'bal', 3], ['Alternative view', 'alt', 1]]

// UI-only auth for now. The real backend should hash passwords and issue sessions.
export default function AuthGate({ onDone }) {
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  function submit(e) {
    e.preventDefault()
    const er = {}
    if (mode === 'signup' && f.name.trim().length < 2) er.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = 'Enter a valid email address.'
    if (f.password.length < 6) er.password = 'Use at least 6 characters.'
    if (Object.keys(er).length) return setErr(er)

    const list = users()
    const email = f.email.trim().toLowerCase()
    const found = list.find((u) => u.email === email)
    if (mode === 'signup') {
      if (found) return setErr({ email: 'An account with this email already exists. Log in instead.' })
      list.push({ name: f.name.trim(), email, password: f.password })
      localStorage.setItem('kaleido-users', JSON.stringify(list))
      return onDone({ name: f.name.trim(), email })
    }
    if (!found || found.password !== f.password) return setErr({ form: 'Email or password is incorrect.' })
    onDone({ name: found.name, email: found.email })
  }

  const switchMode = (m) => { setMode(m); setErr({}) }

  return (
    <div className="auth">
      <aside className="auth-art">
        <div className="brand"><Mark /><span className="wordmark">Kaleido</span></div>
        <div>
          <h1>Ask once. See the whole argument.</h1>
          <p>Kaleido reads across sources and sorts what it finds into viewpoints, with the evidence behind every claim.</p>
          <ul className="sample">
            {SAMPLE.map(([label, k, n]) => (
              <li key={k} style={{ '--c': `var(--${k})` }}>
                <span>{label}</span>
                <span className="dots" aria-hidden="true">{[1, 2, 3, 4].map((i) => <i key={i} className={i <= n ? 'f' : ''} />)}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="fine">Banasthali Vidyapith, CS 096</p>
      </aside>

      <main className="auth-main">
        <form className="auth-card" onSubmit={submit} noValidate>
          <div className="brand mobile-brand"><Mark size={26} /><span className="wordmark">Kaleido</span></div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="muted">{mode === 'login' ? 'Log in to open your saved reports and history.' : 'Your history and saved reports stay tied to your account.'}</p>

          <div className="seg" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'on' : ''} onClick={() => switchMode('login')}>Log in</button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'on' : ''} onClick={() => switchMode('signup')}>Create account</button>
          </div>

          {err.form && <p className="form-err" role="alert">{err.form}</p>}

          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!err.name} />
              {err.name && <span className="fe">{err.name}</span>}
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={!!err.email} />
            {err.email && <span className="fe">{err.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="pw">Password</label>
            <div className="pw">
              <input id="pw" type={show ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={f.password} onChange={set('password')} aria-invalid={!!err.password} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {err.password && <span className="fe">{err.password}</span>}
          </div>

          <button className="btn primary" type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</button>
          <div className="or"><span>or</span></div>
          <button className="btn" type="button" onClick={() => onDone({ name: 'Guest', email: '', guest: true })}>Continue as guest</button>
          <p className="fine muted">Guest reports stay on this device only.</p>
        </form>
      </main>
    </div>
  )
}
