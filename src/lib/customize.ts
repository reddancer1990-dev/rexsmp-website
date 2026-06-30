import type { WallpaperId } from './wallpapers'

export type ClockStyle = 'sf-rounded' | 'sf-thin' | 'sf-bold' | 'mono'
export type WidgetLeft = 'calendar' | 'weather' | 'grid' | 'none'
export type WidgetRight = 'hello' | 'signature' | 'quote' | 'none'
export type LayoutMode = 'classic' | 'ios27'
export type ThemePresetId = 'custom' | 'black-vision'

export interface CustomizeState {
  wallpaperId: WallpaperId
  clockStyle: ClockStyle
  showDate: boolean
  widgetLeft: WidgetLeft
  widgetRight: WidgetRight
  customQuote: string
  accentColor: string
  use24h: boolean
  layoutMode: LayoutMode
  themePreset: ThemePresetId
}

export const DEFAULT_CUSTOMIZE: CustomizeState = {
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
}

const STORAGE_KEY = 'rexnotes-customize'

export function loadCustomize(): CustomizeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CUSTOMIZE }
    return { ...DEFAULT_CUSTOMIZE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_CUSTOMIZE }
  }
}

export function saveCustomize(state: CustomizeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const CLOCK_STYLE_LABELS: Record<ClockStyle, string> = {
  'sf-rounded': 'Rounded',
  'sf-thin': 'Thin',
  'sf-bold': 'Bold',
  mono: 'Mono',
}

export const WIDGET_LEFT_LABELS: Record<WidgetLeft, string> = {
  calendar: 'Calendar',
  weather: 'Weather',
  grid: 'Grid',
  none: 'None',
}

export const WIDGET_RIGHT_LABELS: Record<WidgetRight, string> = {
  hello: 'Script hello',
  signature: 'Signature',
  quote: 'Custom text',
  none: 'None',
}

export const LAYOUT_MODE_LABELS: Record<LayoutMode, string> = {
  classic: 'Classic',
  ios27: 'Large clock (iOS style)',
}
