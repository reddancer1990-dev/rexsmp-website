export interface AppIconDef {
  id: string
  name: string
  glyph: string
  style: 'minimal' | 'rex' | 'black-vision'
}

export const ICON_PACK: AppIconDef[] = [
  { id: 'rexnotes', name: 'RexNotes', glyph: 'R', style: 'black-vision' },
  { id: 'safari', name: 'Safari', glyph: '◎', style: 'black-vision' },
  { id: 'messages', name: 'Messages', glyph: '◉', style: 'black-vision' },
  { id: 'phone', name: 'Phone', glyph: '☎', style: 'black-vision' },
  { id: 'mail', name: 'Mail', glyph: '✉', style: 'black-vision' },
  { id: 'camera', name: 'Camera', glyph: '◫', style: 'black-vision' },
  { id: 'photos', name: 'Photos', glyph: '❀', style: 'black-vision' },
  { id: 'music', name: 'Music', glyph: '♪', style: 'black-vision' },
  { id: 'settings', name: 'Settings', glyph: '⚙', style: 'black-vision' },
  { id: 'calendar', name: 'Calendar', glyph: '31', style: 'black-vision' },
  { id: 'maps', name: 'Maps', glyph: '⌖', style: 'black-vision' },
  { id: 'notes', name: 'Notes', glyph: '≡', style: 'black-vision' },
]

/** Icons shown on the home screen preview grid. */
export const HOME_SCREEN_ICONS: AppIconDef[] = ICON_PACK.slice(0, 12)

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
  } else if (icon.style === 'black-vision') {
    const g = ctx.createLinearGradient(0, 0, size, size * 0.6)
    g.addColorStop(0, '#1a1a1a')
    g.addColorStop(1, '#050505')
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

  ctx.fillStyle =
    icon.style === 'rex' ? '#fca5a5' : icon.style === 'black-vision' ? '#e8e8e8' : '#f0f0f0'
  ctx.font = `300 ${size * 0.36}px -apple-system, BlinkMacSystemFont, sans-serif`
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
