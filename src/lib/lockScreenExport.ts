import type { CustomizeState } from './customize'
import { renderWallpaper, type WallpaperId } from './wallpapers'

const EXPORT_W = 1170
const EXPORT_H = 2532

function clockFont(style: CustomizeState['clockStyle'], size: number): string {
  const map = {
    'sf-rounded': `600 ${size}px -apple-system, BlinkMacSystemFont, 'SF Pro Rounded', sans-serif`,
    'sf-thin': `100 ${size}px -apple-system, BlinkMacSystemFont, sans-serif`,
    'sf-bold': `700 ${size}px -apple-system, BlinkMacSystemFont, sans-serif`,
    mono: `500 ${size}px 'SF Mono', ui-monospace, Menlo, monospace`,
  }
  return map[style]
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

function drawWidgetLeft(ctx: CanvasRenderingContext2D, type: CustomizeState['widgetLeft'], x: number, y: number, size: number, color: string) {
  if (type === 'none') return
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.85

  if (type === 'calendar') {
    const cell = size / 5
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.strokeRect(x + c * cell, y + r * cell, cell - 2, cell - 2)
      }
    }
  } else if (type === 'weather') {
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, size * 0.25, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + size * 0.2, y + size * 0.65)
    ctx.quadraticCurveTo(x + size / 2, y + size * 0.45, x + size * 0.8, y + size * 0.65)
    ctx.stroke()
  } else if (type === 'grid') {
    const cell = size / 3
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = color
        ctx.globalAlpha = 0.3 + Math.random() * 0.5
        ctx.fillRect(x + c * cell + 1, y + r * cell + 1, cell - 2, cell - 2)
      }
    }
  }
  ctx.globalAlpha = 1
}

function drawWidgetRight(
  ctx: CanvasRenderingContext2D,
  type: CustomizeState['widgetRight'],
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  if (type === 'none') return
  ctx.fillStyle = color
  ctx.globalAlpha = 0.9

  if (type === 'hello' || type === 'signature') {
    ctx.font = `italic 400 ${h * 0.55}px 'Snell Roundhand', 'Segoe Script', cursive`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(type === 'hello' ? 'hello' : 'Rex', x + w / 2, y + h / 2)
  } else if (type === 'quote') {
    ctx.font = `400 ${h * 0.35}px -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text.slice(0, 24), x + w / 2, y + h / 2)
  }
  ctx.globalAlpha = 1
}

export function renderLockScreen(
  state: CustomizeState,
  width = EXPORT_W,
  height = EXPORT_H,
  date = new Date(),
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const scale = width / 390

  renderWallpaper(ctx, state.wallpaperId as WallpaperId, width, height)

  const color = state.accentColor
  ctx.fillStyle = color
  ctx.textAlign = 'center'

  const isIos27 = state.layoutMode === 'ios27'
  const dateY = height * (isIos27 ? 0.11 : 0.14)
  const clockSize = (isIos27 ? 108 : 86) * scale
  const clockY = height * (isIos27 ? 0.165 : 0.22)
  const widgetY = height * (isIos27 ? 0.235 : 0.26)

  if (state.showDate) {
    ctx.font = `400 ${(isIos27 ? 20 : 22) * scale}px -apple-system, BlinkMacSystemFont, sans-serif`
    ctx.globalAlpha = 0.85
    ctx.fillText(formatDate(date), width / 2, dateY)
    ctx.globalAlpha = 1
  }

  ctx.font = clockFont(state.clockStyle, clockSize)
  ctx.fillText(formatTime(date, state.use24h), width / 2, clockY)

  const widgetSize = 44 * scale
  const gap = 12 * scale
  const totalW = widgetSize * 2 + gap
  const startX = (width - totalW) / 2

  drawWidgetLeft(ctx, state.widgetLeft, startX, widgetY, widgetSize, color)
  drawWidgetRight(ctx, state.widgetRight, state.customQuote, startX + widgetSize + gap, widgetY, widgetSize, widgetSize, color)

  ctx.globalAlpha = 0.9
  ctx.strokeStyle = color
  ctx.lineWidth = 2 * scale
  const iconR = 22 * scale
  const iconY = height * 0.92
  ctx.beginPath()
  ctx.arc(width * 0.12, iconY, iconR, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(width * 0.88, iconY, iconR, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = color
  ctx.globalAlpha = 0.5
  roundRect(ctx, width / 2 - 60 * scale, height * 0.97, 120 * scale, 5 * scale, 3 * scale)
  ctx.fill()
  ctx.globalAlpha = 1

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

export function downloadLockScreen(state: CustomizeState): void {
  const canvas = renderLockScreen(state)
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'rexnotes-lock-screen.png'
  a.click()
}

export function shareLockScreen(state: CustomizeState): Promise<void> {
  return new Promise((resolve, reject) => {
    const canvas = renderLockScreen(state)
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Could not create image'))
        return
      }
      const file = new File([blob], 'rexnotes-lock-screen.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'RexNotes lock screen' })
          resolve()
        } catch (e) {
          reject(e)
        }
      } else {
        downloadLockScreen(state)
        resolve()
      }
    }, 'image/png')
  })
}
