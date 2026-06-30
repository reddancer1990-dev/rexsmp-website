export interface Note {
  id: string
  title: string
  content: string
  folder: string
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: string
  name: string
  parent: string
}

export type MobileView = 'files' | 'edit' | 'preview' | 'graph' | 'search'

export interface GraphNode {
  id: string
  title: string
  linkCount: number
}

export interface GraphEdge {
  source: string
  target: string
}

export interface VaultExport {
  version: 1
  notes: Note[]
  folders: Folder[]
  exportedAt: number
}
