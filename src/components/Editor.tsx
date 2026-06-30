import { useEffect, useRef, useState } from 'react'

interface EditorProps {
  noteId: string
  initialContent: string
  initialTitle: string
  readOnly?: boolean
  onSave: (content: string) => void
  onTitleSave: (title: string) => void
}

export function Editor({ noteId, initialContent, initialTitle, readOnly, onSave, onTitleSave }: EditorProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setContent(initialContent)
    setTitle(initialTitle)
  }, [noteId])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (titleTimer.current) clearTimeout(titleTimer.current)
    }
  }, [])

  const handleContent = (value: string) => {
    if (readOnly) return
    setContent(value)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => onSave(value), 400)
  }

  const handleTitle = (value: string) => {
    if (readOnly) return
    setTitle(value)
    if (titleTimer.current) clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => onTitleSave(value), 500)
  }

  return (
    <div className="editor-pane">
      {readOnly && (
        <div className="locked-banner">🔒 Locked reference note — read only</div>
      )}
      <input
        className="note-title-input"
        type="text"
        value={title}
        onChange={(e) => handleTitle(e.target.value)}
        placeholder="Note title"
        enterKeyHint="done"
        readOnly={readOnly}
      />
      <textarea
        className={`note-editor ${readOnly ? 'read-only' : ''}`}
        value={content}
        onChange={(e) => handleContent(e.target.value)}
        placeholder="Start writing in Markdown..."
        spellCheck={!readOnly}
        readOnly={readOnly}
      />
    </div>
  )
}
