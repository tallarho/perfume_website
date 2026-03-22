import type { CSSProperties, ReactNode, RefObject } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { viewportCursor } from './ViewportCursorProvider'

/** Редкий фон по всему сайту (не перегружаем страницу) */
const FIELD_STAR_COUNT = 72
/** Плотнее у героя / спирали — та же «кучность», что у звёзд в canvas */
const HERO_CLUSTER_COUNT = 110
const BRIGHT_FIELD = 6
const BRIGHT_CLUSTER = 12

/** Радиус отталкивания (px) и смещение звезды */
const REPEL_RADIUS = 140
const REPEL_MAX_PX = 26

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

/** Равномерный диск в эллипсе вокруг верхнего центра (зона спирали) */
function sampleHeroCluster(rnd: () => number) {
  const ang = rnd() * Math.PI * 2
  const r = Math.sqrt(rnd())
  const left = 50 + Math.cos(ang) * r * 47
  const top = 24 + Math.sin(ang) * r * 38
  return {
    left: clamp(left, 1.5, 98.5),
    top: clamp(top, 2, 58),
  }
}

type StarStyle = {
  id: string | number
  left: number
  top: number
  size: number
  opacity: number
  duration: number
  delay: number
  glow: string
  driftX: string
  driftY: string
  driftDuration: number
  driftDelay: number
}

function buildGalaxyLikeStar(
  rnd: () => number,
  id: string | number,
  pos: { left: number; top: number },
): StarStyle {
  const size = 1 + Math.floor(rnd() * 2.4)
  const opacity = 0.42 + rnd() * 0.48
  const blur = 3 + size * 2.2
  const glow = `0 0 ${blur}px rgba(210, 230, 255, ${0.55 + rnd() * 0.35}), 0 0 ${blur + 8}px rgba(150, 195, 255, ${0.22 + rnd() * 0.25})`
  const dx = (rnd() - 0.5) * 44
  const dy = (rnd() - 0.5) * 36
  return {
    id,
    left: pos.left,
    top: pos.top,
    size,
    opacity,
    duration: 3.2 + rnd() * 4.8,
    delay: rnd() * 9,
    glow,
    driftX: `${dx.toFixed(1)}px`,
    driftY: `${dy.toFixed(1)}px`,
    driftDuration: 38 + rnd() * 52,
    driftDelay: rnd() * -80,
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

function useStarRepulsion(rootRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const nodesRef = useRef<HTMLElement[]>([])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) {
      nodesRef.current = []
      return
    }
    nodesRef.current = [...root.querySelectorAll<HTMLElement>('[data-cosmic-repel]')]
  }, [rootRef, enabled])

  useEffect(() => {
    if (!enabled) return

    let raf = 0

    const tick = () => {
      const root = rootRef.current
      const nodes = nodesRef.current
      if (!root || nodes.length === 0) {
        raf = requestAnimationFrame(tick)
        return
      }

      const rect = root.getBoundingClientRect()
      const vc = viewportCursor
      const m = vc.active ? { x: vc.x, y: vc.y } : null
      const R = REPEL_RADIUS
      const R2 = R * R

      for (const el of nodes) {
        const lp = parseFloat(el.dataset.leftPct ?? '0')
        const tp = parseFloat(el.dataset.topPct ?? '0')
        const sx = (lp / 100) * rect.width
        const sy = (tp / 100) * rect.height

        let ox = 0
        let oy = 0
        if (m) {
          const mx = m.x - rect.left
          const my = m.y - rect.top
          const dx = sx - mx
          const dy = sy - my
          const d2 = dx * dx + dy * dy
          if (d2 > 1e-4 && d2 < R2) {
            const d = Math.sqrt(d2)
            const t = 1 - d / R
            const smooth = t * t
            const mag = smooth * REPEL_MAX_PX
            ox = (dx / d) * mag
            oy = (dy / d) * mag
          }
        }

        const inner = el.firstElementChild as HTMLElement | null
        if (inner) {
          inner.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      for (const el of nodesRef.current) {
        const inner = el.firstElementChild as HTMLElement | null
        if (inner) inner.style.transform = ''
      }
    }
  }, [enabled, rootRef])
}

export function CosmicStarfield() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const repel = !reduced

  const { fieldStars, clusterStars, brightField, brightCluster } = useMemo(() => {
    const rndField = mulberry32(0x9e3779b9)
    const rndCluster = mulberry32(0x51b8c4af)
    const rndBrightF = mulberry32(0xbaadf00d)
    const rndBrightC = mulberry32(0xc0ffee)

    const fieldStars: StarStyle[] = []
    for (let i = 0; i < FIELD_STAR_COUNT; i++) {
      fieldStars.push(
        buildGalaxyLikeStar(rndField, `f-${i}`, {
          left: rndField() * 100,
          top: rndField() * 100,
        }),
      )
    }

    const clusterStars: StarStyle[] = []
    for (let i = 0; i < HERO_CLUSTER_COUNT; i++) {
      clusterStars.push(
        buildGalaxyLikeStar(rndCluster, `c-${i}`, sampleHeroCluster(rndCluster)),
      )
    }

    const brightField = Array.from({ length: BRIGHT_FIELD }, (_, i) => {
      const r = rndBrightF
      const dx = (r() - 0.5) * 40
      const dy = (r() - 0.5) * 34
      return {
        id: `bf-${i}`,
        left: r() * 100,
        top: r() * 100,
        delay: r() * 7,
        duration: 4.5 + (i % 4),
        driftX: `${dx.toFixed(1)}px`,
        driftY: `${dy.toFixed(1)}px`,
        driftDuration: 42 + r() * 48,
        driftDelay: r() * -70,
      }
    })

    const brightCluster = Array.from({ length: BRIGHT_CLUSTER }, (_, i) => {
      const r = rndBrightC
      const dx = (r() - 0.5) * 40
      const dy = (r() - 0.5) * 34
      return {
        id: `bc-${i}`,
        ...sampleHeroCluster(r),
        delay: r() * 6,
        duration: 4 + (i % 5),
        driftX: `${dx.toFixed(1)}px`,
        driftY: `${dy.toFixed(1)}px`,
        driftDuration: 40 + r() * 50,
        driftDelay: r() * -75,
      }
    })

    return { fieldStars, clusterStars, brightField, brightCluster }
  }, [])

  useStarRepulsion(rootRef, repel)

  const driftStyle = (s: {
    driftX: string
    driftY: string
    driftDuration: number
    driftDelay: number
  }) =>
    ({
      ['--drift-x' as string]: s.driftX,
      ['--drift-y' as string]: s.driftY,
      animationDuration: `${s.driftDuration}s`,
      animationDelay: `${s.driftDelay}s`,
    }) as CSSProperties

  const repelWrap = (left: number, top: number, children: ReactNode) => (
    <span
      data-cosmic-repel=""
      data-left-pct={left}
      data-top-pct={top}
      className="pointer-events-none inline-block"
    >
      <span className="pointer-events-none inline-block will-change-transform">{children}</span>
    </span>
  )

  const renderDot = (s: StarStyle) => (
    <span
      key={s.id}
      className="cosmic-star-drift pointer-events-none absolute"
      style={{
        left: `${s.left}%`,
        top: `${s.top}%`,
        ...driftStyle(s),
      }}
    >
      {repelWrap(
        s.left,
        s.top,
        <span
          className="pointer-events-none block rounded-full bg-white"
          style={{
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            boxShadow: s.glow,
            animation: `cosmic-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />,
      )}
    </span>
  )

  return (
    <div ref={rootRef} className="h-full min-h-screen w-full" aria-hidden>
      {fieldStars.map(renderDot)}
      {clusterStars.map(renderDot)}
      {brightField.map((s) => (
        <span
          key={s.id}
          className="cosmic-star-drift pointer-events-none absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            ...driftStyle(s),
          }}
        >
          {repelWrap(
            s.left,
            s.top,
            <span
              className="pointer-events-none block h-px w-px rounded-full bg-cyan-50/95"
              style={{
                boxShadow:
                  '0 0 5px 1px rgba(185, 225, 255, 0.95), 0 0 14px 3px rgba(130, 175, 255, 0.4)',
                animation: `cosmic-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />,
          )}
        </span>
      ))}
      {brightCluster.map((s) => (
        <span
          key={s.id}
          className="cosmic-star-drift pointer-events-none absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            ...driftStyle(s),
          }}
        >
          {repelWrap(
            s.left,
            s.top,
            <span
              className="pointer-events-none block h-px w-px rounded-full bg-cyan-50/95"
              style={{
                boxShadow:
                  '0 0 6px 1px rgba(195, 230, 255, 1), 0 0 16px 3px rgba(140, 190, 255, 0.45)',
                animation: `cosmic-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />,
          )}
        </span>
      ))}
    </div>
  )
}
