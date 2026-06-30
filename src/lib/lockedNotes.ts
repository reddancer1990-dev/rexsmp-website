/** Fixed ID so the syntax reference persists across devices/imports */
export const LOCKED_SYNTAX_NOTE_ID = '00000000-0000-4000-8000-000000000001'

export const SYNTAX_NOTE_CONTENT = `# Syntax Reference 🔒

This note is **locked** — it always stays in your vault as a quick reference.

---

## Wiki links \`[[ ]]\`

Link to another note by title:

\`\`\`
[[Note Title]]
[[Note Title|Custom label]]
\`\`\`

**Example:** [[Welcome]] creates a link. Tap it in **Read** mode to open that note.

---

## Tags \`#\`

Add tags anywhere in your note:

\`\`\`
#ideas #work #important
\`\`\`

Tap a tag in Read mode to search all notes with that tag.

---

## Markdown basics

| Syntax | Result |
|--------|--------|
| \`# Heading\` | Large heading |
| \`## Subheading\` | Medium heading |
| \`**bold**\` | **bold** |
| \`*italic*\` | *italic* |
| \`- item\` | Bullet list |
| \`1. item\` | Numbered list |
| \`> quote\` | Blockquote |
| \`\`code\`\` | Inline code |
| \`---\` | Horizontal rule |

---

## Code blocks

\`\`\`markdown
\`\`\`
multi-line
code here
\`\`\`
\`\`\`

---

## Graph view

- **Pinch** to zoom in/out
- **Drag** empty space to pan
- **Tap** a node to open that note
- **Drag** a node to rearrange it

---

## Tips

- Use **Files** to browse notes
- **Edit** = write Markdown · **Read** = preview
- **Settings** = colors, fonts, graph style
- Export vault from the **⋯** menu to back up or move to PC
`

export function isLockedNote(id: string): boolean {
  return id === LOCKED_SYNTAX_NOTE_ID
}
