import { useState } from 'react'
import { useToast } from './Toasts'

export default function SettingsPage({ user, onUpdateUser, themePref, setThemePref, prefs, setPrefs, onClearHistory, onClearSaved, onSignOut }) {
  const toast = useToast()
  const [name, setName] = useState(user.name)

  const saveName = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return toast('Enter a name with at least 2 characters.')
    try {
      const list = JSON.parse(localStorage.getItem('kaleido-users')) || []
      localStorage.setItem('kaleido-users', JSON.stringify(list.map((u) => (u.email === user.email ? { ...u, name: name.trim() } : u))))
    } catch {}
    onUpdateUser({ ...user, name: name.trim() })
    toast('Profile updated.')
  }
  const sure = (msg, fn, done) => { if (window.confirm(msg)) { fn(); toast(done) } }

  return (
    <main className="settings">
      <h2>Profile and settings</h2>

      <section>
        <h3>Profile</h3>
        {user.guest ? (
          <>
            <p className="muted">You are using Kaleido as a guest. Reports are kept on this device only.</p>
            <button className="btn primary" onClick={onSignOut}>Log in or create account</button>
          </>
        ) : (
          <form onSubmit={saveName} className="row-form">
            <div className="field"><label htmlFor="pn">Name</label><input id="pn" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label htmlFor="pe">Email</label><input id="pe" value={user.email} disabled /></div>
            <button className="btn primary">Save profile</button>
          </form>
        )}
      </section>

      <section>
        <h3>Appearance</h3>
        <div className="seg" role="radiogroup" aria-label="Theme">
          {[['light', 'Light'], ['dark', 'Dark'], ['system', 'Match device']].map(([v, l]) => (
            <button key={v} role="radio" aria-checked={themePref === v} className={themePref === v ? 'on' : ''} onClick={() => setThemePref(v)}>{l}</button>
          ))}
        </div>
      </section>

      <section>
        <h3>Search defaults</h3>
        <div className="row-form">
          <div className="field">
            <label htmlFor="ds">Source scope</label>
            <select id="ds" value={prefs.scope} onChange={(e) => setPrefs({ ...prefs, scope: e.target.value })}>
              <option value="all">All sources</option><option value="news">News only</option><option value="research">Research only</option><option value="academic">Academic only</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="dd">Passages to retrieve</label>
            <select id="dd" value={prefs.depth} onChange={(e) => setPrefs({ ...prefs, depth: +e.target.value })}>
              {[5, 10, 15, 20, 25, 30].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <label className="check"><input type="checkbox" checked={prefs.hybrid} onChange={(e) => setPrefs({ ...prefs, hybrid: e.target.checked })} /> Combine keyword and semantic search</label>
        </div>
        <p className="muted">New searches start with these values. Reload the Search page to see them in the form.</p>
      </section>

      <section>
        <h3>Your data</h3>
        <div className="row-form">
          <button className="btn" onClick={() => sure('Delete all history on this device?', onClearHistory, 'History cleared.')}>Clear history</button>
          <button className="btn" onClick={() => sure('Remove all saved reports?', onClearSaved, 'Saved reports removed.')}>Remove saved reports</button>
          {!user.guest && <button className="btn" onClick={onSignOut}>Log out</button>}
        </div>
      </section>
    </main>
  )
}
