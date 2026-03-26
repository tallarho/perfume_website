import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'

import {
  ARABIAN_OUD_MADAWI_CARD_ID,
  INITIO_SIDE_EFFECT_CARD_ID,
  SAUVAGE_DIOR_CARD_ID,
} from './productAnchors'

const HERO_PRODUCT_HASH_IDS = [
  ARABIAN_OUD_MADAWI_CARD_ID,
  SAUVAGE_DIOR_CARD_ID,
  INITIO_SIDE_EFFECT_CARD_ID,
] as const

/** Первая загрузка с якорем карточки из героя: убрать из URL. Возвращает true, если заменили hash. */
function stripHeroProductHashFromUrl(): boolean {
  const raw = window.location.hash
  if (!raw.startsWith('#')) return false
  const id = raw.slice(1)
  if (!HERO_PRODUCT_HASH_IDS.some((allowed) => allowed === id)) return false
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}`,
  )
  return true
}

function HeroProductHashResetNative() {
  useLayoutEffect(() => {
    if (!stripHeroProductHashFromUrl()) return
    window.scrollTo(0, 0)
  }, [])
  return null
}

function HeroProductHashResetLenis() {
  const lenis = useLenis()
  useLayoutEffect(() => {
    if (!stripHeroProductHashFromUrl()) return
    queueMicrotask(() => {
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    })
  }, [lenis])
  return null
}

/** Отступ под фиксированный хедер при переходе по якорям. */
const ANCHOR_OFFSET = -92

/** Баланс: плавно, но без «ленивого» догона. */
const lenisOptions = {
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.085,
  wheelMultiplier: 0.94,
  touchMultiplier: 1.22,
  anchors: {
    offset: ANCHOR_OFFSET,
    duration: 1.12,
  },
} as const

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (reducedMotion) {
    return (
      <>
        <HeroProductHashResetNative />
        {children}
      </>
    )
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <HeroProductHashResetLenis />
      {children}
    </ReactLenis>
  )
}
