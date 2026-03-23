import { memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Якорь для ссылки с героя: Arabian Oud — на lg-сетке 4×N вторая карточка второго ряда.
 */
export const ARABIAN_OUD_MADAWI_CARD_ID = 'product-arabian-oud-madawi'
/** Рамка с фото — золотая вспышка при клике по 1-й голограмме. */
export const ARABIAN_OUD_MADAWI_PHOTO_FRAME_ID = 'product-arabian-oud-madawi-photo-frame'
/** Вторая голограмма в герое — Dior Sauvage (клик ведёт на эту карточку). */
export const SAUVAGE_DIOR_CARD_ID = 'product-sauvage-dior'
/** Рамка с фото — вспышка DarkBlue при клике по 2-й голограмме. */
export const SAUVAGE_DIOR_PHOTO_FRAME_ID = 'product-sauvage-dior-photo-frame'
/** Третья голограмма — Initio Side Effect. */
export const INITIO_SIDE_EFFECT_CARD_ID = 'product-initio-side-effect'
/** Рамка с фото (бордер вокруг изображения) — вспышка MediumOrchid при клике по 3-й голограмме. */
export const INITIO_SIDE_EFFECT_PHOTO_FRAME_ID = 'product-initio-side-effect-photo-frame'

/** Событие с `detail.cardId` — мигание карточки в коллекции (клик по голограмме в герое). */
export const FLASH_PRODUCT_CARD_EVENT = 'dikiy-flash-product-card' as const

type Product = {
  name: string
  notes: string
  image: string
  offset: string
  cardId?: string
}

/**
 * Порядок карточек, фото и offset — без изменений.
 * Названия 1–16 — твой список по порядку слотов (слева направо, сверху вниз).
 */
const products: Product[] = [
  {
    name: 'Bois Impérial Essential',
    notes: 'Essential Parfums',
    image: '/perfumes/Blue Talisman Ex Nihilo.png',
    offset: 'lg:translate-y-0',
  },
  {
    name: 'Sauvage Dior',
    notes: 'Christian Dior',
    image: '/perfumes/Bois-Imperial-Essential-Parfums.png',
    offset: 'lg:translate-y-14',
    cardId: SAUVAGE_DIOR_CARD_ID,
  },
  {
    name: 'Blue Talisman Ex Nihilo',
    notes: 'Ex Nihilo',
    image: '/perfumes/Bvlgari.png',
    offset: 'lg:translate-y-6',
  },
  {
    name: 'Creed Aventus',
    notes: 'Creed',
    image: '/perfumes/Christian Dior Sauvage.png',
    offset: 'lg:translate-y-10',
  },
  {
    name: 'Intriga Devil',
    notes: 'DikiY Perfume',
    image: '/perfumes/creed-aventus.png',
    offset: 'lg:-translate-y-2',
  },
  {
    name: 'Arabian Oud Madawi Gold',
    notes: 'Arabian Oud',
    image: '/perfumes/Devils Intrigue.png',
    offset: 'lg:translate-y-16',
    cardId: ARABIAN_OUD_MADAWI_CARD_ID,
  },
  {
    name: 'Marc-Antoine Barrois Tilia',
    notes: 'Marc-Antoine Barrois',
    image: '/perfumes/Escentric Molecules Molecule 02.png',
    offset: 'lg:translate-y-0',
  },
  {
    name: 'Louis Vuitton Symphony',
    notes: 'Louis Vuitton',
    image: '/perfumes/ganymede.png',
    offset: 'lg:translate-y-14',
  },
  {
    name: 'Ombre Nomade Louis Vuitton',
    notes: 'Louis Vuitton',
    image: '/perfumes/Initio SIDE EFFECT.png',
    offset: 'lg:translate-y-6',
  },
  {
    name: 'Tiziana Terenzi Kirke',
    notes: 'Tiziana Terenzi',
    image: '/perfumes/Louis Vuitton Ombre Nomade.png',
    offset: 'lg:translate-y-10',
  },
  {
    name: 'Imagination Louis Vuitton',
    notes: 'Louis Vuitton',
    image: '/perfumes/louis-vuitton-imagination.png',
    offset: 'lg:-translate-y-2',
  },
  {
    name: 'Initio Side Effect',
    notes: 'Initio Parfums',
    image: '/perfumes/initio-side-effect.png',
    offset: 'lg:translate-y-16',
    cardId: INITIO_SIDE_EFFECT_CARD_ID,
  },
  {
    name: "Louis Vuitton L'Immensité",
    notes: 'Louis Vuitton',
    image: '/perfumes/louis-vuitton-symphony.png',
    offset: 'lg:translate-y-0',
  },
  {
    name: 'Marc-Antoine Barrois Ganymede',
    notes: 'Marc-Antoine Barrois',
    image: '/perfumes/madawi.png',
    offset: 'lg:translate-y-14',
  },
  {
    name: 'Le Gemme Tygar Bvlgari',
    notes: 'Bvlgari',
    image: '/perfumes/tilia.png',
    offset: 'lg:translate-y-6',
  },
  {
    name: 'Escentric Molecules Molecule 02',
    notes: 'Escentric Molecules',
    image: '/perfumes/Tiziana Terenzi Kirke.png',
    offset: 'lg:translate-y-10',
  },
]

const volumeOptions = ['10 мл', '20 мл', '30 мл', '50 мл'] as const

/** Появление при скролле: лёгкий подъём + fade, задержка по колонке (волна в ряду). */
function RevealOnScroll({
  children,
  columnIndex,
}: {
  children: ReactNode
  columnIndex: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.07, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const delayMs = (columnIndex % 4) * 72

  return (
    <div
      ref={ref}
      className={inView ? 'product-reveal product-reveal--in' : 'product-reveal'}
      style={{ '--reveal-delay': `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

/** Фото заполняет прямоугольник карточки (object-cover), края совпадают со скруглением. */
const ProductCard = memo(function ProductCard({
  name,
  image,
  photoFrameId,
}: {
  name: string
  image: string
  /** Якорь для обводки по рамке фото (2-я / 3-я голограмма). */
  photoFrameId?: string
}) {
  return (
    <div
      className="group product-card-glow w-full shrink-0 overflow-visible rounded-xl border border-white/[0.08] transition-[border-color,box-shadow] duration-300 ease-out hover:border-amber-200/40"
      aria-label={name}
    >
      <div
        id={photoFrameId}
        className="overflow-hidden rounded-xl bg-[#0c0b0a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
      >
        <div className="relative w-full aspect-[3/4]">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.045]"
          />
        </div>
      </div>
    </div>
  )
})

const PHOTO_FRAME_FLASH_BY_CARD: Record<string, { frameId: string; className: string }> = {
  [ARABIAN_OUD_MADAWI_CARD_ID]: {
    frameId: ARABIAN_OUD_MADAWI_PHOTO_FRAME_ID,
    className: 'product-card-flash',
  },
  [SAUVAGE_DIOR_CARD_ID]: {
    frameId: SAUVAGE_DIOR_PHOTO_FRAME_ID,
    className: 'product-card-flash-darkblue',
  },
  [INITIO_SIDE_EFFECT_CARD_ID]: {
    frameId: INITIO_SIDE_EFFECT_PHOTO_FRAME_ID,
    className: 'product-card-flash-orchid',
  },
}

const ALL_FLASH_CLASSES = [
  'product-card-flash',
  'product-card-flash-orchid',
  'product-card-flash-darkblue',
] as const

/** Задержка перед вспышкой (после скролла к карточке). */
const HERO_FLASH_START_DELAY_MS = 380
/** Длительность анимации вспышки. */
const HERO_FLASH_ANIMATION_MS = 1150

const FLASH_TARGET_CLASS = 'product-card-glow--flash-target'
const FLASH_LOCK_ATTR = 'data-product-flash-lock'

let flashInteractionLockTimer: ReturnType<typeof setTimeout> | null = null

function clearProductFlashInteractionLock() {
  document.documentElement.removeAttribute(FLASH_LOCK_ATTR)
  document.querySelectorAll(`.${FLASH_TARGET_CLASS}`).forEach((node) => {
    node.classList.remove(FLASH_TARGET_CLASS)
  })
}

/** Пока идёт подсветка с героя — отключаем hover-свечение на остальных карточках. */
function applyProductFlashInteractionLock(cardId: string) {
  if (flashInteractionLockTimer !== null) {
    clearTimeout(flashInteractionLockTimer)
    flashInteractionLockTimer = null
  }
  clearProductFlashInteractionLock()

  const article = document.getElementById(cardId)
  const glow = article?.querySelector('.product-card-glow')
  if (!article || !glow) return

  document.documentElement.setAttribute(FLASH_LOCK_ATTR, '')
  glow.classList.add(FLASH_TARGET_CLASS)

  flashInteractionLockTimer = window.setTimeout(() => {
    clearProductFlashInteractionLock()
    flashInteractionLockTimer = null
  }, HERO_FLASH_START_DELAY_MS + HERO_FLASH_ANIMATION_MS)
}

function scheduleProductCardFlash(cardId: string) {
  window.setTimeout(() => {
    const photoFlash = PHOTO_FRAME_FLASH_BY_CARD[cardId]
    const targetId = photoFlash?.frameId ?? cardId
    const el = document.getElementById(targetId)
    if (!el) return
    const flashClass = photoFlash?.className ?? 'product-card-flash'
    el.classList.remove(...ALL_FLASH_CLASSES)
    void el.offsetWidth
    el.classList.add(flashClass)
    window.setTimeout(() => el.classList.remove(flashClass), HERO_FLASH_ANIMATION_MS)
  }, HERO_FLASH_START_DELAY_MS)
}

export function EtherealExtractions() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const onFlashEvent = (e: Event) => {
      const ce = e as CustomEvent<{ cardId?: string }>
      const id = ce.detail?.cardId
      if (!id) return
      applyProductFlashInteractionLock(id)
      scheduleProductCardFlash(id)
    }
    window.addEventListener(FLASH_PRODUCT_CARD_EVENT, onFlashEvent as EventListener)
    return () => {
      window.removeEventListener(FLASH_PRODUCT_CARD_EVENT, onFlashEvent as EventListener)
      if (flashInteractionLockTimer !== null) {
        clearTimeout(flashInteractionLockTimer)
        flashInteractionLockTimer = null
      }
      clearProductFlashInteractionLock()
    }
  }, [])

  useEffect(() => {
    if (!selectedProduct) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProduct(null)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [selectedProduct])

  return (
    <>
      <section
        id="collections"
        className="relative overflow-x-clip border-t border-white/[0.06] bg-void-deep/90 px-6 py-24 backdrop-blur-[1px] md:px-10 md:py-32"
      >
        {/* Угловой узор слева */}
        <div
          className="pointer-events-none absolute inset-y-20 left-2 w-11 sm:left-4 sm:inset-y-24 md:left-6 lg:left-10"
          aria-hidden
        >
          <div className="absolute top-0 left-0 h-2.5 w-2.5 border-l border-t border-amber-200/45" />
          <div className="absolute top-0 left-0 h-[1px] w-9 bg-gradient-to-r from-amber-200/50 to-transparent sm:w-11" />
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-amber-200/45 via-amber-200/12 to-amber-200/45" />
          <div className="absolute bottom-0 left-0 h-[1px] w-9 bg-gradient-to-r from-amber-200/50 to-transparent sm:w-11" />
          <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-amber-200/45" />
          <div className="absolute top-1/2 left-0 h-px w-6 -translate-y-1/2 bg-gradient-to-r from-amber-200/25 to-transparent sm:w-8" />
        </div>
        {/* Угловой узор справа */}
        <div
          className="pointer-events-none absolute inset-y-20 right-2 w-11 sm:right-4 sm:inset-y-24 md:right-6 lg:right-10"
          aria-hidden
        >
          <div className="absolute top-0 right-0 h-2.5 w-2.5 border-r border-t border-amber-200/45" />
          <div className="absolute top-0 right-0 h-[1px] w-9 bg-gradient-to-l from-amber-200/50 to-transparent sm:w-11" />
          <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-amber-200/45 via-amber-200/12 to-amber-200/45" />
          <div className="absolute right-0 bottom-0 h-[1px] w-9 bg-gradient-to-l from-amber-200/50 to-transparent sm:w-11" />
          <div className="absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-amber-200/45" />
          <div className="absolute top-1/2 right-0 h-px w-6 -translate-y-1/2 bg-gradient-to-l from-amber-200/25 to-transparent sm:w-8" />
        </div>

        <div className="relative z-[1] mx-auto max-w-7xl">
          <div className="mb-20 lg:mb-28">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-5 md:gap-x-8 lg:gap-x-10">
              <h2 className="font-serif text-[clamp(3rem,12vw,7.5rem)] font-light uppercase leading-[0.92] tracking-[0.04em] text-white md:tracking-[0.06em]">
                Коллекция
              </h2>
              <p className="max-w-[min(100%,20rem)] font-sans text-base font-light uppercase leading-snug tracking-[0.14em] text-white/55 sm:max-w-xs sm:pb-1.5 md:text-lg md:leading-snug md:tracking-[0.16em]">
                оригинальные и масляные духи
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:[grid-auto-rows:1fr]">
            {products.map((p, index) => (
              <article
                key={p.image}
                id={p.cardId}
                className={`flex h-full min-h-0 flex-col ${p.offset}`}
              >
                <RevealOnScroll columnIndex={index}>
                  <ProductCard
                    name={p.name}
                    image={p.image}
                    photoFrameId={
                      p.cardId === ARABIAN_OUD_MADAWI_CARD_ID
                        ? ARABIAN_OUD_MADAWI_PHOTO_FRAME_ID
                        : p.cardId === SAUVAGE_DIOR_CARD_ID
                          ? SAUVAGE_DIOR_PHOTO_FRAME_ID
                          : p.cardId === INITIO_SIDE_EFFECT_CARD_ID
                          ? INITIO_SIDE_EFFECT_PHOTO_FRAME_ID
                          : undefined
                    }
                  />
                  <div className="mt-8 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-3 min-h-[3rem] min-w-0 flex-1 font-serif text-xl font-light leading-snug text-white md:min-h-[4rem] md:text-2xl">
                        {p.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(p)}
                        className="shrink-0 border-b border-white/25 pb-0.5 pt-1 font-sans text-[10px] font-medium tracking-[0.25em] text-white/80 uppercase transition-colors hover:border-white hover:text-white"
                      >
                        Купить
                      </button>
                    </div>
                    <p className="mt-2 line-clamp-2 min-h-[2.75rem] font-sans text-[11px] leading-relaxed tracking-[0.12em] text-white/45 uppercase">
                      {p.notes}
                    </p>
                  </div>
                </RevealOnScroll>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div
        className={`fixed inset-0 z-[120] flex items-center justify-center px-6 transition-all duration-300 ${
          selectedProduct
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!selectedProduct}
      >
        <button
          type="button"
          aria-label="Закрыть окно выбора объема"
          onClick={() => setSelectedProduct(null)}
          className={`absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 ${
            selectedProduct ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedProduct ? `Выбор объема для ${selectedProduct.name}` : 'Выбор объема'
          }
          className={`relative w-full max-w-md rounded-2xl border border-white/15 bg-[#101010] p-6 shadow-[0_28px_80px_-30px_rgba(0,0,0,0.9)] transition-all duration-300 md:p-7 ${
            selectedProduct ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
          }`}
        >
          <p className="font-sans text-[10px] tracking-[0.2em] text-white/45 uppercase">Купить</p>
          <h3 className="mt-3 font-serif text-2xl font-light text-white">
            {selectedProduct?.name ?? 'Выберите объем'}
          </h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-white/60">
            Уточните объем, который вам нужен:
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {volumeOptions.map((volume) => (
              <button
                key={volume}
                type="button"
                className="rounded-lg border border-white/16 bg-white/[0.02] px-4 py-3 text-center font-sans text-xs tracking-[0.15em] text-white/85 uppercase transition-colors hover:border-white/30 hover:bg-white/[0.05]"
              >
                {volume}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="mt-6 w-full rounded-lg border border-white/15 px-4 py-3 font-sans text-[10px] tracking-[0.18em] text-white/75 uppercase transition-colors hover:border-white/30 hover:text-white"
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  )
}
