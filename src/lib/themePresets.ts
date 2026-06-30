import type { CustomizeState } from './customize'

export interface ThemePreset {
  id: string
  name: string
  tagline: string
  description: string
  /** Inspired-by note for the user */
  inspiration: string
  state: CustomizeState
}

/** Monochrome iOS setup — mountain depth + reflection + dark icons (iTheme Design style). */
export const BLACK_VISION_PRESET: ThemePreset = {
  id: 'black-vision',
  name: 'Black Vision',
  tagline: 'Monochrome · Mountain depth · Dark UI',
  description: 'Large thin clock, reflection wallpaper, minimal widgets, and carbon-dark home screen icons.',
  inspiration: 'Inspired by monochrome iOS setups with reflection wallpapers and depth lock screens.',
  state: {
    wallpaperId: 'black-vision',
    clockStyle: 'sf-thin',
    showDate: true,
    widgetLeft: 'grid',
    widgetRight: 'hello',
    customQuote: 'hello',
    accentColor: '#ffffff',
    use24h: false,
    layoutMode: 'ios27',
    themePreset: 'black-vision',
  },
}

export const THEME_PRESETS: ThemePreset[] = [BLACK_VISION_PRESET]

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id)
}
