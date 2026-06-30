import { useCallback, useEffect, useRef, useState } from 'react'
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

function dist(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

export function GraphView({ notes, activeNoteId, settings, onSelectNote }: GraphViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settingsRef = useRef(settings)
  const [zoomLabel, setZoomLabel] = useState('100%')

  const stateRef = useRef({
    nodes: [] as { id: string; x: number; y: number; vx: number; vy: number; title: string; r: number; pulse: number }[],
    edges: [] as { source: string; target: string }[],
    particles: [] as Particle[],
    dragging: null as string | null,
    panning: false,
    panStart: { x: 0, y: 0, panX: 0, panY: 0 },
    viewport: { zoom: 1, panX: 0, panY: 0 },
    pinchDist: null as number | null,
    time: 0,
  })

  settingsRef.current = settings

  const initGraph = useCallback(() => {
    const wrap = wrapRef.current
    const w = wrap?.clientWidth ?? 300
    const h = wrap?.clientHeight ?? 400
    const { nodes, edges } = buildGraph(notes)
    stateRef.current.nodes = nodes.map((n, i) => {
      const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2
      const r = 10 + Math.min(n.linkCount * 2.5, 16)
      return {
        id: n.id,
        title: n.title,
        r,
        pulse: Math.random() * Math.PI * 2,
        x: w / 2 + Math.cos(angle) * Math.min(w, h) * 0.28,
        y: h / 2 + Math.sin(angle) * Math.min(w, h) * 0.28,
        vx: 0,
        vy: 0,
      }
    })
    stateRef.current.edges = edges
    stateRef.current.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.45 + 0.1,
    }))
  }, [notes])

  const setZoom = useCallback((z: number) => {
    const v = stateRef.current.viewport
    v.zoom = Math.max(0.25, Math.min(4, z))
    setZoomLabel(`${Math.round(v.zoom * 100)}%`)
  }, [])

  useEffect(() => {
    initGraph()
  }, [initGraph])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    const screenToWorld = (sx: number, sy: number, w: number, h: number) => {
      const { zoom, panX, panY } = stateRef.current.viewport
      return {
        x: (sx - w / 2 - panX) / zoom + w / 2,
        y: (sy - h / 2 - panY) / zoom + h / 2,
      }
    }

    const getNodeAt = (sx: number, sy: number, w: number, h: number) => {
      const { x, y } = screenToWorld(sx, sy, w, h)
      for (const node of [...stateRef.current.nodes].reverse()) {
        if (Math.hypot(node.x - x, node.y - y) <= node.r + 12) return node
      }
      return null
    }

    let frame = 0
    const tick = () => {
      const s = settingsRef.current
      const state = stateRef.current
      state.time += 0.016
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      const nodeMap = new Map(state.nodes.map((n) => [n.id, n]))
      const { zoom, panX, panY } = state.viewport

      if (!state.dragging && !state.panning) {
        for (const node of state.nodes) {
          node.vx += (w / 2 - node.x) * 0.0016
          node.vy += (h / 2 - node.y) * 0.0016
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
            const d = Math.max(Math.hypot(dx, dy), 1)
            const f = 650 / (d * d)
            a.vx -= (dx / d) * f
            a.vy -= (dy / d) * f
            b.vx += (dx / d) * f
            b.vy += (dy / d) * f
          }
        }
        for (const edge of state.edges) {
          const a = nodeMap.get(edge.source)
          const b = nodeMap.get(edge.target)
          if (!a || !b) continue
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.max(Math.hypot(dx, dy), 1)
          const f = (d - 110) * 0.01
          a.vx += (dx / d) * f
          a.vy += (dy / d) * f
          b.vx -= (dx / d) * f
          b.vy -= (dy / d) * f
        }
        for (const node of state.nodes) {
          node.x += node.vx
          node.y += node.vy
        }
      }

      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75)
      grad.addColorStop(0, s.graphBg)
      grad.addColorStop(0.55, s.bgPrimary)
      grad.addColorStop(1, '#000')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      ctx.translate(w / 2 + panX, h / 2 + panY)
      ctx.scale(zoom, zoom)
      ctx.translate(-w / 2, -h / 2)

      ctx.strokeStyle = `${s.graphEdge}18`
      ctx.lineWidth = 0.5 / zoom
      const grid = 40
      for (let x = -w; x < w * 2; x += grid) {
        ctx.beginPath()
        ctx.moveTo(x, -h)
        ctx.lineTo(x, h * 2)
        ctx.stroke()
      }
      for (let y = -h; y < h * 2; y += grid) {
        ctx.beginPath()
        ctx.moveTo(-w, y)
        ctx.lineTo(w * 2, y)
        ctx.stroke()
      }

      if (s.graphParticles) {
        for (const p of state.particles) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < -20) p.x = w + 20
          if (p.x > w + 20) p.x = -20
          if (p.y < -20) p.y = h + 20
          if (p.y > h + 20) p.y = -20
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `${s.accentLight}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
        }
      }

      for (const edge of state.edges) {
        const a = nodeMap.get(edge.source)
        const b = nodeMap.get(edge.target)
        if (!a || !b) continue
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = s.graphEdge
        ctx.lineWidth = 1.5 / zoom
        ctx.globalAlpha = 0.55
        ctx.shadowColor = s.accent
        ctx.shadowBlur = 8 / zoom
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      for (const node of state.nodes) {
        const isActive = node.id === activeNoteId
        const pulseR = node.r + Math.sin(node.pulse) * (isActive ? 2.5 : 1)
        const color = isActive ? s.graphNodeActive : s.graphNode

        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseR + 5, 0, Math.PI * 2)
        ctx.fillStyle = `${color}40`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2)
        ctx.shadowColor = color
        ctx.shadowBlur = (isActive ? 20 : 12) / zoom
        const ng = ctx.createRadialGradient(node.x - 2, node.y - 2, 0, node.x, node.y, pulseR)
        ng.addColorStop(0, isActive ? '#fff' : s.accentLight)
        ng.addColorStop(0.45, color)
        ng.addColorStop(1, s.graphEdge)
        ctx.fillStyle = ng
        ctx.fill()
        ctx.shadowBlur = 0

        if (isActive) {
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 2 / zoom
          ctx.stroke()
        }

        ctx.fillStyle = s.textPrimary
        ctx.font = `600 ${10 / zoom}px system-ui, sans-serif`
        ctx.textAlign = 'center'
        const label = node.title.length > 14 ? `${node.title.slice(0, 12)}…` : node.title
        ctx.fillText(label, node.x, node.y + pulseR + 14 / zoom)
      }

      ctx.restore()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      const w = rect.width
      const h = rect.height
      const node = getNodeAt(sx, sy, w, h)
      if (node) {
        stateRef.current.dragging = node.id
        canvas.setPointerCapture(e.pointerId)
      } else {
        stateRef.current.panning = true
        stateRef.current.panStart = {
          x: e.clientX,
          y: e.clientY,
          panX: stateRef.current.viewport.panX,
          panY: stateRef.current.viewport.panY,
        }
        canvas.setPointerCapture(e.pointerId)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const state = stateRef.current
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      if (state.dragging) {
        const { x, y } = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, w, h)
        const node = state.nodes.find((n) => n.id === state.dragging)
        if (node) {
          node.x = x
          node.y = y
          node.vx = 0
          node.vy = 0
        }
        return
      }

      if (state.panning) {
        state.viewport.panX = state.panStart.panX + (e.clientX - state.panStart.x)
        state.viewport.panY = state.panStart.panY + (e.clientY - state.panStart.y)
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      const state = stateRef.current
      const rect = canvas.getBoundingClientRect()
      if (state.dragging) {
        const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
        if (node && node.id === state.dragging) onSelectNote(node.id)
      }
      state.dragging = null
      state.panning = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        stateRef.current.pinchDist = dist(e.touches[0], e.touches[1])
        stateRef.current.panning = false
        stateRef.current.dragging = null
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || stateRef.current.pinchDist === null) return
      e.preventDefault()
      const d = dist(e.touches[0], e.touches[1])
      const scale = d / stateRef.current.pinchDist
      const v = stateRef.current.viewport
      v.zoom = Math.max(0.25, Math.min(4, v.zoom * scale))
      stateRef.current.pinchDist = d
      setZoomLabel(`${Math.round(v.zoom * 100)}%`)
    }

    const onTouchEnd = () => {
      stateRef.current.pinchDist = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeNoteId, onSelectNote, initGraph, setZoom])

  if (notes.length === 0) {
    return <div className="graph-empty">Create notes to see the graph.</div>
  }

  return (
    <div className="graph-view">
      <div className="graph-hint">Pinch to zoom · Drag space to pan · Tap node to open</div>
      <div ref={wrapRef} className="graph-canvas-wrap">
        <canvas ref={canvasRef} className="graph-canvas" />
      </div>
      <div className="graph-zoom-controls">
        <button type="button" aria-label="Zoom out" onClick={() => setZoom(stateRef.current.viewport.zoom * 0.8)}>
          −
        </button>
        <span className="graph-zoom-label">{zoomLabel}</span>
        <button type="button" aria-label="Zoom in" onClick={() => setZoom(stateRef.current.viewport.zoom * 1.25)}>
          +
        </button>
        <button
          type="button"
          className="graph-reset-btn"
          aria-label="Reset view"
          onClick={() => {
            stateRef.current.viewport = { zoom: 1, panX: 0, panY: 0 }
            setZoom(1)
          }}
        >
          ⟲
        </button>
      </div>
    </div>
  )
}
