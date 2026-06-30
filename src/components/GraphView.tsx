import { useCallback, useEffect, useRef } from 'react'
import type { Note } from '../types'
import { buildGraph } from '../lib/graph'

interface GraphViewProps {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (id: string) => void
}

export function GraphView({ notes, activeNoteId, onSelectNote }: GraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<{
    nodes: { id: string; x: number; y: number; vx: number; vy: number; title: string; r: number }[]
    edges: { source: string; target: string }[]
    dragging: string | null
  }>({ nodes: [], edges: [], dragging: null })

  const initGraph = useCallback(() => {
    const { nodes, edges } = buildGraph(notes)
    const w = canvasRef.current?.width ?? 300
    const h = canvasRef.current?.height ?? 400
    stateRef.current.nodes = nodes.map((n, i) => {
      const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2
      const r = 8 + Math.min(n.linkCount * 3, 20)
      return {
        id: n.id,
        title: n.title,
        r,
        x: w / 2 + Math.cos(angle) * (Math.min(w, h) * 0.3),
        y: h / 2 + Math.sin(angle) * (Math.min(w, h) * 0.3),
        vx: 0,
        vy: 0,
      }
    })
    stateRef.current.edges = edges
  }, [notes])

  useEffect(() => {
    initGraph()
  }, [initGraph])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    const tick = () => {
      const state = stateRef.current
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      const nodeMap = new Map(state.nodes.map((n) => [n.id, n]))

      // Physics
      for (const node of state.nodes) {
        if (state.dragging === node.id) continue
        node.vx += (w / 2 - node.x) * 0.002
        node.vy += (h / 2 - node.y) * 0.002
        node.vx *= 0.85
        node.vy *= 0.85
      }

      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const a = state.nodes[i]
          const b = state.nodes[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.max(Math.hypot(dx, dy), 1)
          const force = 800 / (dist * dist)
          if (state.dragging !== a.id) {
            a.vx -= (dx / dist) * force
            a.vy -= (dy / dist) * force
          }
          if (state.dragging !== b.id) {
            b.vx += (dx / dist) * force
            b.vy += (dy / dist) * force
          }
        }
      }

      for (const edge of state.edges) {
        const a = nodeMap.get(edge.source)
        const b = nodeMap.get(edge.target)
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.max(Math.hypot(dx, dy), 1)
        const force = (dist - 100) * 0.01
        if (state.dragging !== a.id) {
          a.vx += (dx / dist) * force
          a.vy += (dy / dist) * force
        }
        if (state.dragging !== b.id) {
          b.vx -= (dx / dist) * force
          b.vy -= (dy / dist) * force
        }
      }

      for (const node of state.nodes) {
        if (state.dragging === node.id) continue
        node.x += node.vx
        node.y += node.vy
        node.x = Math.max(node.r, Math.min(w - node.r, node.x))
        node.y = Math.max(node.r, Math.min(h - node.r, node.y))
      }

      // Draw
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = '#4a4a6a'
      ctx.lineWidth = 1
      for (const edge of state.edges) {
        const a = nodeMap.get(edge.source)
        const b = nodeMap.get(edge.target)
        if (!a || !b) continue
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      for (const node of state.nodes) {
        const isActive = node.id === activeNoteId
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = isActive ? '#a78bfa' : '#7c3aed'
        ctx.fill()
        if (isActive) {
          ctx.strokeStyle = '#c4b5fd'
          ctx.lineWidth = 2
          ctx.stroke()
        }
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '11px system-ui, sans-serif'
        ctx.textAlign = 'center'
        const label = node.title.length > 14 ? `${node.title.slice(0, 12)}…` : node.title
        ctx.fillText(label, node.x, node.y + node.r + 14)
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const getNodeAt = (x: number, y: number) => {
      for (const node of [...stateRef.current.nodes].reverse()) {
        if (Math.hypot(node.x - x, node.y - y) <= node.r + 8) return node
      }
      return null
    }

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top)
      if (node) {
        stateRef.current.dragging = node.id
        canvas.setPointerCapture(e.pointerId)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const id = stateRef.current.dragging
      if (!id) return
      const rect = canvas.getBoundingClientRect()
      const node = stateRef.current.nodes.find((n) => n.id === id)
      if (node) {
        node.x = e.clientX - rect.left
        node.y = e.clientY - rect.top
        node.vx = 0
        node.vy = 0
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      const id = stateRef.current.dragging
      if (id) {
        const rect = canvas.getBoundingClientRect()
        const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top)
        if (node && node.id === id) onSelectNote(node.id)
      }
      stateRef.current.dragging = null
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [activeNoteId, onSelectNote, initGraph])

  if (notes.length === 0) {
    return <div className="graph-empty">Create notes to see the graph.</div>
  }

  return (
    <div className="graph-view">
      <p className="graph-hint">Tap a node to open · Drag to rearrange</p>
      <canvas ref={canvasRef} className="graph-canvas" />
    </div>
  )
}
