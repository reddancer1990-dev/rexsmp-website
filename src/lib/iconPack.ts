export interface AppIconDef {
  id: string
  name: string
  /** SVG path(s) or emoji fallback rendered inside icon */
  glyph: string
  style: 'minimal' | 'rex'
}

export const ICON_PACK: AppIconDef[] = [
  { id: 'rexnotes', name: 'RexNotes', glyph: 'R', style: 'rex' },
  { id: 'safari', name: 'Safari', glyph: '◎', style: 'minimal' },
  { id: 'messages', name: 'Messages', glyph: '◉', style: 'minimal' },
  { id: 'phone', name: 'Phone', glyph: '☎', style: 'minimal' },
  { id: 'mail', name: 'Mail', glyph: '✉', style: 'minimal' },
  { id: 'camera', name: 'Camera', glyph: '◫', style: 'minimal' },
  { id: 'photos', name: 'Photos', glyph: '❀', style: 'minimal' },
  { id: 'music', name: 'Music', glyph: '♪', style: 'minimal' },
  { id: 'settings', name: 'Settings', glyph: '⚙', style: 'minimal' },
  { id: 'calendar', name: 'Calendar', glyph: '31', style: 'minimal' },
  { id: 'maps', name: 'Maps', glyph: '⌖', style: 'minimal' },
  { id: 'notes', name: 'Notes', glyph: '≡', style: 'minimal' },
]

function renderIconCanvas(icon: AppIconDef, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const r = size * 0.22

  if (icon.style === 'rex') {
    const g = ctx.createLinearGradient(0, 0, size, size)
    g.addColorStop(0, '#991b1b')
    g.addColorStop(1, '#450a0a')
    ctx.fillStyle = g
  } else {
    ctx.fillStyle = '#1a1a1a'
  }

  roundRect(ctx, 0, 0, size, size, r)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = size * 0.01
  roundRect(ctx, size * 0.02, size * 0.02, size * 0.96, size * 0.96, r * 0.9)
  ctx.stroke()

  ctx.fillStyle = icon.style === 'rex' ? '#fca5a5' : '#f0f0f0'
  ctx.font = `600 ${size * 0.38}px -apple-system, BlinkMacSystemFont, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(icon.glyph, size / 2, size / 2 + size * 0.02)

  return canvas
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function iconToDataUrl(icon: AppIconDef, size = 180): string {
  return renderIconCanvas(icon, size).toDataURL('image/png')
}

export function downloadIcon(icon: AppIconDef): void {
  const url = iconToDataUrl(icon, 1024)
  const a = document.createElement('a')
  a.href = url
  a.download = `rexnotes-icon-${icon.id}.png`
  a.click()
}

export async function downloadAllIcons(): Promise<void> {
  for (const icon of ICON_PACK) {
    downloadIcon(icon)
    await new Promise((r) => setTimeout(r, 300))
  }
}
