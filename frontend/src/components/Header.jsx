import { Search, Clock, Bookmark, Sun, Moon, Settings, LogOut, UserPlus } from 'lucide-react'
import Mark from './Mark'
import { Menu } from './bits'

const NAV = [['search', 'Search', Search], ['history', 'History', Clock], ['saved', 'Saved', Bookmark]]

export default function Header({ view, setView, user, dark, toggleTheme, onSignOut }) {
  return (
    <header className="top">
      <div className="brand">
        <Mark />
        <span className="wordmark">Kaleido</span>
        <span className="tagline">Multiple perspectives.<br />One informed decision.</span>
      </div>
      <nav className="nav" aria-label="Main">
        {NAV.map(([id, label, Icon]) => (
          <button key={id} className={view === id ? 'on' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}>
            <Icon size={16} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="tools">
        <button className="iconbtn" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Menu label="Account menu" trigger={<span className="avatar">{(user.name || 'G')[0].toUpperCase()}</span>}>
          <div className="who"><strong>{user.name}</strong><span className="muted">{user.guest ? 'Guest session' : user.email}</span></div>
          <button role="menuitem" onClick={() => setView('settings')}><Settings size={15} /> Profile and settings</button>
          <button role="menuitem" onClick={onSignOut}>{user.guest ? <><UserPlus size={15} /> Log in or create account</> : <><LogOut size={15} /> Log out</>}</button>
        </Menu>
      </div>
    </header>
  )
}
