const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const TAG_REGEX = /(?:^|[\s(])#([a-zA-Z][\w/-]*)/g

export function extractWikiLinks(content: string): string[] {
  const links: string[] = []
  let match: RegExpExecArray | null
  const regex = new RegExp(WIKI_LINK_REGEX.source, 'g')
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim())
  }
  return links
}

export function extractTags(content: string): string[] {
  const tags = new Set<string>()
  let match: RegExpExecArray | null
  const regex = new RegExp(TAG_REGEX.source, 'gm')
  while ((match = regex.exec(content)) !== null) {
    tags.add(match[1].toLowerCase())
  }
  return [...tags]
}

export function findBacklinks(
  notes: { id: string; title: string; content: string }[],
  currentTitle: string,
): { id: string; title: string }[] {
  const normalized = currentTitle.trim().toLowerCase()
  return notes
    .filter((n) => n.title.trim().toLowerCase() !== normalized)
    .filter((n) =>
      extractWikiLinks(n.content).some((l) => l.trim().toLowerCase() === normalized),
    )
    .map((n) => ({ id: n.id, title: n.title }))
}

export function slugifyTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, '-')
}

export { WIKI_LINK_REGEX, TAG_REGEX }
