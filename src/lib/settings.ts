export interface AppSettings {
  fontSize: number
  fontFamily: 'system' | 'serif' | 'mono'
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentLight: string
  graphBg: string
  graphNode: string
  graphNodeActive: string
  graphEdge: string
  graphParticles: boolean
  animations: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 14,
  fontFamily: 'system',
  bgPrimary: '#120808',
  bgSecondary: '#1a0c0c',
  bgTertiary: '#0d0404',
  textPrimary: '#f5e6e6',
  textSecondary: '#c9a0a0',
  accent: '#dc2626',
  accentLight: '#f87171',
  graphBg: '#0a0202',
  graphNode: '#dc2626',
  graphNodeActive: '#fca5a5',
  graphEdge: '#7f1d1d',
  graphParticles: true,
  animations: true,
}

const STORAGE_KEY = 'rexnotes-settings'

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function applySettings(settings: AppSettings): void {
  const root = document.documentElement
  const fonts = {
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "'SF Mono', ui-monospace, Menlo, Monaco, monospace",
  }
  root.style.setProperty('--bg-primary', settings.bgPrimary)
  root.style.setProperty('--bg-secondary', settings.bgSecondary)
  root.style.setProperty('--bg-tertiary', settings.bgTertiary)
  root.style.setProperty('--text-primary', settings.textPrimary)
  root.style.setProperty('--text-secondary', settings.textSecondary)
  root.style.setProperty('--accent', settings.accent)
  root.style.setProperty('--accent-light', settings.accentLight)
  root.style.setProperty('--graph-bg', settings.graphBg)
  root.style.setProperty('--graph-node', settings.graphNode)
  root.style.setProperty('--graph-node-active', settings.graphNodeActive)
  root.style.setProperty('--graph-edge', settings.graphEdge)
  root.style.setProperty('--font-size-base', `${settings.fontSize}px`)
  root.style.setProperty('--font-body', fonts[settings.fontFamily])
  root.style.setProperty('--theme-color', settings.bgSecondary)
  root.dataset.animations = settings.animations ? 'on' : 'off'
}
