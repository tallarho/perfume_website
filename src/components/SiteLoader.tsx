import { useEffect, useState } from 'react'

/** Мелкий шум без растрового масштаба — вектор, плитка. */
const NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

const LOADER_BG_LAYERS = `
  radial-gradient(ellipse 90% 65% at 50% 0%, rgba(55, 48, 42, 0.55) 0%, transparent 58%),
  radial-gradient(ellipse 85% 50% at 80% 20%, rgba(38, 32, 28, 0.35) 0%, transparent 45%),
  radial-gradient(ellipse 100% 70% at 50% 100%, rgba(0, 0, 0, 0.55) 0%, transparent 52%),
  linear-gradient(172deg, #221e1b 0%, #181512 32%, #100e0c 68%, #080706 100%)
`

const LOADER_MIN_MS = 420
const LOADER_MAX_MS = 2300

function waitFonts(): Promise<void> {
  const p = document.fonts?.ready
  return p ? p.then(() => undefined) : Promise.resolve()
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function SiteLoader() {
  const [phase, setPhase] = useState<'loading' | 'fade' | 'done'>('loading')

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cancelled = false

    const run = async () => {
      try {
        const startedAt = performance.now()
        await Promise.race([waitFonts(), sleep(LOADER_MAX_MS)])
        const elapsed = performance.now() - startedAt
        if (elapsed < LOADER_MIN_MS) {
          await sleep(LOADER_MIN_MS - elapsed)
        }
        if (cancelled) return
        await new Promise<void>((r) =>
          requestAnimationFrame(() => {
            requestAnimationFrame(() => r())
          }),
        )
      } catch {
        /* сеть: всё равно снимаем экран */
      }
      if (cancelled) return

      if (reduced) {
        setPhase('done')
        document.body.style.overflow = ''
        return
      }
      setPhase('fade')
    }

    void run()

    return () => {
      cancelled = true
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (phase !== 'fade') return
    document.body.style.overflow = ''
    const ms = 750
    const t = window.setTimeout(() => setPhase('done'), ms)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'done') return null

  const fading = phase === 'fade'

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center transition-opacity ease-out ${
        fading ? 'pointer-events-none opacity-0 duration-[750ms]' : 'opacity-100 duration-300'
      }`}
      role="status"
      aria-busy={!fading}
      aria-label={fading ? undefined : 'Загрузка сайта'}
    >
      <div
        className="absolute inset-0 bg-[#080706]"
        style={{ backgroundImage: LOADER_BG_LAYERS }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.1] mix-blend-soft-light"
        style={{
          backgroundImage: NOISE_DATA_URI,
          backgroundSize: '96px 96px',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: NOISE_DATA_URI,
          backgroundSize: '160px 160px',
        }}
        aria-hidden
      />
      <div className="relative z-[1] flex flex-col items-center text-center">
        <p className="font-sans text-[10px] font-medium tracking-[0.32em] text-white/38 uppercase md:text-[11px] md:tracking-[0.36em]">
          AURA PERFUME
        </p>
      </div>
    </div>
  )
}
