import { useEffect, useState } from 'react'
import type { CustomizeState } from '../../lib/customize'
import { WALLPAPER_PREVIEW_CLASS } from '../../lib/wallpapers'

interface LockScreenPreviewProps {
  state: CustomizeState
  compact?: boolean
  embedded?: boolean
}

function formatTime(date: Date, use24h: boolean): string {
  if (use24h) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  const h = date.getHours() % 12 || 12
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function LockScreenPreview({ state, compact, embedded }: LockScreenPreviewProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const clockClass = `lock-clock lock-clock--${state.clockStyle}`
  const layoutClass = state.layoutMode === 'ios27' ? 'lock-content--ios27' : ''
  const wallpaperClass = WALLPAPER_PREVIEW_CLASS[state.wallpaperId]

  const inner = (
    <div className={`iphone-screen ${wallpaperClass}`}>
      <div className={`lock-content ${layoutClass}`} style={{ color: state.accentColor }}>
        {state.showDate && <div className="lock-date">{formatDate(now)}</div>}
        <div className={clockClass}>{formatTime(now, state.use24h)}</div>
        <div className="lock-widgets">
          {state.widgetLeft !== 'none' && (
            <div className={`lock-widget lock-widget--${state.widgetLeft}`} aria-hidden />
          )}
          {state.widgetRight !== 'none' && (
            <div className={`lock-widget lock-widget--${state.widgetRight}`}>
              {state.widgetRight === 'quote' ? state.customQuote.slice(0, 16) : null}
            </div>
          )}
        </div>
        <div className="lock-shortcuts">
          <span className="lock-shortcut" aria-hidden />
          <span className="lock-shortcut" aria-hidden />
        </div>
        <div className="lock-home-bar" aria-hidden />
      </div>
    </div>
  )

  if (embedded) return inner

  return (
    <div className={`iphone-frame ${compact ? 'iphone-frame--compact' : ''}`}>
      <div className="iphone-bezel">
        <div className="iphone-island" aria-hidden />
        {inner}
      </div>
    </div>
  )
}
