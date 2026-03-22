import { useEffect, type ReactNode } from 'react'

/** Глобальные координаты курсора для CSS и WebGL (R3F не пробрасывает React context в Canvas). */
export const viewportCursor = {
  x: 0,
  y: 0,
  active: false,
}

export function ViewportCursorProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      viewportCursor.x = e.clientX
      viewportCursor.y = e.clientY
      viewportCursor.active = true
    }
    const clear = () => {
      viewportCursor.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', clear)
    window.addEventListener('pointercancel', clear)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', clear)
      window.removeEventListener('pointercancel', clear)
    }
  }, [])

  return <>{children}</>
}
