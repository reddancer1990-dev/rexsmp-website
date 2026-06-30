import { useEffect, useRef, useState } from 'react'

interface EditorProps {
  noteId: string
  initialContent: string
  initialTitle: string
  onSave: (content: string) => void
  onTitleSave: (title: string) => void
}

export function Editor({ noteId, initialContent, initialTitle, onSave, onTitleSave }: EditorProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContent(initialContent)
    setTitle(initialTitle)
    scrollRef.current?.scrollTo(0, 0)
  }, [noteId])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (titleTimer.current) clearTimeout(titleTimer.current)
    }
  }, [])

  const handleContent = (value: string) => {
    setContent(value)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => onSave(value), 400)
  }

  const handleTitle = (value: string) => {
    setTitle(value)
    if (titleTimer.current) clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => onTitleSave(value), 500)
  }

  return (
    <div className="editor-pane" ref={scrollRef}>
      <input
        className="note-title-input"
        type="text"
        value={title}
        onChange={(e) => handleTitle(e.target.value)}
        placeholder="Note title"
        enterKeyHint="done"
      />
      <textarea
        className="note-editor"
        value={content}
        onChange={(e) => handleContent(e.target.value)}
        placeholder="Start writing in Markdown..."
        spellCheck
        autoCapitalize="sentences"
        autoCorrect="on"
      />
    </div>
  )
}
