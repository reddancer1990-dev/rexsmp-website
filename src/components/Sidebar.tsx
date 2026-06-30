import { useMemo, useState } from 'react'
import type { Folder, Note } from '../types'

interface SidebarProps {
  notes: Note[]
  folders: Folder[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
  onCreateNote: (folder?: string) => void
  onCreateFolder: () => void
  onDeleteNote: (id: string) => void
  onClose: () => void
}

export function Sidebar({
  notes,
  folders,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onCreateFolder,
  onDeleteNote,
  onClose,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']))
  const [search, setSearch] = useState('')

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes
    const q = search.toLowerCase()
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
    )
  }, [notes, search])

  const rootNotes = filteredNotes.filter((n) => !n.folder)
  const notesByFolder = useMemo(() => {
    const map = new Map<string, Note[]>()
    for (const f of folders) {
      map.set(f.id, filteredNotes.filter((n) => n.folder === f.id))
    }
    return map
  }, [filteredNotes, folders])

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Delete this note?')) onDeleteNote(id)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Vault</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      <div className="sidebar-search">
        <input
          type="search"
          placeholder="Filter files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterKeyHint="search"
        />
      </div>

      <div className="file-tree">
        <div className="folder-row">
          <button type="button" className="folder-toggle" onClick={() => toggleFolder('')}>
            {expandedFolders.has('') ? '▼' : '▶'} All notes
          </button>
        </div>
        {expandedFolders.has('') &&
          rootNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`file-item ${note.id === activeNoteId ? 'active' : ''}`}
              onClick={() => {
                onSelectNote(note.id)
                onClose()
              }}
            >
              <span className="file-icon">📄</span>
              <span className="file-name">{note.title}</span>
              <span
                className="file-delete"
                role="button"
                tabIndex={0}
                onClick={(e) => handleDelete(e, note.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleDelete(e as unknown as React.MouseEvent, note.id)}
              >
                🗑
              </span>
            </button>
          ))}

        {folders.map((folder) => (
          <div key={folder.id}>
            <div className="folder-row">
              <button type="button" className="folder-toggle" onClick={() => toggleFolder(folder.id)}>
                {expandedFolders.has(folder.id) ? '▼' : '▶'} {folder.name}
              </button>
            </div>
            {expandedFolders.has(folder.id) &&
              (notesByFolder.get(folder.id) ?? []).map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`file-item indented ${note.id === activeNoteId ? 'active' : ''}`}
                  onClick={() => {
                    onSelectNote(note.id)
                    onClose()
                  }}
                >
                  <span className="file-icon">📄</span>
                  <span className="file-name">{note.title}</span>
                </button>
              ))}
          </div>
        ))}
      </div>

      <div className="sidebar-actions">
        <button type="button" className="action-btn" onClick={() => onCreateNote()}>
          + Note
        </button>
        <button type="button" className="action-btn secondary" onClick={onCreateFolder}>
          + Folder
        </button>
      </div>
    </aside>
  )
}
