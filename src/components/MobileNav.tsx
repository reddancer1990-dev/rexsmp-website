import { useEffect, useRef } from 'react'
import type { MobileView } from '../types'
import { NavIcon } from './Icons'

interface MobileNavProps {
  highlighted: MobileView
  onChange: (view: MobileView) => void
}

const tabs: { id: MobileView; label: string }[] = [
  { id: 'files', label: 'Files' },
  { id: 'edit', label: 'Edit' },
  { id: 'preview', label: 'Read' },
  { id: 'graph', label: 'Graph' },
  { id: 'settings', label: 'Settings' },
]

export function MobileNav({ highlighted, onChange }: MobileNavProps) {
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
    indicator.style.transform = `translateX(${tabRect.left - navRect.left + tabRect.width * 0.2}px)`
    indicator.style.width = `${tabRect.width * 0.6}px`
  }, [activeIndex, highlighted])

  return (
    <nav ref={navRef} className="mobile-nav" aria-label="Main navigation">
      <div ref={indicatorRef} className="nav-indicator" aria-hidden />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab ${highlighted === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <NavIcon tab={tab.id} className="nav-svg" />
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
