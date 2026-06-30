import type { AppSettings } from '../lib/settings'

interface SettingsPanelProps {
  settings: AppSettings
  onUpdate: (patch: Partial<AppSettings>) => void
  onReset: () => void
  onClose: () => void
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="settings-field color-field">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      <span className="color-hex">{value}</span>
    </label>
  )
}

export function SettingsPanel({ settings, onUpdate, onReset, onClose }: SettingsPanelProps) {
  return (
    <div className="modal-overlay settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>RexNotes Settings</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="settings-body">
          <section>
            <h3>Typography</h3>
            <label className="settings-field">
              <span>Text size</span>
              <input
                type="range"
                min={11}
                max={20}
                value={settings.fontSize}
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              />
              <span className="range-val">{settings.fontSize}px</span>
            </label>
            <label className="settings-field">
              <span>Font</span>
              <select
                value={settings.fontFamily}
                onChange={(e) => onUpdate({ fontFamily: e.target.value as AppSettings['fontFamily'] })}
              >
                <option value="system">System</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </label>
          </section>

          <section>
            <h3>App colors</h3>
            <ColorField label="Background" value={settings.bgPrimary} onChange={(v) => onUpdate({ bgPrimary: v })} />
            <ColorField label="Panels" value={settings.bgSecondary} onChange={(v) => onUpdate({ bgSecondary: v })} />
            <ColorField label="Text" value={settings.textPrimary} onChange={(v) => onUpdate({ textPrimary: v })} />
            <ColorField label="Muted text" value={settings.textSecondary} onChange={(v) => onUpdate({ textSecondary: v })} />
            <ColorField label="Accent" value={settings.accent} onChange={(v) => onUpdate({ accent: v })} />
            <ColorField label="Accent light" value={settings.accentLight} onChange={(v) => onUpdate({ accentLight: v })} />
          </section>

          <section>
            <h3>Graph</h3>
            <ColorField label="Graph background" value={settings.graphBg} onChange={(v) => onUpdate({ graphBg: v })} />
            <ColorField label="Node color" value={settings.graphNode} onChange={(v) => onUpdate({ graphNode: v })} />
            <ColorField label="Active node" value={settings.graphNodeActive} onChange={(v) => onUpdate({ graphNodeActive: v })} />
            <ColorField label="Link color" value={settings.graphEdge} onChange={(v) => onUpdate({ graphEdge: v })} />
            <label className="settings-field toggle-field">
              <span>Particle effects</span>
              <input
                type="checkbox"
                checked={settings.graphParticles}
                onChange={(e) => onUpdate({ graphParticles: e.target.checked })}
              />
            </label>
          </section>

          <section>
            <h3>Effects</h3>
            <label className="settings-field toggle-field">
              <span>Animations</span>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => onUpdate({ animations: e.target.checked })}
              />
            </label>
          </section>
        </div>

        <div className="settings-footer">
          <button type="button" className="action-btn secondary" onClick={onReset}>
            Reset defaults
          </button>
          <button type="button" className="action-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
