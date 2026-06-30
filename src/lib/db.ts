import Dexie, { type Table } from 'dexie'
import type { Folder, Note } from '../types'

class VaultDatabase extends Dexie {
  notes!: Table<Note>
  folders!: Table<Folder>

  constructor() {
    super('VaultNotes')
    this.version(1).stores({
      notes: 'id, title, folder, updatedAt',
      folders: 'id, name, parent',
    })
  }
}

export const db = new VaultDatabase()

export async function seedWelcomeNote(): Promise<void> {
  const count = await db.notes.count()
  if (count > 0) return

  const now = Date.now()
  await db.notes.bulkAdd([
    {
      id: crypto.randomUUID(),
      title: 'Welcome',
      folder: '',
      createdAt: now,
      updatedAt: now,
      content: `# Welcome to RexNotes

Your personal knowledge base — like **Obsidian**, with a red theme and full customization.

Tap **Read** to view notes · **Edit** to write · **Settings** to change colors, fonts, and graph style.

## Quick start

- **Files** — browse notes
- **Edit** — write Markdown
- **Read** — preview rendered notes
- **Graph** — stylish node map
- **Settings** — customize everything

Use \`[[Wiki Links]]\` and #tags in your notes.

Tap [[Getting Started]] to continue.`,
    },
    {
      id: crypto.randomUUID(),
      title: 'Getting Started',
      folder: '',
      createdAt: now + 1,
      updatedAt: now + 1,
      content: `# Getting Started

## Create a note

1. Open **Files** (sidebar)
2. Tap **+ Note** at the bottom
3. Start writing

## Markdown cheatsheet

\`\`\`
# Heading 1
## Heading 2
**bold** *italic*
- bullet list
1. numbered list
> blockquote
\`code\`
\`\`\`

## Link between notes

Type \`[[Note Title]]\` to create a wiki link. If the note doesn't exist yet, tapping the link creates it.

## Graph view

See how your notes connect in the **Graph** tab.

## Sync to PC later

Use **Export vault** in the menu to save your notes, then **Import vault** on your PC.`,
    },
  ])
}

export async function getAllNotes(): Promise<Note[]> {
  return db.notes.orderBy('updatedAt').reverse().toArray()
}

export async function getNote(id: string): Promise<Note | undefined> {
  return db.notes.get(id)
}

export async function getNoteByTitle(title: string): Promise<Note | undefined> {
  const normalized = title.trim().toLowerCase()
  const notes = await db.notes.toArray()
  return notes.find((n) => n.title.trim().toLowerCase() === normalized)
}

export async function saveNote(note: Note): Promise<void> {
  await db.notes.put({ ...note, updatedAt: Date.now() })
}

export async function createNote(title: string, folder = ''): Promise<Note> {
  const note: Note = {
    id: crypto.randomUUID(),
    title: title.trim() || 'Untitled',
    content: '',
    folder,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await db.notes.add(note)
  return note
}

export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id)
}

export async function renameNote(id: string, title: string): Promise<void> {
  const note = await db.notes.get(id)
  if (!note) return
  await db.notes.put({ ...note, title: title.trim() || 'Untitled', updatedAt: Date.now() })
}

export async function getAllFolders(): Promise<Folder[]> {
  return db.folders.toArray()
}

export async function createFolder(name: string, parent = ''): Promise<Folder> {
  const folder: Folder = {
    id: crypto.randomUUID(),
    name: name.trim() || 'New Folder',
    parent,
  }
  await db.folders.add(folder)
  return folder
}

export async function deleteFolder(id: string): Promise<void> {
  await db.folders.delete(id)
  const notes = await db.notes.where('folder').equals(id).toArray()
  for (const note of notes) {
    await db.notes.put({ ...note, folder: '' })
  }
}

export async function exportVault(): Promise<string> {
  const notes = await db.notes.toArray()
  const folders = await db.folders.toArray()
  const data = { version: 1 as const, notes, folders, exportedAt: Date.now() }
  return JSON.stringify(data, null, 2)
}

export async function importVault(json: string): Promise<void> {
  const data = JSON.parse(json) as { notes?: Note[]; folders?: Folder[] }
  if (!data.notes) throw new Error('Invalid vault file')
  await db.transaction('rw', db.notes, db.folders, async () => {
    await db.notes.clear()
    await db.folders.clear()
    if (data.folders?.length) await db.folders.bulkAdd(data.folders)
    await db.notes.bulkAdd(data.notes ?? [])
  })
}
