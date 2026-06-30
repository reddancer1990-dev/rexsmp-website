import { useEffect, useRef } from 'react'
import type { MobileView } from '../types'

interface MobileNavProps {
  active: MobileView
  highlighted: MobileView
  onChange: (view: MobileView) => void
}

const tabs: { id: MobileView; label: string; icon: string }[] = [
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'edit', label: 'Edit', icon: '✏️' },
  { id: 'preview', label: 'Preview', icon: '👁' },
  { id: 'graph', label: 'Graph', icon: '🕸' },
  { id: 'search', label: 'Search', icon: '🔍' },
]

export function MobileNav({ active, highlighted, onChange }: MobileNavProps) {
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const activeIndex = tabs.findIndex((t) => t.id === highlighted)

  useEffect(() => {
    const nav = navRef.current
    const indicator = indicatorRef.current
    if (!nav || !indicator || activeIndex < 0) return

    const tab = nav.children[activeIndex + 1] as HTMLElement | undefined
    if (!tab) return

    const navRect = nav.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    const left = tabRect.left - navRect.left + tabRect.width * 0.15
    const width = tabRect.width * 0.7

    indicator.style.transform = `translateX(${left}px)`
    indicator.style.width = `${width}px`
  }, [activeIndex, highlighted])

  return (
    <nav ref={navRef} className="mobile-nav" aria-label="Main navigation">
      <div ref={indicatorRef} className="nav-indicator" aria-hidden />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab ${highlighted === tab.id ? 'active' : ''} ${active === tab.id ? 'pressed' : ''}`}
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
