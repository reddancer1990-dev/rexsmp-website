import type { MobileView } from '../types'

interface MobileNavProps {
  active: MobileView
  onChange: (view: MobileView) => void
}

const tabs: { id: MobileView; label: string; icon: string }[] = [
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'edit', label: 'Edit', icon: '✏️' },
  { id: 'preview', label: 'Preview', icon: '👁' },
  { id: 'graph', label: 'Graph', icon: '🕸' },
  { id: 'search', label: 'Search', icon: '🔍' },
]

export function MobileNav({ active, onChange }: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-icon" aria-hidden>
            {tab.icon}
          </span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
