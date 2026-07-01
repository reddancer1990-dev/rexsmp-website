export interface DarkIconDef {
  id: string
  name: string
  label: string
}

export const DARK_ICON_APPS: DarkIconDef[] = [
  { id: 'safari', name: 'Safari', label: 'Safari' },
  { id: 'phone', name: 'Phone', label: 'Phone' },
  { id: 'messages', name: 'Messages', label: 'Messages' },
  { id: 'whatsapp', name: 'WhatsApp', label: 'WhatsApp' },
  { id: 'chatgpt', name: 'ChatGPT', label: 'ChatGPT' },
  { id: 'cursor', name: 'Cursor AI', label: 'Cursor' },
  { id: 'vercel', name: 'Vercel', label: 'Vercel' },
  { id: 'code', name: 'Code', label: 'Code' },
  { id: 'reddit', name: 'Reddit', label: 'Reddit' },
  { id: 'pinterest', name: 'Pinterest', label: 'Pinterest' },
  { id: 'tiktok', name: 'TikTok', label: 'TikTok' },
  { id: 'discord', name: 'Discord', label: 'Discord' },
  { id: 'soundcloud', name: 'SoundCloud', label: 'SoundCloud' },
  { id: 'music', name: 'Music', label: 'Music' },
  { id: 'contacts', name: 'Contacts', label: 'Contacts' },
  { id: 'mail', name: 'Mail', label: 'Mail' },
  { id: 'camera', name: 'Camera', label: 'Camera' },
  { id: 'photos', name: 'Photos', label: 'Photos' },
  { id: 'settings', name: 'Settings', label: 'Settings' },
  { id: 'notes', name: 'Notes', label: 'Notes' },
  { id: 'rexnotes', name: 'RexNotes', label: 'RexNotes' },
]

/** Glyphs centered on 0,0 in a 56×56 box — rendered inside translate(50,50). */
const GLYPHS: Record<string, string> = {
  safari: `
    <circle cx="0" cy="0" r="22" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <path d="M0,-14 L5,8 L0,3 L-5,8 Z" fill="#ffffff"/>
    <circle cx="0" cy="0" r="2.5" fill="#ffffff"/>`,

  phone: `
    <rect x="-11" y="-20" width="22" height="40" rx="4" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <line x1="-4" y1="16" x2="4" y2="16" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>`,

  messages: `
    <path d="M-20,-14 H20 A6,6 0 0 1 26,-8 V8 A6,6 0 0 1 20,14 H-4 L-14,22 V14 H-20 A6,6 0 0 1 -26,8 V-8 A6,6 0 0 1 -20,-14 Z"
      fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linejoin="round"/>`,

  whatsapp: `
    <path d="M-20,-14 H20 A6,6 0 0 1 26,-8 V8 A6,6 0 0 1 20,14 H-4 L-14,22 V14 H-20 A6,6 0 0 1 -26,8 V-8 A6,6 0 0 1 -20,-14 Z"
      fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M-8,-2 A10,10 0 1 1 8,10 L12,14 L10,8 A10,10 0 0 0 -8,-2 Z"
      fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linejoin="round"/>`,

  chatgpt: `
    <path d="M0,-22 C-14,-22 -22,-12 -22,0 C-22,8 -18,14 -12,18 L-14,24 L-6,21 C-4,21 -2,22 0,22 C14,22 22,12 22,0 C22,-12 14,-22 0,-22 Z"
      fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M-10,0 H10 M0,-10 V10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.45"/>`,

  /** Cursor AI — isometric 3D prism (IDE logo, not a mouse pointer). */
  cursor: `
    <polygon points="0,-18 16,-8 16,12 0,22 -16,12 -16,-8" fill="#888888"/>
    <polygon points="0,-18 16,-8 0,2 -16,-8" fill="#ffffff"/>
    <polygon points="0,2 16,-8 16,12 0,22" fill="#e8e8e8"/>
    <polygon points="0,2 -16,-8 -16,12 0,22" fill="#c8c8c8"/>`,

  vercel: `
    <polygon points="0,-22 20,22 -20,22" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linejoin="round"/>
    <polygon points="0,-8 12,16 -12,16" fill="#ffffff" opacity="0.9"/>`,

  code: `
    <path d="M-10,-16 L-22,0 L-10,16" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-16 L22,0 L10,16" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="6" y1="-20" x2="-2" y2="20" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>`,

  reddit: `
    <circle cx="0" cy="2" r="18" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <circle cx="-7" cy="-2" r="3.5" fill="#ffffff"/>
    <circle cx="7" cy="-2" r="3.5" fill="#ffffff"/>
    <path d="M-8,8 Q0,14 8,8" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="-12" cy="-16" r="4" fill="none" stroke="#ffffff" stroke-width="2.4"/>
    <circle cx="12" cy="-16" r="4" fill="none" stroke="#ffffff" stroke-width="2.4"/>
    <line x1="-8" y1="-16" x2="8" y2="-16" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>`,

  pinterest: `
    <circle cx="0" cy="0" r="22" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <path d="M0,-14 C-8,-14 -14,-8 -14,0 C-14,6 -10,11 -4,13 C-5,9 -4,4 0,0 C4,4 8,4 10,0 C12,-4 10,-10 4,-12 C2,-13 1,-14 0,-14 Z" fill="#ffffff"/>`,

  tiktok: `
    <path d="M10,-20 V8 A10,10 0 1 1 -2,8" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <path d="M10,-20 C14,-16 18,-14 22,-14" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`,

  discord: `
    <path d="M-22,-8 C-12,-14 0,-16 0,-16 S12,-14 22,-8 C22,-8 28,6 28,18 C28,18 22,24 14,26 L10,20 C2,22 -2,22 -10,20 L-14,26 C-22,24 -28,18 -28,18 C-28,6 -22,-8 -22,-8 Z"
      fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>
    <circle cx="-8" cy="6" r="4" fill="#ffffff"/>
    <circle cx="8" cy="6" r="4" fill="#ffffff"/>`,

  soundcloud: `
    <path d="M-22,12 C-22,2 -14,-6 -4,-6 C0,-6 4,-4 6,-2 C8,-10 16,-16 26,-16 C36,-16 44,-8 44,2 C44,6 43,9 41,12"
      fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-18" y1="12" x2="-18" y2="0" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <line x1="-12" y1="12" x2="-12" y2="-6" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <line x1="-6" y1="12" x2="-6" y2="-10" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="12" x2="0" y2="-4" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`,

  music: `
    <line x1="12" y1="-18" x2="12" y2="10" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="12" y1="-18" x2="-6" y2="-10" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-6" y1="-10" x2="-6" y2="10" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="-6" cy="14" r="5" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <circle cx="12" cy="6" r="5" fill="none" stroke="#ffffff" stroke-width="2.8"/>`,

  contacts: `
    <circle cx="0" cy="-8" r="10" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <path d="M-18,18 C-18,4 -8,-4 0,-4 S18,4 18,18" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>`,

  mail: `
    <rect x="-22" y="-12" width="44" height="30" rx="4" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <path d="M-22,-8 L0,8 L22,-8" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linejoin="round"/>`,

  camera: `
    <rect x="-20" y="-10" width="40" height="28" rx="4" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <circle cx="0" cy="4" r="9" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <circle cx="14" cy="-4" r="2.5" fill="#ffffff"/>`,

  photos: `
    <rect x="-20" y="-14" width="40" height="32" rx="4" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <circle cx="-8" cy="-2" r="3.5" fill="#ffffff"/>
    <path d="M-20,12 L-6,0 L4,10 L12,2 L20,12" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linejoin="round"/>`,

  settings: `
    <circle cx="0" cy="0" r="8" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <line x1="0" y1="-20" x2="0" y2="-12" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="0" y1="12" x2="0" y2="20" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-20" y1="0" x2="-12" y2="0" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="12" y1="0" x2="20" y2="0" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-14" y1="-14" x2="-9" y2="-9" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="9" y1="9" x2="14" y2="14" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-14" y1="14" x2="-9" y2="9" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="9" y1="-9" x2="14" y2="-14" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>`,

  notes: `
    <rect x="-16" y="-20" width="32" height="40" rx="4" fill="none" stroke="#ffffff" stroke-width="2.8"/>
    <line x1="-8" y1="-8" x2="8" y2="-8" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-8" y1="2" x2="8" y2="2" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-8" y1="12" x2="4" y2="12" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round"/>`,

  rexnotes: `
    <rect x="-16" y="-20" width="32" height="40" rx="4" fill="none" stroke="#f87171" stroke-width="2.8"/>
    <text x="0" y="-4" text-anchor="middle" fill="#f87171" font-size="16" font-family="system-ui,sans-serif" font-weight="700">R</text>
    <line x1="-8" y1="6" x2="8" y2="6" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="-8" y1="14" x2="4" y2="14" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>`,
}

function uid(id: string): string {
  return id.replace(/[^a-z0-9]/gi, '')
}

export function buildFullIconSvg(id: string, size = 1024): string {
  const glyph = GLYPHS[id] ?? GLYPHS.settings
  const u = uid(id)
  const r = size * 0.223
  const pad = size * 0.018
  const inner = size - pad * 2
  const innerR = r - pad * 0.5

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="tile-${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#454545"/>
      <stop offset="12%" stop-color="#323232"/>
      <stop offset="55%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#080808"/>
    </linearGradient>
    <linearGradient id="shine-${u}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
      <stop offset="35%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <linearGradient id="rim-${u}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
      <stop offset="45%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
    <filter id="pop-${u}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.012}" stdDeviation="${size * 0.018}" flood-color="#000000" flood-opacity="0.65"/>
    </filter>
    <filter id="glyphGlow-${u}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="${size * 0.006}" stdDeviation="${size * 0.008}" flood-color="#ffffff" flood-opacity="0.55"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="#030303"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${innerR}" fill="url(#tile-${u})" filter="url(#pop-${u})"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner * 0.55}" rx="${innerR}" fill="url(#shine-${u})"/>
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${innerR}" fill="none" stroke="url(#rim-${u})" stroke-width="${size * 0.006}"/>
  <rect x="${pad + size * 0.012}" y="${pad + size * 0.012}" width="${inner - size * 0.024}" height="${inner - size * 0.024}" rx="${innerR * 0.92}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${size * 0.004}"/>
  <g transform="translate(${size / 2}, ${size / 2}) scale(${(size / 100) * 0.88})" filter="url(#glyphGlow-${u})">
    ${glyph}
  </g>
</svg>`
}

export function getDarkIconDef(id: string): DarkIconDef | undefined {
  return DARK_ICON_APPS.find((a) => a.id === id)
}

export async function renderDarkIconBlob(id: string, size = 1024): Promise<Blob> {
  const svg = buildFullIconSvg(id, size)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = new Image()
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })
    ctx.drawImage(img, 0, 0, size, size)
    return await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob failed'))), 'image/png')
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function renderDarkIconPreviewDataUrl(id: string, size = 128): string {
  const svg = buildFullIconSvg(id, size)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
