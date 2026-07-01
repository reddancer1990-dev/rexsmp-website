import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const APPS = [
  'safari', 'phone', 'messages', 'whatsapp', 'chatgpt', 'cursor', 'vercel', 'code',
  'reddit', 'pinterest', 'tiktok', 'discord', 'soundcloud', 'music', 'contacts',
  'mail', 'camera', 'photos', 'settings', 'notes', 'rexnotes',
]

const SHORTCUTS_README = `Black Vision Dark Icon Pack
============================

21 minimalist dark icons for iPhone Shortcuts.

HOW TO SET A CUSTOM ICON
------------------------
1. Unzip this folder on your iPhone (Files app).
2. Open Shortcuts → + → Add Action → Open App → pick your app.
3. Tap shortcut name → icon → Choose Photo → select the matching PNG.
4. Share → Add to Home Screen.

Files: safari.png, cursor.png, chatgpt.png, whatsapp.png, etc.
`

// Import SVG builder from compiled approach - inline duplicate minimal or read from file
// We'll dynamic import the ts module via tsx
const { buildFullIconSvg } = await import('../src/lib/darkIconArt.ts')

async function main() {
  const zip = new JSZip()
  const folder = zip.folder('black-vision-icons')
  if (!folder) throw new Error('zip folder failed')

  folder.file('README.txt', SHORTCUTS_README)

  for (const id of APPS) {
    const svg = buildFullIconSvg(id, 1024)
    const png = await sharp(Buffer.from(svg)).png().toBuffer()
    folder.file(`${id}.png`, png)
    console.log(`  ✓ ${id}.png`)
  }

  const outDir = path.join(root, 'public')
  fs.mkdirSync(outDir, { recursive: true })
  const zipPath = path.join(outDir, 'black-vision-icons.zip')
  const buf = await zip.generateAsync({ type: 'nodebuffer' })
  fs.writeFileSync(zipPath, buf)
  console.log(`\nWrote ${zipPath} (${(buf.length / 1024).toFixed(1)} KB)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
