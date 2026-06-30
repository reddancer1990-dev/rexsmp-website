import { useState } from 'react'
import {
  CLOCK_STYLE_LABELS,
  LAYOUT_MODE_LABELS,
  WIDGET_LEFT_LABELS,
  WIDGET_RIGHT_LABELS,
  type CustomizeState,
} from '../../lib/customize'
import { downloadWallpaper, WALLPAPERS, WALLPAPER_PREVIEW_CLASS } from '../../lib/wallpapers'
import { downloadAllIcons, downloadIcon, ICON_PACK } from '../../lib/iconPack'
import { downloadLockScreen, shareLockScreen } from '../../lib/lockScreenExport'
import { BLACK_VISION_PRESET, THEME_PRESETS } from '../../lib/themePresets'
import { PhonePreview } from './PhonePreview'

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

const WALLPAPER_CATEGORIES = [
  { id: 'vision' as const, label: 'Black Vision' },
  { id: 'minimal' as const, label: 'Minimal B&W' },
  { id: 'rex' as const, label: 'RexNotes' },
]

export function CustomizeView({ state, onUpdate, onReset }: CustomizeViewProps) {
  const [section, setSection] = useState<Section>('preview')
  const [exporting, setExporting] = useState(false)

  const applyPreset = (presetState: CustomizeState) => {
    onUpdate({ ...presetState })
  }

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
          Full phone makeover — lock screen, home screen icons, and dark monochrome style.
        </p>
      </div>

      <div className="preset-hero preset-hero--black-vision">
        <div className="preset-hero-text">
          <span className="preset-badge">Featured</span>
          <h2>{BLACK_VISION_PRESET.name}</h2>
          <p>{BLACK_VISION_PRESET.tagline}</p>
          <p className="preset-desc">{BLACK_VISION_PRESET.description}</p>
        </div>
        <button
          type="button"
          className="action-btn preset-apply-btn"
          onClick={() => applyPreset(BLACK_VISION_PRESET.state)}
        >
          Apply full look
        </button>
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
            <PhonePreview state={state} />
            <div className="customize-preview-actions">
              <button type="button" className="action-btn" onClick={handleShare} disabled={exporting}>
                {exporting ? 'Exporting…' : 'Save lock screen'}
              </button>
              <button type="button" className="ghost-btn" onClick={() => downloadLockScreen(state)}>
                Download PNG
              </button>
              <button type="button" className="ghost-btn" onClick={() => downloadAllIcons()}>
                Download all icons
              </button>
            </div>
          </div>
        )}

        {section === 'wallpapers' && (
          <div className="customize-wallpapers">
            {WALLPAPER_CATEGORIES.map((cat) => {
              const items = WALLPAPERS.filter((w) => w.category === cat.id)
              if (items.length === 0) return null
              return (
                <div key={cat.id} className="wallpaper-group">
                  <h3>{cat.label}</h3>
                  <div className="wallpaper-grid">
                    {items.map((wp) => (
                      <button
                        key={wp.id}
                        type="button"
                        className={`wallpaper-card ${state.wallpaperId === wp.id ? 'selected' : ''}`}
                        onClick={() => onUpdate({ wallpaperId: wp.id, themePreset: 'custom' })}
                      >
                        <div className={WALLPAPER_PREVIEW_CLASS[wp.id]} aria-hidden />
                        <span className="wallpaper-name">{wp.name}</span>
                        <span className="wallpaper-desc">{wp.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
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
              <h3>Presets</h3>
              <div className="preset-chips">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={state.themePreset === preset.id ? 'active' : ''}
                    onClick={() => applyPreset(preset.state)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3>Lock screen layout</h3>
              <div className="option-chips">
                {(Object.keys(LAYOUT_MODE_LABELS) as CustomizeState['layoutMode'][]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={state.layoutMode === id ? 'active' : ''}
                    onClick={() => onUpdate({ layoutMode: id, themePreset: 'custom' })}
                  >
                    {LAYOUT_MODE_LABELS[id]}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3>Clock</h3>
              <div className="option-chips">
                {(Object.keys(CLOCK_STYLE_LABELS) as CustomizeState['clockStyle'][]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={state.clockStyle === id ? 'active' : ''}
                    onClick={() => onUpdate({ clockStyle: id, themePreset: 'custom' })}
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
                  onChange={(e) =>
                    onUpdate({ widgetLeft: e.target.value as CustomizeState['widgetLeft'], themePreset: 'custom' })
                  }
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
                  onChange={(e) =>
                    onUpdate({ widgetRight: e.target.value as CustomizeState['widgetRight'], themePreset: 'custom' })
                  }
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
                    onChange={(e) => onUpdate({ customQuote: e.target.value, themePreset: 'custom' })}
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
                  onChange={(e) => onUpdate({ accentColor: e.target.value, themePreset: 'custom' })}
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
              Carbon-dark icon pack for the Black Vision look. Tap to download, then use Shortcuts to set on Home Screen.
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
              RexNotes cannot change iOS directly — follow these steps to get the full Black Vision look on your iPhone.
            </div>

            <section className="guide-step">
              <span className="step-num">1</span>
              <div>
                <h3>Wallpaper (lock + home)</h3>
                <p>Tap <strong>Apply full look</strong> then <strong>Save lock screen</strong> or download the Black Vision wallpaper.</p>
                <p>Photos → image → Share → <strong>Use as Wallpaper</strong> → set for <strong>Lock Screen</strong> and <strong>Home Screen</strong>.</p>
              </div>
            </section>

            <section className="guide-step">
              <span className="step-num">2</span>
              <div>
                <h3>Lock screen style</h3>
                <p>Long-press lock screen → <strong>Customize</strong>.</p>
                <p>Pick the <strong>thin large clock</strong>, white color, and add small widgets below the time like in the preview.</p>
              </div>
            </section>

            <section className="guide-step">
              <span className="step-num">3</span>
              <div>
                <h3>Dark app icons</h3>
                <p>Download all icons from the <strong>Icons</strong> tab.</p>
                <p>Open <strong>Shortcuts</strong> → create shortcut → Open App → Add to Home Screen → pick the dark icon for each app.</p>
              </div>
            </section>

            <section className="guide-step">
              <span className="step-num">4</span>
              <div>
                <h3>Finish the look</h3>
                <p>Enable <strong>Dark Mode</strong> in Settings → Display.</p>
                <p>Use a minimal widget stack on home screen. Hide app names in Settings if you want the clean icon-only grid.</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
