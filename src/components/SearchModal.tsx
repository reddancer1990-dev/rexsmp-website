import { useMemo, useState } from 'react'
import type { Note } from '../types'
import { extractTags } from '../lib/links'

interface SearchModalProps {
  notes: Note[]
  onSelectNote: (id: string) => void
  onClose: () => void
  initialQuery?: string
}

export function SearchModal({ notes, onSelectNote, onClose, initialQuery = '' }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes.slice(0, 20)
    return notes.filter((n) => {
      const tags = extractTags(n.content).join(' ')
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        tags.includes(q.replace('#', ''))
      )
    })
  }, [notes, query])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <input
            type="search"
            className="search-input"
            placeholder="Search notes, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            enterKeyHint="search"
          />
          <button type="button" className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <ul className="search-results">
          {results.length === 0 ? (
            <li className="search-empty">No results</li>
          ) : (
            results.map((note) => (
              <li key={note.id}>
                <button
                  type="button"
                  className="search-result-item"
                  onClick={() => {
                    onSelectNote(note.id)
                    onClose()
                  }}
                >
                  <strong>{note.title}</strong>
                  <span className="search-snippet">
                    {note.content.replace(/\n/g, ' ').slice(0, 80)}…
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
