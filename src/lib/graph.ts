import type { GraphEdge, GraphNode, Note } from '../types'
import { extractWikiLinks } from './links'

export function buildGraph(notes: Note[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const titleToId = new Map<string, string>()
  for (const note of notes) {
    titleToId.set(note.title.trim().toLowerCase(), note.id)
  }

  const linkCounts = new Map<string, number>()
  const edges: GraphEdge[] = []
  const edgeSet = new Set<string>()

  for (const note of notes) {
    const links = extractWikiLinks(note.content)
    for (const link of links) {
      const targetId = titleToId.get(link.trim().toLowerCase())
      if (!targetId || targetId === note.id) continue
      const key = [note.id, targetId].sort().join('|')
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        edges.push({ source: note.id, target: targetId })
      }
      linkCounts.set(note.id, (linkCounts.get(note.id) ?? 0) + 1)
      linkCounts.set(targetId, (linkCounts.get(targetId) ?? 0) + 1)
    }
  }

  const nodes: GraphNode[] = notes.map((n) => ({
    id: n.id,
    title: n.title,
    linkCount: linkCounts.get(n.id) ?? 0,
  }))

  return { nodes, edges }
}
