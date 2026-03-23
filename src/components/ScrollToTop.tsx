import { useLenis } from 'lenis/react'
import type { ScrollCallback } from 'lenis'
import { useCallback, useEffect, useRef, useState } from 'react'

const SHOW_AFTER = 420

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

export function ScrollToTop() {
  const lenis = useLenis()
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    const apply = (scrollY: number) => {
      const next = scrollY > SHOW_AFTER
      if (next === visibleRef.current) return
      visibleRef.current = next
      setVisible(next)
    }

    if (!lenis) {
      const onWinScroll = () => apply(window.scrollY)
      window.addEventListener('scroll', onWinScroll, { passive: true })
      onWinScroll()
      return () => window.removeEventListener('scroll', onWinScroll)
    }

    const onScroll: ScrollCallback = (instance) => {
      apply(instance.scroll)
    }
    lenis.on('scroll', onScroll)
    apply(lenis.scroll)
    return () => {
      lenis.off('scroll', onScroll)
    }
  }, [lenis])

  const scrollUp = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (lenis) {
      lenis.scrollTo(0, reduced ? { immediate: true } : { duration: 1.05 })
      return
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [lenis])

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Наверх страницы"
      title="Наверх"
      className={`fixed bottom-7 right-5 z-[45] flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/22 bg-[#0a0908]/75 text-amber-100/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_-8px_rgba(0,0,0,0.65)] backdrop-blur-md transition-all duration-300 ease-out hover:border-amber-200/40 hover:bg-[#12100e]/88 hover:text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] md:bottom-10 md:right-8 md:h-12 md:w-12 ${
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <ChevronUpIcon className="h-5 w-5 md:h-[1.35rem] md:w-[1.35rem]" />
    </button>
  )
}
