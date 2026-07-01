export interface DarkIconDef {
  id: string
  name: string
  /** Short label for preview grid */
  label: string
}

/** Dark minimalist icon pack — matches Black Vision home screen aesthetic. */
export const DARK_ICON_APPS: DarkIconDef[] = [
  { id: 'safari', name: 'Safari', label: 'Safari' },
  { id: 'phone', name: 'Phone', label: 'Phone' },
  { id: 'messages', name: 'Messages', label: 'Messages' },
  { id: 'whatsapp', name: 'WhatsApp', label: 'WhatsApp' },
  { id: 'chatgpt', name: 'ChatGPT', label: 'ChatGPT' },
  { id: 'cursor', name: 'Cursor', label: 'Cursor' },
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

const GLYPHS: Record<string, string> = {
  safari: `<circle cx="50" cy="50" r="28" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <polygon points="50,28 58,58 50,50 42,58" fill="#ececec"/>
    <circle cx="50" cy="50" r="3" fill="#ececec"/>`,

  phone: `<path d="M34 28h14c2 0 4 2 4 4v36c0 2-2 4-4 4H34c-2 0-4-2-4-4V32c0-2 2-4 4-4z" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M38 68h6" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>`,

  messages: `<path d="M28 32h44c3 0 6 3 6 6v22c0 3-3 6-6 6H42l-10 10v-10H28c-3 0-6-3-6-6V38c0-3 3-6 6-6z" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linejoin="round"/>`,

  whatsapp: `<path d="M28 32h44c3 0 6 3 6 6v22c0 3-3 6-6 6H42l-10 10v-10H28c-3 0-6-3-6-6V38c0-3 3-6 6-6z" fill="none" stroke="#ececec" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M38 44c0 8 6 14 12 14 2 0 4-.5 5.5-1.5l5 2-1.5-5c1-1.5 1.5-3.5 1.5-5.5 0-6-6-12-12-12s-12 6-12 12z" fill="none" stroke="#ececec" stroke-width="2" stroke-linecap="round"/>`,

  chatgpt: `<path d="M50 24c-14 0-24 10-24 22 0 8 4 15 11 19l-3 11 11-4c3 1 6 1.5 9 1.5 14 0 24-10 24-22S64 24 50 24z" fill="none" stroke="#ececec" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M36 50h28M50 36v28" stroke="#ececec" stroke-width="2" stroke-linecap="round" opacity="0.5"/>`,

  cursor: `<path d="M32 28 L32 68 L44 56 L54 72 L60 68 L50 52 L68 52 Z" fill="#ececec" stroke="#ececec" stroke-width="1" stroke-linejoin="round"/>
    <circle cx="58" cy="38" r="6" fill="none" stroke="#ececec" stroke-width="2"/>` ,

  vercel: `<polygon points="50,26 72,68 28,68" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="50,38 62,62 38,62" fill="#ececec" opacity="0.35"/>`,

  code: `<path d="M38 32 L24 50 L38 68" fill="none" stroke="#ececec" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62 32 L76 50 L62 68" fill="none" stroke="#ececec" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54 28 L46 72" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>`,

  reddit: `<circle cx="50" cy="52" r="22" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <circle cx="42" cy="48" r="4" fill="#ececec"/><circle cx="58" cy="48" r="4" fill="#ececec"/>
    <path d="M44 58 Q50 64 56 58" fill="none" stroke="#ececec" stroke-width="2" stroke-linecap="round"/>
    <circle cx="38" cy="34" r="5" fill="none" stroke="#ececec" stroke-width="2"/>
    <circle cx="62" cy="34" r="5" fill="none" stroke="#ececec" stroke-width="2"/>
    <path d="M43 34h14" stroke="#ececec" stroke-width="2" stroke-linecap="round"/>`,

  pinterest: `<circle cx="50" cy="50" r="28" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <path d="M50 30c-8 0-14 6-14 14 0 6 4 11 9 13-1-4 1-9 4-12 0 6 4 10 9 10 8 0 14-6 14-14s-6-14-14-14z" fill="#ececec"/>`,

  tiktok: `<path d="M58 28v28c0 6-5 11-11 11s-11-5-11-11 5-11 11-11V42" fill="none" stroke="#ececec" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M58 28c3 3 7 5 12 5" fill="none" stroke="#ececec" stroke-width="2.8" stroke-linecap="round"/>`,

  discord: `<path d="M32 36c8-4 16-6 18-6s10 2 18 6c0 0 6 12 6 24 0 0-6 6-12 8l-4-6c-4 2-8 3-12 3s-8-1-12-3l-4 6c-6-2-12-8-12-8 0-12 6-24 6-24z" fill="none" stroke="#ececec" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="42" cy="52" r="4" fill="#ececec"/><circle cx="58" cy="52" r="4" fill="#ececec"/>`,

  soundcloud: `<path d="M28 58c0-8 6-14 14-14 3 0 6 1 8 3 2-6 8-10 15-10 9 0 16 7 16 16 0 3-.8 5.5-2.2 7.8" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M32 58v-8M36 58v-12M40 58v-16M44 58v-10M48 58v-14" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>`,

  music: `<path d="M58 30v28M58 30L38 38v20" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="34" cy="58" r="6" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <circle cx="54" cy="50" r="6" fill="none" stroke="#ececec" stroke-width="2.5"/>`,

  contacts: `<circle cx="50" cy="38" r="12" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <path d="M28 68c0-12 10-20 22-20s22 8 22 20" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>`,

  mail: `<rect x="26" y="34" width="48" height="32" rx="4" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <path d="M26 38l24 18 24-18" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linejoin="round"/>`,

  camera: `<rect x="28" y="36" width="44" height="32" rx="4" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <circle cx="50" cy="52" r="10" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <circle cx="62" cy="42" r="3" fill="#ececec"/>`,

  photos: `<rect x="28" y="32" width="44" height="36" rx="4" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <circle cx="40" cy="46" r="4" fill="#ececec"/>
    <path d="M28 60l12-12 10 10 8-8 16 16" fill="none" stroke="#ececec" stroke-width="2.5" stroke-linejoin="round"/>`,

  settings: `<circle cx="50" cy="50" r="10" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <path d="M50 26v6M50 68v6M26 50h6M68 50h6M33 33l4 4M63 63l4 4M33 67l4-4M63 37l4-4" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>`,

  notes: `<rect x="30" y="28" width="40" height="44" rx="4" fill="none" stroke="#ececec" stroke-width="2.5"/>
    <path d="M38 42h24M38 52h24M38 62h16" stroke="#ececec" stroke-width="2.5" stroke-linecap="round"/>`,

  rexnotes: `<rect x="30" y="28" width="40" height="44" rx="4" fill="none" stroke="#f87171" stroke-width="2.5"/>
    <path d="M42 48h16M42 58h12" stroke="#f87171" stroke-width="2.5" stroke-linecap="round"/>
    <text x="50" y="44" text-anchor="middle" fill="#f87171" font-size="14" font-family="system-ui,sans-serif" font-weight="600">R</text>`,
}

export function buildFullIconSvg(id: string, size = 1024): string {
  const glyph = GLYPHS[id] ?? GLYPHS.settings
  const r = size * 0.223
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#242424"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
      <stop offset="40%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <rect x="${size * 0.02}" y="${size * 0.02}" width="${size * 0.96}" height="${size * 0.96}" rx="${r * 0.92}" fill="url(#shine)"/>
  <rect x="${size * 0.02}" y="${size * 0.02}" width="${size * 0.96}" height="${size * 0.96}" rx="${r * 0.92}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="${size * 0.008}"/>
  <g transform="scale(${size / 100})">${glyph}</g>
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
