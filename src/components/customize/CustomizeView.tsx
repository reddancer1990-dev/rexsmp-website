import { useMemo, useState } from 'react'
import {
  CLOCK_STYLE_LABELS,
  WIDGET_LEFT_LABELS,
  WIDGET_RIGHT_LABELS,
  type CustomizeState,
} from '../../lib/customize'
import { downloadWallpaper, WALLPAPERS, wallpaperToDataUrl } from '../../lib/wallpapers'
import { downloadAllIcons, downloadIcon, ICON_PACK } from '../../lib/iconPack'
import { downloadLockScreen, shareLockScreen } from '../../lib/lockScreenExport'
import { LockScreenPreview } from './LockScreenPreview'

type Section = 'preview' | 'wallpapers' | 'widgets' | 'icons' | 'apply'

interface CustomizeViewProps {
  state: CustomizeState
  onUpdate: (patch: Partial<CustomizeState>) => void
  onReset: () => void
}

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'preview', label: 'Preview' },
  { id: 'wallpapers', label: 'Wallpapers' },
  { id: 'widgets', label: 'Style' },
  { id: 'icons', label: 'Icons' },
  { id: 'apply', label: 'Apply' },
]

export function CustomizeView({ state, onUpdate, onReset }: CustomizeViewProps) {
  const [section, setSection] = useState<Section>('preview')
  const [exporting, setExporting] = useState(false)

  const thumbUrls = useMemo(() => {
    if (section !== 'wallpapers') return {} as Record<string, string>
    const map: Record<string, string> = {}
    for (const wp of WALLPAPERS) {
      map[wp.id] = wallpaperToDataUrl(wp.id, 120, 260)
    }
    return map
  }, [section])

  const handleShare = async () => {
    setExporting(true)
    try {
      await shareLockScreen(state)
    } catch {
      downloadLockScreen(state)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="customize-view">
      <div className="customize-header">
        <h1>Customize iPhone</h1>
        <p className="customize-sub">
          Build a minimalist lock screen, download wallpapers &amp; icon packs, then apply on iOS.
        </p>
      </div>

      <div className="customize-section-tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={section === s.id ? 'active' : ''}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="customize-body">
        {section === 'preview' && (
          <div className="customize-preview-section">
            <LockScreenPreview state={state} />
            <div className="customize-preview-actions">
              <button type="button" className="action-btn" onClick={handleShare} disabled={exporting}>
                {exporting ? 'Exporting…' : 'Save lock screen'}
              </button>
              <button type="button" className="ghost-btn" onClick={() => downloadLockScreen(state)}>
                Download PNG
              </button>
            </div>
          </div>
        )}

        {section === 'wallpapers' && (
          <div className="customize-wallpapers">
            {(['minimal', 'rex'] as const).map((cat) => (
              <div key={cat} className="wallpaper-group">
                <h3>{cat === 'minimal' ? 'Minimal B&amp;W' : 'RexNotes themes'}</h3>
                <div className="wallpaper-grid">
                  {WALLPAPERS.filter((w) => w.category === cat).map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      className={`wallpaper-card ${state.wallpaperId === wp.id ? 'selected' : ''}`}
                      onClick={() => onUpdate({ wallpaperId: wp.id })}
                    >
                      <img src={thumbUrls[wp.id]} alt="" />
                      <span className="wallpaper-name">{wp.name}</span>
                      <span className="wallpaper-desc">{wp.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="ghost-btn full-width"
              onClick={() => downloadWallpaper(state.wallpaperId)}
            >
              Download wallpaper only
            </button>
          </div>
        )}

        {section === 'widgets' && (
          <div className="customize-options">
            <section>
              <h3>Clock</h3>
              <div className="option-chips">
                {(Object.keys(CLOCK_STYLE_LABELS) as CustomizeState['clockStyle'][]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={state.clockStyle === id ? 'active' : ''}
                    onClick={() => onUpdate({ clockStyle: id })}
                  >
                    {CLOCK_STYLE_LABELS[id]}
                  </button>
                ))}
              </div>
              <label className="toggle-row">
                <span>24-hour time</span>
                <input
                  type="checkbox"
                  checked={state.use24h}
                  onChange={(e) => onUpdate({ use24h: e.target.checked })}
                />
              </label>
              <label className="toggle-row">
                <span>Show date</span>
                <input
                  type="checkbox"
                  checked={state.showDate}
                  onChange={(e) => onUpdate({ showDate: e.target.checked })}
                />
              </label>
            </section>

            <section>
              <h3>Widgets</h3>
              <label className="settings-field">
                <span>Left widget</span>
                <select
                  value={state.widgetLeft}
                  onChange={(e) => onUpdate({ widgetLeft: e.target.value as CustomizeState['widgetLeft'] })}
                >
                  {Object.entries(WIDGET_LEFT_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="settings-field">
                <span>Right widget</span>
                <select
                  value={state.widgetRight}
                  onChange={(e) => onUpdate({ widgetRight: e.target.value as CustomizeState['widgetRight'] })}
                >
                  {Object.entries(WIDGET_RIGHT_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              {state.widgetRight === 'quote' && (
                <label className="settings-field">
                  <span>Custom text</span>
                  <input
                    type="text"
                    value={state.customQuote}
                    maxLength={24}
                    onChange={(e) => onUpdate({ customQuote: e.target.value })}
                  />
                </label>
              )}
            </section>

            <section>
              <h3>Accent</h3>
              <label className="settings-field color-field">
                <span>Lock screen text</span>
                <input
                  type="color"
                  value={state.accentColor}
                  onChange={(e) => onUpdate({ accentColor: e.target.value })}
                />
                <span className="color-hex">{state.accentColor}</span>
              </label>
            </section>

            <button type="button" className="ghost-btn" onClick={onReset}>
              Reset to defaults
            </button>
          </div>
        )}

        {section === 'icons' && (
          <div className="customize-icons">
            <p className="customize-hint">
              Minimal dark icon pack matching your lock screen. Download individually or grab the full set.
            </p>
            <div className="icon-grid">
              {ICON_PACK.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  className="icon-card"
                  onClick={() => downloadIcon(icon)}
                >
                  <span className={`icon-preview icon-preview--${icon.style}`}>{icon.glyph}</span>
                  <span>{icon.name}</span>
                </button>
              ))}
            </div>
            <button type="button" className="action-btn full-width" onClick={() => downloadAllIcons()}>
              Download all icons
            </button>
          </div>
        )}

        {section === 'apply' && (
          <div className="customize-guide">
            <div className="guide-note">
              RexNotes runs in Safari — it cannot change your iPhone system settings directly.
              Follow these steps to apply your design on iOS.
            </div>

            <section className="guide-step">
              <span className="step-num">1</span>
              <div>
                <h3>Set wallpaper</h3>
                <p>Tap <strong>Save lock screen</strong> on the Preview tab (or download wallpaper only).</p>
                <p>Open Photos → select the image → Share → <strong>Use as Wallpaper</strong> → Lock Screen.</p>
              </div>
            </section>

            <section className="guide-step">
              <span className="step-num">2</span>
              <div>
                <h3>Customize lock screen</h3>
                <p>Long-press the lock screen → <strong>Customize</strong> → match clock font &amp; widget layout to your preview.</p>
                <p>Use white/minimal widgets for the clean look shown in your reference photos.</p>
              </div>
            </section>

            <section className="guide-step">
              <span className="step-num">3</span>
              <div>
                <h3>Custom app icons</h3>
                <p>Download icons from the Icons tab. Then open the <strong>Shortcuts</strong> app.</p>
                <p>Create a shortcut: Open App → pick app → Add to Home Screen → choose your downloaded icon.</p>
              </div>
            </section>

            <section className="guide-step">
              <span className="step-num">4</span>
              <div>
                <h3>Add RexNotes to Home Screen</h3>
                <p>In Safari, tap Share → <strong>Add to Home Screen</strong>. Use the RexNotes icon from the pack for a matching look.</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
