import { useEffect, useRef, useState } from 'react'

const MAX_PARTICLES = 100
const SPAWN_INTERVAL_MS = 26

type Particle = {
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

export function CursorStarTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
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

    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (cx: number, cy: number) => {
      const list = particles.current
      if (list.length >= MAX_PARTICLES) list.shift()
      const ang = Math.random() * Math.PI * 2
      const speed = 0.12 + Math.random() * 0.38
      list.push({
        x: cx + (Math.random() - 0.5) * 5,
        y: cy + (Math.random() - 0.5) * 5,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        t: 0,
        maxLife: 0.45 + Math.random() * 0.55,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.12,
        arm: 1.8 + Math.random() * 2.4,
      })
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
      ctx.shadowColor = 'rgba(200, 170, 125, 0.85)'
      ctx.shadowBlur = 5 + fade * 4
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
      ctx.shadowBlur = 3
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
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      const list = particles.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]!
        p.t += dt
        if (p.t >= p.maxLife) {
          list.splice(i, 1)
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
      particles.current = []
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
