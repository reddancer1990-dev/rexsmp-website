import { useCallback, useEffect, useState } from 'react'
import type { Folder, Note } from '../types'
import {
  createFolder,
  createNote,
  deleteFolder,
  deleteNote,
  exportVault,
  getAllFolders,
  getAllNotes,
  getNoteByTitle,
  importVault,
  renameNote,
  saveNote,
  initVault,
} from '../lib/db'
import { isLockedNote } from '../lib/lockedNotes'

export function useVault() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [n, f] = await Promise.all([getAllNotes(), getAllFolders()])
    setNotes(n)
    setFolders(f)
    return n
  }, [])

  useEffect(() => {
    initVault()
      .then(refresh)
      .then((n) => {
        setActiveNoteId((current) => current ?? n[0]?.id ?? null)
      })
      .finally(() => setLoading(false))
  }, [refresh])

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null

  const updateNoteContent = useCallback((id: string, content: string) => {
    if (isLockedNote(id)) return
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id)
      if (!note || note.locked) return prev
      const updated = { ...note, content, updatedAt: Date.now() }
      saveNote(updated)
      return prev.map((n) => (n.id === id ? updated : n))
    })
  }, [])

  const updateNoteTitle = useCallback((id: string, title: string) => {
    if (isLockedNote(id)) return
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id)
      if (!note || note.locked) return prev
      const trimmed = title.trim() || 'Untitled'
      const updated = { ...note, title: trimmed, updatedAt: Date.now() }
      saveNote(updated)
      return prev.map((n) => (n.id === id ? updated : n))
    })
  }, [])

  const addNote = useCallback(
    async (folder = '') => {
      const note = await createNote('Untitled', folder)
      await refresh()
      setActiveNoteId(note.id)
      return note
    },
    [refresh],
  )

  const removeNote = useCallback(
    async (id: string) => {
      await deleteNote(id)
      const remaining = await refresh()
      if (activeNoteId === id) {
        setActiveNoteId(remaining[0]?.id ?? null)
      }
    },
    [activeNoteId, refresh],
  )

  const renameNoteById = useCallback(
    async (id: string, title: string) => {
      await renameNote(id, title)
      await refresh()
    },
    [refresh],
  )

  const addFolder = useCallback(async (name: string, parent = '') => {
    await createFolder(name, parent)
    await refresh()
  }, [refresh])

  const removeFolder = useCallback(
    async (id: string) => {
      await deleteFolder(id)
      await refresh()
    },
    [refresh],
  )

  const openNoteByTitle = useCallback(
    async (title: string) => {
      let note = await getNoteByTitle(title)
      if (!note) {
        note = await createNote(title)
        await refresh()
      }
      setActiveNoteId(note.id)
      return note
    },
    [refresh],
  )

  const exportData = useCallback(async () => {
    return exportVault()
  }, [])

  const importData = useCallback(
    async (json: string) => {
      await importVault(json)
      const n = await refresh()
      setActiveNoteId(n[0]?.id ?? null)
    },
    [refresh],
  )

  return {
    notes,
    folders,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    loading,
    updateNoteContent,
    updateNoteTitle,
    addNote,
    removeNote,
    renameNoteById,
    addFolder,
    removeFolder,
    openNoteByTitle,
    exportData,
    importData,
    refresh,
  }
}
