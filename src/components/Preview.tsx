import { useEffect, useRef } from 'react'
import { renderMarkdown } from '../lib/markdown'

interface PreviewProps {
  content: string
  onWikiLinkClick: (title: string) => void
  onTagClick: (tag: string) => void
}

export function Preview({ content, onWikiLinkClick, onTagClick }: PreviewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const html = renderMarkdown(content)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const wiki = target.closest('.wiki-link') as HTMLElement | null
      if (wiki?.dataset.wiki) {
        e.preventDefault()
        onWikiLinkClick(wiki.dataset.wiki)
        return
      }
      const tag = target.closest('.tag') as HTMLElement | null
      if (tag?.dataset.tag) {
        e.preventDefault()
        onTagClick(tag.dataset.tag)
      }
    }

    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [html, onWikiLinkClick, onTagClick])

  return (
    <div className="preview-pane">
      <div ref={ref} className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
