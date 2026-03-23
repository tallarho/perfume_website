import { useEffect, useRef, useState } from 'react'

const MAX_PARTICLES = 56
const SPAWN_INTERVAL_MS = 28
const MAX_DPR = 1.25

type Particle = {
  alive: boolean
  x: number
  y: number
  vx: number
  vy: number
  t: number
  maxLife: number
  rot: number
  spin: number
  arm: number
}

function createPool(n: number): Particle[] {
  const pool: Particle[] = new Array(n)
  for (let i = 0; i < n; i++) {
    pool[i] = {
      alive: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      t: 0,
      maxLife: 1,
      rot: 0,
      spin: 0,
      arm: 1,
    }
  }
  return pool
}

export function CursorStarTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<Particle[] | null>(null)
  const lastSpawn = useRef(0)
  const rafRef = useRef(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    if (reduced) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const pool = createPool(MAX_PARTICLES)
    poolRef.current = pool

    let last = performance.now()
    const viewRef = { w: window.innerWidth, h: window.innerHeight }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      viewRef.w = window.innerWidth
      viewRef.h = window.innerHeight
      const w = viewRef.w
      const h = viewRef.h
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const acquireSlot = (): Particle => {
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = pool[i]!
        if (!p.alive) return p
      }
      let oldest = 0
      let maxT = pool[0]!.t
      for (let i = 1; i < MAX_PARTICLES; i++) {
        const p = pool[i]!
        if (p.t > maxT) {
          maxT = p.t
          oldest = i
        }
      }
      return pool[oldest]!
    }

    const spawn = (cx: number, cy: number) => {
      const p = acquireSlot()
      const ang = Math.random() * Math.PI * 2
      const speed = 0.12 + Math.random() * 0.38
      p.alive = true
      p.x = cx + (Math.random() - 0.5) * 5
      p.y = cy + (Math.random() - 0.5) * 5
      p.vx = Math.cos(ang) * speed
      p.vy = Math.sin(ang) * speed
      p.t = 0
      p.maxLife = 0.45 + Math.random() * 0.55
      p.rot = Math.random() * Math.PI
      p.spin = (Math.random() - 0.5) * 0.12
      p.arm = 1.8 + Math.random() * 2.4
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - lastSpawn.current < SPAWN_INTERVAL_MS) return
      lastSpawn.current = now
      const extra = Math.random() < 0.35 ? 1 : 0
      for (let k = 0; k <= extra; k++) {
        spawn(e.clientX, e.clientY)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    const drawSparkle = (p: Particle, fade: number) => {
      const arm = p.arm * (0.55 + 0.45 * fade)
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = fade * fade * 0.9
      ctx.strokeStyle = 'rgba(255, 236, 215, 0.92)'
      ctx.lineWidth = 0.75
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(0, -arm)
      ctx.lineTo(0, arm)
      ctx.moveTo(-arm, 0)
      ctx.lineTo(arm, 0)
      ctx.stroke()
      const d = arm * 0.58
      ctx.globalAlpha = fade * fade * 0.42
      ctx.beginPath()
      ctx.moveTo(-d, -d)
      ctx.lineTo(d, d)
      ctx.moveTo(d, -d)
      ctx.lineTo(-d, d)
      ctx.stroke()
      ctx.restore()
    }

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const w = viewRef.w
      const h = viewRef.h

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = pool[i]!
        if (!p.alive) continue
        p.t += dt
        if (p.t >= p.maxLife) {
          p.alive = false
          continue
        }
        p.x += p.vx * dt * 52
        p.y += p.vy * dt * 52
        p.rot += p.spin * dt * 55
        p.vx *= 0.965
        p.vy *= 0.965
        const fade = 1 - p.t / p.maxLife
        drawSparkle(p, fade)
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafRef.current)
      poolRef.current = null
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      aria-hidden
    />
  )
}
