import { useEffect, useRef } from 'react'
import { useCallback } from 'react'
import type { Note } from '../types'
import type { AppSettings } from '../lib/settings'
import { buildGraph } from '../lib/graph'

interface GraphViewProps {
  notes: Note[]
  activeNoteId: string | null
  settings: AppSettings
  onSelectNote: (id: string) => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export function GraphView({ notes, activeNoteId, settings, onSelectNote }: GraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settingsRef = useRef(settings)
  const stateRef = useRef<{
    nodes: { id: string; x: number; y: number; vx: number; vy: number; title: string; r: number; pulse: number }[]
    edges: { source: string; target: string }[]
    dragging: string | null
    particles: Particle[]
    time: number
  }>({ nodes: [], edges: [], dragging: null, particles: [], time: 0 })

  settingsRef.current = settings

  const initGraph = useCallback(() => {
    const { nodes, edges } = buildGraph(notes)
    const w = canvasRef.current?.width ?? 300
    const h = canvasRef.current?.height ?? 400
    stateRef.current.nodes = nodes.map((n, i) => {
      const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2
      const r = 10 + Math.min(n.linkCount * 2.5, 16)
      return {
        id: n.id,
        title: n.title,
        r,
        pulse: Math.random() * Math.PI * 2,
        x: w / 2 + Math.cos(angle) * (Math.min(w, h) * 0.32),
        y: h / 2 + Math.sin(angle) * (Math.min(w, h) * 0.32),
        vx: 0,
        vy: 0,
      }
    })
    stateRef.current.edges = edges
    stateRef.current.particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }))
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
      const s = settingsRef.current
      const state = stateRef.current
      state.time += 0.016
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      const nodeMap = new Map(state.nodes.map((n) => [n.id, n]))

      for (const node of state.nodes) {
        if (state.dragging === node.id) continue
        node.vx += (w / 2 - node.x) * 0.0018
        node.vy += (h / 2 - node.y) * 0.0018
        node.vx *= 0.88
        node.vy *= 0.88
        node.pulse += 0.04
      }

      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const a = state.nodes[i]
          const b = state.nodes[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.max(Math.hypot(dx, dy), 1)
          const force = 700 / (dist * dist)
          if (state.dragging !== a.id) { a.vx -= (dx / dist) * force; a.vy -= (dy / dist) * force }
          if (state.dragging !== b.id) { b.vx += (dx / dist) * force; b.vy += (dy / dist) * force }
        }
      }

      for (const edge of state.edges) {
        const a = nodeMap.get(edge.source)
        const b = nodeMap.get(edge.target)
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.max(Math.hypot(dx, dy), 1)
        const force = (dist - 110) * 0.012
        if (state.dragging !== a.id) { a.vx += (dx / dist) * force; a.vy += (dy / dist) * force }
        if (state.dragging !== b.id) { b.vx -= (dx / dist) * force; b.vy -= (dy / dist) * force }
      }

      for (const node of state.nodes) {
        if (state.dragging === node.id) continue
        node.x += node.vx
        node.y += node.vy
        node.x = Math.max(node.r + 4, Math.min(w - node.r - 4, node.x))
        node.y = Math.max(node.r + 4, Math.min(h - node.r - 4, node.y))
      }

      // Background gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7)
      grad.addColorStop(0, s.graphBg)
      grad.addColorStop(0.5, s.bgPrimary)
      grad.addColorStop(1, '#000000')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = `${s.graphEdge}22`
      ctx.lineWidth = 0.5
      const grid = 40
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      // Particles
      if (s.graphParticles) {
        for (const p of state.particles) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `${s.accentLight}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
        }
      }

      // Edges with glow
      for (const edge of state.edges) {
        const a = nodeMap.get(edge.source)
        const b = nodeMap.get(edge.target)
        if (!a || !b) continue
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = s.graphEdge
        ctx.lineWidth = 1.5
        ctx.globalAlpha = 0.6
        ctx.shadowColor = s.accent
        ctx.shadowBlur = 6
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      // Nodes
      for (const node of state.nodes) {
        const isActive = node.id === activeNoteId
        const pulseR = node.r + Math.sin(node.pulse) * (isActive ? 2 : 0.8)
        const color = isActive ? s.graphNodeActive : s.graphNode

        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseR + 4, 0, Math.PI * 2)
        ctx.fillStyle = `${color}33`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2)
        ctx.shadowColor = color
        ctx.shadowBlur = isActive ? 18 : 10
        const nodeGrad = ctx.createRadialGradient(node.x - 2, node.y - 2, 0, node.x, node.y, pulseR)
        nodeGrad.addColorStop(0, isActive ? '#fff' : s.accentLight)
        nodeGrad.addColorStop(0.4, color)
        nodeGrad.addColorStop(1, s.graphEdge)
        ctx.fillStyle = nodeGrad
        ctx.fill()
        ctx.shadowBlur = 0

        if (isActive) {
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 2
          ctx.stroke()
        }

        ctx.fillStyle = s.textPrimary
        ctx.font = `600 10px ${getComputedStyle(document.documentElement).getPropertyValue('--font-body') || 'system-ui'}`
        ctx.textAlign = 'center'
        const label = node.title.length > 12 ? `${node.title.slice(0, 10)}…` : node.title
        ctx.fillText(label, node.x, node.y + pulseR + 14)
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const getNodeAt = (x: number, y: number) => {
      for (const node of [...stateRef.current.nodes].reverse()) {
        if (Math.hypot(node.x - x, node.y - y) <= node.r + 10) return node
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
      try { canvas.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
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
