import { useEffect, useRef } from 'react'

interface EditorProps {
  content: string
  title: string
  onChange: (content: string) => void
  onTitleChange: (title: string) => void
}

export function Editor({ content, title, onChange, onTitleChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [content])

  return (
    <div className="editor-pane">
      <input
        className="note-title-input"
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Note title"
        enterKeyHint="done"
      />
      <textarea
        ref={textareaRef}
        className="note-editor"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing in Markdown..."
        spellCheck
        autoCapitalize="sentences"
        autoCorrect="on"
      />
    </div>
  )
}
