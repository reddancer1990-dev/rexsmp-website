import JSZip from 'jszip'
import {
  buildFullIconSvg,
  DARK_ICON_APPS,
  renderDarkIconBlob,
  type DarkIconDef,
} from './darkIconArt'

export type { DarkIconDef }
export { DARK_ICON_APPS, buildFullIconSvg, renderDarkIconPreviewDataUrl } from './darkIconArt'
export { renderDarkIconBlob }

const SHORTCUTS_README = `Black Vision Dark Icon Pack
============================

21 minimalist dark icons for iPhone Shortcuts.

HOW TO SET A CUSTOM ICON
------------------------
1. Save the icon PNG to Photos (or Files).
2. Open the Shortcuts app.
3. Tap + → Add Action → search "Open App" → pick your app.
4. Tap the shortcut name at top → icon → Choose Photo → select the icon.
5. Tap Share → Add to Home Screen → name it → Add.

Repeat for each app. Use the matching filename:
  safari.png → Safari
  cursor.png → Cursor
  chatgpt.png → ChatGPT
  etc.

Tip: Enable Dark Mode in Settings → Display for the full look.
`

/** @deprecated Use DARK_ICON_APPS */
export const ICON_PACK = DARK_ICON_APPS.map((a) => ({
  id: a.id,
  name: a.name,
  glyph: a.label.charAt(0),
  style: 'black-vision' as const,
}))

export const HOME_SCREEN_ICONS = DARK_ICON_APPS.slice(0, 12)

export function downloadIcon(iconId: string): void {
  const def = DARK_ICON_APPS.find((a) => a.id === iconId)
  if (!def) return
  const svg = buildFullIconSvg(iconId, 1024)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${iconId}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadIconPng(iconId: string): Promise<void> {
  const blob = await renderDarkIconBlob(iconId, 1024)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${iconId}.png`
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadIconPackZip(): Promise<void> {
  const zip = new JSZip()
  const folder = zip.folder('black-vision-icons')
  if (!folder) throw new Error('Could not create zip folder')

  folder.file('README.txt', SHORTCUTS_README)

  for (const app of DARK_ICON_APPS) {
    const blob = await renderDarkIconBlob(app.id, 1024)
    const buf = await blob.arrayBuffer()
    folder.file(`${app.id}.png`, buf)
  }

  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'black-vision-icons.zip'
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadAllIcons(): Promise<void> {
  await downloadIconPackZip()
}
