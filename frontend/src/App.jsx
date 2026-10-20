import { useEffect, useState } from 'react'
import AuthGate from './components/AuthGate'
import Workspace from './components/Workspace'
import { ToastProvider } from './components/Toasts'
import { useLocal } from './store'

const readSession = () => { try { return JSON.parse(sessionStorage.getItem('kaleido-session')) } catch { return null } }

export default function App() {
  // Session lives in sessionStorage, so opening the site in a fresh tab always shows the login page first.
  const [user, setUser] = useState(readSession)
  const [themePref, setThemePref] = useLocal('kaleido-theme', 'system')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const d = themePref === 'dark' || (themePref === 'system' && mq.matches)
      document.documentElement.dataset.theme = d ? 'dark' : 'light'
      setDark(d)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [themePref])

  const signIn = (u) => { sessionStorage.setItem('kaleido-session', JSON.stringify(u)); setUser(u) }
  const signOut = () => { sessionStorage.removeItem('kaleido-session'); setUser(null) }

  return (
    <ToastProvider>
      {user
        ? <Workspace key={user.email || 'guest'} user={user} onUpdateUser={signIn} onSignOut={signOut} themePref={themePref} setThemePref={setThemePref} dark={dark} />
        : <AuthGate onDone={signIn} />}
    </ToastProvider>
  )
}
