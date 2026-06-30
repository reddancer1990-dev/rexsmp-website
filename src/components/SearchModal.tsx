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
  const [closing, setClosing] = useState(false)

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

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 280)
  }

  const handleSelect = (id: string) => {
    setClosing(true)
    setTimeout(() => {
      onSelectNote(id)
      onClose()
    }, 200)
  }

  return (
    <div className={`modal-overlay ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`search-modal ${closing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
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
          <button type="button" className="icon-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
        <ul className="search-results">
          {results.length === 0 ? (
            <li className="search-empty">No results</li>
          ) : (
            results.map((note, i) => (
              <li key={note.id} style={{ animationDelay: `${i * 40}ms` }} className="search-result-row">
                <button
                  type="button"
                  className="search-result-item"
                  onClick={() => handleSelect(note.id)}
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
