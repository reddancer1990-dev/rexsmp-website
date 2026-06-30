export type WallpaperId = 'dunes' | 'mountains' | 'moon' | 'delta' | 'rex-dark' | 'rex-red'

export interface WallpaperDef {
  id: WallpaperId
  name: string
  category: 'minimal' | 'rex'
  description: string
}

export const WALLPAPERS: WallpaperDef[] = [
  { id: 'dunes', name: 'Dunes', category: 'minimal', description: 'Soft rolling sand dunes' },
  { id: 'mountains', name: 'Peaks', category: 'minimal', description: 'Layered mountain ridges' },
  { id: 'moon', name: 'Crescent', category: 'minimal', description: 'Bare branches & moon' },
  { id: 'delta', name: 'Delta', category: 'minimal', description: 'Organic river patterns' },
  { id: 'rex-dark', name: 'Rex Dark', category: 'rex', description: 'Deep charcoal gradient' },
  { id: 'rex-red', name: 'Rex Red', category: 'rex', description: 'Crimson vault glow' },
]

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.04) {
  const step = w * h > 200_000 ? 3 : 1
  const img = ctx.createImageData(w, h)
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const v = Math.random() * 255
      for (let dy = 0; dy < step && y + dy < h; dy++) {
        for (let dx = 0; dx < step && x + dx < w; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4
          img.data[i] = v
          img.data[i + 1] = v
          img.data[i + 2] = v
          img.data[i + 3] = alpha * 255
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)
}

/** CSS class for live preview — no canvas work on tab open. */
export const WALLPAPER_PREVIEW_CLASS: Record<WallpaperId, string> = {
  dunes: 'wp-preview wp-dunes',
  mountains: 'wp-preview wp-mountains',
  moon: 'wp-preview wp-moon',
  delta: 'wp-preview wp-delta',
  'rex-dark': 'wp-preview wp-rex-dark',
  'rex-red': 'wp-preview wp-rex-red',
}

function drawDunes(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45)
  sky.addColorStop(0, '#b8b8b8')
  sky.addColorStop(1, '#8a8a8a')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  const layers = [
    { y: 0.38, amp: 0.08, freq: 1.2, color: '#1a1a1a' },
    { y: 0.48, amp: 0.1, freq: 0.9, color: '#0f0f0f' },
    { y: 0.58, amp: 0.12, freq: 1.5, color: '#080808' },
    { y: 0.72, amp: 0.06, freq: 2.1, color: '#030303' },
  ]

  for (const layer of layers) {
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 4) {
      const t = x / w
      const y =
        h * layer.y +
        Math.sin(t * Math.PI * 2 * layer.freq) * h * layer.amp +
        Math.sin(t * Math.PI * 5 + 1) * h * layer.amp * 0.3
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = layer.color
    ctx.fill()
  }
  noise(ctx, w, h, 0.06)
}

function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, w, h)

  const ranges = [
    { base: 0.55, peaks: 5, height: 0.35, color: '#0a0a0a' },
    { base: 0.48, peaks: 4, height: 0.28, color: '#1a1a1a' },
    { base: 0.42, peaks: 6, height: 0.22, color: '#333' },
    { base: 0.38, peaks: 5, height: 0.18, color: '#555' },
    { base: 0.35, peaks: 4, height: 0.14, color: '#777' },
  ]

  for (const range of ranges) {
    ctx.beginPath()
    ctx.moveTo(0, h)
    const step = w / range.peaks
    for (let i = 0; i <= range.peaks; i++) {
      const x = i * step
      const peakH = h * (range.base - range.height * (0.6 + Math.random() * 0.4))
      if (i === 0) ctx.lineTo(x, h * range.base)
      ctx.lineTo(x + step * 0.5, peakH)
      ctx.lineTo(x + step, h * range.base)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = range.color
    ctx.fill()
  }

  const fog = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.55)
  fog.addColorStop(0, 'rgba(245,245,245,0)')
  fog.addColorStop(1, 'rgba(245,245,245,0.85)')
  ctx.fillStyle = fog
  ctx.fillRect(0, 0, w, h)
  noise(ctx, w, h, 0.05)
}

function drawMoon(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#6e6e6e'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#0a0a0a'
  ctx.lineWidth = Math.max(2, w * 0.008)
  ctx.lineCap = 'round'

  const branches = [
    { x: 0.15, y: 1, angle: -0.6, len: 0.55 },
    { x: 0.05, y: 0.7, angle: -0.3, len: 0.45 },
    { x: 0.85, y: 1, angle: -2.4, len: 0.5 },
    { x: 0.95, y: 0.65, angle: -2.8, len: 0.4 },
    { x: 0.5, y: 1, angle: -1.57, len: 0.35 },
  ]

  for (const b of branches) {
    drawBranchIter(ctx, w * b.x, h * b.y, b.angle, h * b.len)
  }

  const mx = w * 0.52
  const my = h * 0.38
  const mr = w * 0.045
  ctx.beginPath()
  ctx.arc(mx, my, mr, 0.3, Math.PI * 1.7)
  ctx.strokeStyle = '#f0f0f0'
  ctx.lineWidth = Math.max(1.5, w * 0.004)
  ctx.stroke()
}

/** Iterative branch drawing — safe on mobile (no recursion). */
function drawBranchIter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  let cx = x
  let cy = y
  let dir = angle
  const segments = 10
  for (let i = 0; i < segments; i++) {
    const segLen = length / segments
    dir += (Math.sin(i * 1.7) * 0.15)
    cx += Math.cos(dir) * segLen
    cy += Math.sin(dir) * segLen
    ctx.lineTo(cx, cy)
  }
  ctx.stroke()
}

function drawDelta(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#e8e8e8'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#0c0c0c'
  ctx.beginPath()
  ctx.moveTo(w * 0.1, 0)
  ctx.bezierCurveTo(w * 0.3, h * 0.15, w * 0.45, h * 0.35, w * 0.5, h * 0.55)
  ctx.bezierCurveTo(w * 0.55, h * 0.75, w * 0.4, h * 0.9, w * 0.25, h)
  ctx.lineTo(0, h)
  ctx.lineTo(0, 0)
  ctx.closePath()
  ctx.fill()

  for (let i = 0; i < 12; i++) {
    const sx = w * (0.35 + Math.random() * 0.3)
    const sy = h * (0.2 + Math.random() * 0.5)
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    const branches = 3 + Math.floor(Math.random() * 4)
    for (let b = 0; b < branches; b++) {
      const a = -Math.PI / 2 + (b / branches) * Math.PI + (Math.random() - 0.5) * 0.5
      const len = h * (0.05 + Math.random() * 0.12)
      ctx.lineTo(sx + Math.cos(a) * len, sy + Math.sin(a) * len)
      ctx.moveTo(sx, sy)
    }
    ctx.strokeStyle = '#111'
    ctx.lineWidth = Math.max(1, w * 0.003)
    ctx.stroke()
  }
  noise(ctx, w, h, 0.06)
}

function drawRexDark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w * 0.3, h)
  g.addColorStop(0, '#1a0a0a')
  g.addColorStop(0.5, '#0d0404')
  g.addColorStop(1, '#050202')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const glow = ctx.createRadialGradient(w * 0.5, h * 0.7, 0, w * 0.5, h * 0.7, w * 0.8)
  glow.addColorStop(0, 'rgba(220,38,38,0.08)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)
}

function drawRexRed(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#450a0a')
  g.addColorStop(0.4, '#1a0505')
  g.addColorStop(1, '#0a0202')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const glow = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, w * 0.6)
  glow.addColorStop(0, 'rgba(248,113,113,0.15)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)
}

const RENDERERS: Record<WallpaperId, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  dunes: drawDunes,
  mountains: drawMountains,
  moon: drawMoon,
  delta: drawDelta,
  'rex-dark': drawRexDark,
  'rex-red': drawRexRed,
}

export function renderWallpaper(
  ctx: CanvasRenderingContext2D,
  id: WallpaperId,
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height)
  RENDERERS[id](ctx, width, height)
}

export function wallpaperToDataUrl(id: WallpaperId, width = 390, height = 844): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  renderWallpaper(ctx, id, width, height)
  return canvas.toDataURL('image/png')
}

export function downloadWallpaper(id: WallpaperId, filename?: string): void {
  const url = wallpaperToDataUrl(id, 1170, 2532)
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? `rexnotes-${id}-wallpaper.png`
  a.click()
}
