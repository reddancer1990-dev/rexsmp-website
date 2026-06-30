import { useMemo } from 'react'
import type { Note } from '../types'
import { findBacklinks, extractTags } from '../lib/links'

interface BacklinksPanelProps {
  notes: Note[]
  currentNote: Note | null
  onOpenNote: (id: string) => void
  onTagClick: (tag: string) => void
}

export function BacklinksPanel({ notes, currentNote, onOpenNote, onTagClick }: BacklinksPanelProps) {
  const backlinks = useMemo(
    () => (currentNote ? findBacklinks(notes, currentNote.title) : []),
    [notes, currentNote],
  )

  const tags = useMemo(
    () => (currentNote ? extractTags(currentNote.content) : []),
    [currentNote],
  )

  if (!currentNote) return null

  return (
    <div className="backlinks-panel">
      {tags.length > 0 && (
        <section>
          <h3>Tags</h3>
          <div className="tag-list">
            {tags.map((tag) => (
              <button key={tag} type="button" className="tag-chip" onClick={() => onTagClick(tag)}>
                #{tag}
              </button>
            ))}
          </div>
        </section>
      )}
      <section>
        <h3>Backlinks ({backlinks.length})</h3>
        {backlinks.length === 0 ? (
          <p className="muted">No notes link here yet.</p>
        ) : (
          <ul className="backlink-list">
            {backlinks.map((bl) => (
              <li key={bl.id}>
                <button type="button" onClick={() => onOpenNote(bl.id)}>
                  {bl.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
