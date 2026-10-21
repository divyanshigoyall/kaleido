
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth'
import { auth, google } from '../firebase'
import Mark from './Mark'

const SAMPLE = [
  ['Supportive', 'sup', 4],
  ['Critical', 'cri', 2],
  ['Balanced', 'bal', 3],
  ['Alternative view', 'alt', 1],
]

const MSG = {
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/email-already-in-use':
    'An account with this email already exists. Log in instead.',
  'auth/weak-password': 'Use at least 6 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/too-many-requests':
    'Too many attempts. Try again in a few minutes.',
  'auth/popup-blocked': 'Allow popups and try Google sign-in again.',
  'auth/unauthorized-domain':
    'This domain is not authorized for sign-in in Firebase.',
}

const toUser = (user) => ({
  name: user.displayName || user.email?.split('@')[0] || 'User',
  email: user.email || '',
})

export default function AuthGate({ onDone }) {
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) =>
    setF((prev) => ({ ...prev, [key]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setErr({})

    const er = {}
    const email = f.email.trim()

    if (mode === 'signup' && f.name.trim().length < 2) {
      er.name = 'Enter your name.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      er.email = 'Enter a valid email address.'
    }

    if (f.password.length < 6) {
      er.password = 'Use at least 6 characters.'
    }

    if (Object.keys(er).length) {
      setErr(er)
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          f.password
        )

        await updateProfile(user, {
          displayName: f.name.trim(),
        })

        onDone(toUser(user))
      } else {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          f.password
        )

        onDone(toUser(user))
      }
    } catch (error) {
      setErr({
        form: MSG[error.code] || 'Something went wrong. Try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  async function withGoogle() {
    setErr({})
    setLoading(true)

    try {
      const { user } = await signInWithPopup(auth, google)
      onDone(toUser(user))
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setErr({
          form: MSG[error.code] || 'Google sign-in failed. Try again.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setErr({})
  }

  return (
    <div className="auth">
      <aside className="auth-art">
        <div className="brand">
          <Mark />
          <span className="wordmark">Kaleido</span>
        </div>

        <div>
          <h1>Ask once. See the whole argument.</h1>
          <p>
            Kaleido reads across sources and sorts what it finds into
            viewpoints, with the evidence behind every claim.
          </p>

          <ul className="sample">
            {SAMPLE.map(([label, k, n]) => (
              <li key={k} style={{ '--c': `var(--${k})` }}>
                <span>{label}</span>
                <span className="dots" aria-hidden="true">
                  {[1, 2, 3, 4].map((i) => (
                    <i key={i} className={i <= n ? 'f' : ''} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="fine">Banasthali Vidyapith, CS 096</p>
      </aside>

      <main className="auth-main">
        <form className="auth-card" onSubmit={submit} noValidate>
          <div className="brand mobile-brand">
            <Mark size={26} />
            <span className="wordmark">Kaleido</span>
          </div>

          <h2>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>

          <p className="muted">
            {mode === 'login'
              ? 'Log in to open your saved reports and history.'
              : 'Your history and saved reports stay tied to your account.'}
          </p>

          <div className="seg" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'on' : ''}
              onClick={() => switchMode('login')}
            >
              Log in
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'on' : ''}
              onClick={() => switchMode('signup')}
            >
              Create account
            </button>
          </div>

          {err.form && (
            <p className="form-err" role="alert">
              {err.form}
            </p>
          )}

          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                autoComplete="name"
                value={f.name}
                onChange={set('name')}
                aria-invalid={!!err.name}
              />
              {err.name && <span className="fe">{err.name}</span>}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={f.email}
              onChange={set('email')}
              aria-invalid={!!err.email}
            />
            {err.email && <span className="fe">{err.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="pw">Password</label>
            <div className="pw">
              <input
                id="pw"
                type={show ? 'text' : 'password'}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                value={f.password}
                onChange={set('password')}
                aria-invalid={!!err.password}
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {err.password && <span className="fe">{err.password}</span>}
          </div>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Log in'
                : 'Create account'}
          </button>

          <div className="or">
            <span>or</span>
          </div>

          <button
            className="btn"
            type="button"
            onClick={withGoogle}
            disabled={loading}
          >
            Continue with Google
          </button>

          <button
            className="btn"
            type="button"
            onClick={() =>
              onDone({ name: 'Guest', email: '', guest: true })
            }
            disabled={loading}
          >
            Continue as guest
          </button>

          <p className="fine muted">
            Guest reports stay on this device only.
          </p>
        </form>
      </main>
    </div>
  )
}
