import { marked } from 'marked'
import { WIKI_LINK_REGEX } from './links'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function preprocessWikiLinks(content: string): string {
  return content.replace(WIKI_LINK_REGEX, (_match, target: string, alias?: string) => {
    const label = (alias ?? target).trim()
    const safeTarget = target.trim().replace(/"/g, '&quot;')
    return `<a href="#" class="wiki-link" data-wiki="${safeTarget}">${label}</a>`
  })
}

export function preprocessTags(content: string): string {
  return content.replace(/(^|[\s(])#([a-zA-Z][\w/-]*)/g, (_match, prefix: string, tag: string) => {
    return `${prefix}<span class="tag" data-tag="${tag.toLowerCase()}">#${tag}</span>`
  })
}

export function renderMarkdown(content: string): string {
  const withTags = preprocessTags(content)
  const withLinks = preprocessWikiLinks(withTags)
  return marked.parse(withLinks) as string
}

export function titleFromContent(content: string, fallback = 'Untitled'): string {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1].trim()
  const firstLine = content.split('\n').find((l) => l.trim())
  if (firstLine) return firstLine.replace(/^#+\s*/, '').slice(0, 80)
  return fallback
}
