import Dexie, { type Table } from 'dexie'
import type { Folder, Note } from '../types'
import {
  isLockedNote,
  LOCKED_SYNTAX_NOTE_ID,
  SYNTAX_NOTE_CONTENT,
} from './lockedNotes'

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

export async function ensureLockedNotes(): Promise<void> {
  const existing = await db.notes.get(LOCKED_SYNTAX_NOTE_ID)
  const now = Date.now()
  if (!existing) {
    await db.notes.put({
      id: LOCKED_SYNTAX_NOTE_ID,
      title: 'Syntax Reference',
      folder: '',
      locked: true,
      createdAt: now,
      updatedAt: now,
      content: SYNTAX_NOTE_CONTENT,
    })
  } else if (!existing.locked || existing.content !== SYNTAX_NOTE_CONTENT) {
    await db.notes.put({
      ...existing,
      locked: true,
      title: 'Syntax Reference',
      content: SYNTAX_NOTE_CONTENT,
      updatedAt: now,
    })
  }
}

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

Open **Syntax Reference** (locked 🔒) anytime for \`[[links]]\`, #tags, and Markdown help.

## Quick start

- **Files** — browse notes
- **Edit** — write Markdown
- **Read** — preview rendered notes
- **Graph** — full-screen node map (pinch to zoom)
- **Settings** — customize everything

Tap [[Getting Started]] to continue.`,
    },
    {
      id: crypto.randomUUID(),
      title: 'Getting Started',
      folder: '',
      createdAt: now + 1,
      updatedAt: now + 1,
      content: `# Getting Started

1. Open **Files** and tap **+ Note**
2. Write in **Edit**, read in **Read**
3. Link notes with \`[[Note Title]]\`
4. See connections in **Graph** — pinch to zoom!

See **Syntax Reference** for every symbol and shortcut.`,
    },
  ])
}

export async function initVault(): Promise<void> {
  await seedWelcomeNote()
  await ensureLockedNotes()
}

export async function getAllNotes(): Promise<Note[]> {
  const notes = await db.notes.orderBy('updatedAt').reverse().toArray()
  return notes.sort((a, b) => {
    if (a.locked && !b.locked) return -1
    if (!a.locked && b.locked) return 1
    return 0
  })
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
  if (note.locked || isLockedNote(note.id)) {
    const locked = await db.notes.get(note.id)
    if (locked?.locked) return
  }
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
  if (isLockedNote(id)) return
  const note = await db.notes.get(id)
  if (note?.locked) return
  await db.notes.delete(id)
}

export async function renameNote(id: string, title: string): Promise<void> {
  if (isLockedNote(id)) return
  const note = await db.notes.get(id)
  if (!note || note.locked) return
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
    if (!note.locked) await db.notes.put({ ...note, folder: '' })
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
  await ensureLockedNotes()
}
