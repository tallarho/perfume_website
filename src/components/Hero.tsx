import { useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import type Lenis from 'lenis'
import { useLenis } from 'lenis/react'

import {
  ARABIAN_OUD_MADAWI_CARD_ID,
  FLASH_PRODUCT_CARD_EVENT,
  INITIO_SIDE_EFFECT_CARD_ID,
  SAUVAGE_DIOR_CARD_ID,
} from './EtherealExtractions'
import { HeroLiquidGlassBackground } from './HeroLiquidGlass'

/**
 * Прокрутка к карточке: центр блока с фото по центру экрана (учитывает Lenis).
 * Явное число `scrollTo(y)` для стабильной работы с Lenis.
 */
function scrollProductCardIntoViewCenter(lenis: Lenis | null | undefined, cardId: string) {
  const measureAndScroll = () => {
    const article = document.getElementById(cardId)
    if (!article) return

    const photoFrame =
      article.querySelector<HTMLElement>('.product-card-glow') ?? article
    const rect = photoFrame.getBoundingClientRect()
    const scrollY = lenis ? lenis.scroll : window.scrollY
    const elementTopDoc = scrollY + rect.top
    const elementCenterDoc = elementTopDoc + rect.height / 2
    const idealScrollTop = elementCenterDoc - window.innerHeight / 2
    const maxTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const targetScrollTop = Math.min(Math.max(0, idealScrollTop), maxTop)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (lenis) {
      lenis.scrollTo(targetScrollTop, reduced ? { immediate: true } : { duration: 1.12 })
      return
    }

    window.scrollTo({
      top: targetScrollTop,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(measureAndScroll)
  })
}

function handleHeroBottleClick(cardId: string, lenis: Lenis | null | undefined) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    scrollProductCardIntoViewCenter(lenis, cardId)
    if (window.location.hash !== `#${cardId}`) {
      window.history.replaceState(null, '', `#${cardId}`)
    }
    window.dispatchEvent(
      new CustomEvent(FLASH_PRODUCT_CARD_EVENT, { detail: { cardId } }),
    )
  }
}

type HeroNote = {
  key: string
  src: string
  label: string
  className: string
  style: CSSProperties
}

const heroNotesMadawi: HeroNote[] = [
  {
    key: 'madawi-vanilla',
    src: '/hero/notes/note-vanilla.png',
    label: 'Ваниль',
    className:
      'top-[2%] left-[0%] w-[min(30%,7.5rem)] -rotate-[18deg] sm:w-[28%] opacity-[0.92]',
    style: {
      '--note-dy': '-9px',
      '--note-dx': '3px',
      '--note-dur': '5.4s',
      '--note-delay': '0.2s',
    } as CSSProperties,
  },
  {
    key: 'madawi-patchouli',
    src: '/hero/notes/note-patchouli.png',
    label: 'Пачули',
    className:
      'top-[6%] right-[-2%] w-[min(38%,9rem)] rotate-[8deg] sm:w-[34%] opacity-[0.9]',
    style: {
      '--note-dy': '-11px',
      '--note-dx': '-4px',
      '--note-dur': '4.6s',
      '--note-delay': '0.9s',
    } as CSSProperties,
  },
  {
    key: 'madawi-tonka',
    src: '/hero/notes/note-tonka.png',
    label: 'Боб тонка',
    className:
      'top-[38%] -left-[10%] w-[min(32%,7.8rem)] -rotate-[10deg] sm:w-[30%] opacity-[0.88]',
    style: {
      '--note-dy': '-8px',
      '--note-dx': '5px',
      '--note-dur': '5.8s',
      '--note-delay': '0.4s',
    } as CSSProperties,
  },
  {
    key: 'madawi-cardamom',
    src: '/hero/notes/note-cardamom.png',
    label: 'Кардамон',
    className:
      'bottom-[16%] left-[2%] w-[min(34%,8.2rem)] rotate-[14deg] sm:w-[31%] opacity-[0.9]',
    style: {
      '--note-dy': '-10px',
      '--note-dx': '-3px',
      '--note-dur': '4.9s',
      '--note-delay': '1.1s',
    } as CSSProperties,
  },
  {
    key: 'madawi-bromeliad',
    src: '/hero/notes/note-bromeliad.png',
    label: 'Бромелия',
    className:
      'bottom-[8%] right-[-3%] w-[min(40%,9.5rem)] rotate-[6deg] sm:w-[36%] opacity-[0.88]',
    style: {
      '--note-dy': '-12px',
      '--note-dx': '4px',
      '--note-dur': '5.1s',
      '--note-delay': '0.65s',
    } as CSSProperties,
  },
]

/** Dior Sauvage EDP — ноты вокруг голограммы. */
const heroNotesSauvage: HeroNote[] = [
  {
    key: 'sauvage-bergamot',
    src: '/hero/notes/note-sauvage-bergamot.png',
    label: 'Бергамот',
    className:
      'top-[3%] right-[-3%] w-[min(36%,8.8rem)] rotate-[10deg] sm:w-[32%] opacity-[0.9]',
    style: {
      '--note-dy': '-10px',
      '--note-dx': '-3px',
      '--note-dur': '5.2s',
      '--note-delay': '0.15s',
    } as CSSProperties,
  },
  {
    key: 'sauvage-black-pepper',
    src: '/hero/notes/note-sauvage-black-pepper.png',
    label: 'Чёрный перец',
    className:
      'top-[22%] -left-[8%] w-[min(30%,7.4rem)] -rotate-[14deg] sm:w-[28%] opacity-[0.88]',
    style: {
      '--note-dy': '-9px',
      '--note-dx': '4px',
      '--note-dur': '4.8s',
      '--note-delay': '0.55s',
    } as CSSProperties,
  },
  {
    key: 'sauvage-lavender',
    src: '/hero/notes/note-sauvage-lavender.png',
    label: 'Лаванда',
    className:
      'top-[40%] -right-[6%] w-[min(33%,8rem)] rotate-[16deg] sm:-right-[10%] sm:w-[30%] opacity-[0.86]',
    style: {
      '--note-dy': '-11px',
      '--note-dx': '-5px',
      '--note-dur': '5.5s',
      '--note-delay': '0.3s',
    } as CSSProperties,
  },
  {
    key: 'sauvage-sichuan-pepper',
    src: '/hero/notes/note-sauvage-sichuan-pepper.png',
    label: 'Сычуаньский перец',
    className:
      'bottom-[20%] left-[-4%] w-[min(34%,8.2rem)] -rotate-[8deg] sm:w-[31%] opacity-[0.9]',
    style: {
      '--note-dy': '-8px',
      '--note-dx': '3px',
      '--note-dur': '4.7s',
      '--note-delay': '0.85s',
    } as CSSProperties,
  },
  {
    key: 'sauvage-ambroxan',
    src: '/hero/notes/note-sauvage-ambroxan.png',
    label: 'Амброксан',
    className:
      'bottom-[6%] right-[-2%] w-[min(38%,9.2rem)] rotate-[4deg] sm:w-[35%] opacity-[0.87]',
    style: {
      '--note-dy': '-12px',
      '--note-dx': '2px',
      '--note-dur': '5.3s',
      '--note-delay': '1s',
    } as CSSProperties,
  },
]

/** Initio Side Effect — ноты вокруг голограммы. */
const heroNotesInitio: HeroNote[] = [
  {
    key: 'initio-vanilla',
    src: '/hero/notes/note-initio-vanilla.png',
    label: 'Ваниль',
    className:
      'top-[4%] right-[-4%] w-[min(35%,8.6rem)] rotate-[8deg] sm:w-[31%] opacity-[0.9]',
    style: {
      '--note-dy': '-10px',
      '--note-dx': '-2px',
      '--note-dur': '5.1s',
      '--note-delay': '0.2s',
    } as CSSProperties,
  },
  {
    key: 'initio-gedion',
    src: '/hero/notes/note-initio-gedion.png',
    label: 'Гедион',
    className:
      'top-[24%] -left-[9%] w-[min(31%,7.6rem)] -rotate-[12deg] sm:w-[29%] opacity-[0.88]',
    style: {
      '--note-dy': '-9px',
      '--note-dx': '4px',
      '--note-dur': '4.9s',
      '--note-delay': '0.5s',
    } as CSSProperties,
  },
  {
    key: 'initio-rum',
    src: '/hero/notes/note-initio-rum.png',
    label: 'Ром',
    className:
      'top-[42%] -right-[8%] w-[min(32%,7.9rem)] rotate-[14deg] sm:-right-[12%] sm:w-[30%] opacity-[0.87]',
    style: {
      '--note-dy': '-11px',
      '--note-dx': '-4px',
      '--note-dur': '5.4s',
      '--note-delay': '0.35s',
    } as CSSProperties,
  },
  {
    key: 'initio-tobacco',
    src: '/hero/notes/note-initio-tobacco.png',
    label: 'Табак',
    className:
      'bottom-[18%] left-[-5%] w-[min(36%,8.5rem)] -rotate-[6deg] sm:w-[32%] opacity-[0.89]',
    style: {
      '--note-dy': '-8px',
      '--note-dx': '3px',
      '--note-dur': '4.8s',
      '--note-delay': '0.8s',
    } as CSSProperties,
  },
  {
    key: 'initio-cinnamon',
    src: '/hero/notes/note-initio-cinnamon.png',
    label: 'Корица',
    className:
      'bottom-[7%] -right-[4%] w-[min(34%,8.2rem)] rotate-[5deg] sm:-right-[8%] sm:w-[31%] opacity-[0.88]',
    style: {
      '--note-dy': '-12px',
      '--note-dx': '2px',
      '--note-dur': '5.2s',
      '--note-delay': '1s',
    } as CSSProperties,
  },
]

type HeroHologramVariant = {
  cardId: string
  bottleSrc: string
  bottleAlt: string
  bottleAria: string
  tooltipTitle: string
  tooltipBody: string
  notes: HeroNote[]
}

const heroHologramVariants: HeroHologramVariant[] = [
  {
    cardId: ARABIAN_OUD_MADAWI_CARD_ID,
    bottleSrc: '/hero/arabian-oud-madawi-hero.png',
    bottleAlt: 'Arabian Oud Madawi Gold Edition',
    bottleAria:
      'Arabian Oud Madawi Gold — перейти к карточке в коллекции. Восточно-цветочная гурманская композиция, сочетающая сочные красные фрукты, пряный кардамон, ноты ананаса, жасмина и теплую базу из ванили, пачули и янтаря',
    tooltipTitle: 'Arabian Oud Madawi Gold',
    tooltipBody:
      'Восточно-цветочная гурманская композиция, сочетающая сочные красные фрукты, пряный кардамон, ноты ананаса, жасмина и теплую базу из ванили, пачули и янтаря',
    notes: heroNotesMadawi,
  },
  {
    cardId: SAUVAGE_DIOR_CARD_ID,
    bottleSrc: '/hero/dior-sauvage-eau-de-parfum-hero.png',
    bottleAlt: 'Dior Sauvage Eau de Parfum',
    bottleAria:
      'Dior Sauvage Eau de Parfum — перейти к карточке в коллекции. Бергамот, чёрный и сычуаньский перец, лаванда и амброксан в шлейфе',
    tooltipTitle: 'Dior Sauvage Eau de Parfum',
    tooltipBody:
      'Свежий бергамот, чёрный перец, лаванда, пряность сычуаньского перца и минеральный амброксан',
    notes: heroNotesSauvage,
  },
  {
    cardId: INITIO_SIDE_EFFECT_CARD_ID,
    bottleSrc: '/hero/initio-side-effect-hero.png',
    bottleAlt: 'Initio Side Effect',
    bottleAria:
      'Initio Side Effect — перейти к карточке в коллекции. Восточно-гурманский шипр: ром, ваниль, табак, корица и тёплые смолистые ноты',
    tooltipTitle: 'Initio Side Effect',
    tooltipBody:
      'Насыщенный восточный шипр: ром и ваниль, табак и корица, сладкая глубина и дымный шлейф',
    notes: heroNotesInitio,
  },
]

/** Слои в DOM по числу голограмм: кроссфейд только opacity. */
function HeroHologramLayer({
  variant,
  active,
  bottleFetchPriority,
  lenis,
}: {
  variant: HeroHologramVariant
  active: boolean
  bottleFetchPriority: 'high' | 'low' | 'auto'
  lenis: Lenis | null | undefined
}) {
  return (
    <div
      className="absolute inset-0 transition-[opacity] duration-[520ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none motion-reduce:duration-0"
      style={{
        opacity: active ? 1 : 0,
        zIndex: active ? 2 : 1,
        pointerEvents: active ? 'auto' : 'none',
      }}
      aria-hidden={!active}
    >
      {variant.notes.map((note) => (
        <div
          key={note.key}
          className={`group/note hero-note-levitate pointer-events-auto absolute z-[5] cursor-default hover:z-[25] ${note.className}`}
          style={note.style}
          aria-label={note.label}
        >
          <div className="relative w-full">
            <img
              src={note.src}
              alt=""
              className="h-auto w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] [mix-blend-mode:multiply]"
              width={200}
              height={200}
              decoding="async"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute top-full left-1/2 z-30 mt-2 w-max max-w-[11rem] -translate-x-1/2 translate-y-0.5 scale-[0.97] rounded-[1.35rem] border border-white/[0.08] bg-[#070707]/95 px-3.5 py-2 text-center font-sans text-[10px] font-medium leading-tight tracking-[0.08em] text-white/90 opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[opacity,transform] duration-200 ease-out group-hover/note:translate-y-0 group-hover/note:scale-100 group-hover/note:opacity-100"
              role="tooltip"
            >
              {note.label}
            </div>
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <a
          href={`#${variant.cardId}`}
          onClick={handleHeroBottleClick(variant.cardId, lenis)}
          className="group/bottle-link hero-bottle-float pointer-events-none relative z-10 inline-flex w-[82%] max-w-[20rem] cursor-pointer justify-center leading-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black/0 hover:z-[30] sm:w-[78%] sm:max-w-[22.5rem] lg:w-[76%] lg:max-w-[25rem]"
          aria-label={variant.bottleAria}
        >
          <img
            src={variant.bottleSrc}
            alt={variant.bottleAlt}
            className="peer/bottle pointer-events-auto block h-auto w-full cursor-pointer object-contain align-top drop-shadow-[0_28px_80px_rgba(0,0,0,0.65)]"
            width={520}
            height={780}
            decoding="async"
            draggable={false}
            fetchPriority={bottleFetchPriority}
          />
          <div
            className="pointer-events-none absolute top-[50%] left-[50%] z-30 w-[min(15.5rem,calc(100vw-2.25rem))] translate-y-1 scale-[0.97] rounded-[1.35rem] border border-white/[0.08] bg-[#070707]/95 px-3.5 py-2.5 text-left opacity-0 shadow-[0_10px_28px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[opacity,transform] duration-200 ease-out sm:left-[54%] sm:w-[16.25rem] lg:left-[56%] peer-hover/bottle:translate-y-0 peer-hover/bottle:scale-100 peer-hover/bottle:opacity-100 group-focus-within/bottle-link:translate-y-0 group-focus-within/bottle-link:scale-100 group-focus-within/bottle-link:opacity-100"
            role="tooltip"
          >
            <p className="font-sans text-[10px] font-medium leading-snug tracking-[0.05em] text-white/92">
              {variant.tooltipTitle}
            </p>
            <p className="mt-2 font-sans text-[9px] font-normal leading-relaxed tracking-[0.02em] text-white/62">
              {variant.tooltipBody}
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}

function HologramSwitch({
  activeIndex,
  onSelect,
  optionTitles,
}: {
  activeIndex: number
  onSelect: (index: number) => void
  optionTitles: readonly string[]
}) {
  return (
    <div
      className="pointer-events-auto flex shrink-0 flex-col gap-1 rounded-full border border-amber-200/16 bg-[#070707]/78 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md"
      role="radiogroup"
      aria-label="Переключение голограммы парфюма"
    >
      {optionTitles.map((title, i) => {
        const on = activeIndex === i
        return (
          <button
            key={title}
            type="button"
            role="radio"
            aria-checked={on}
            title={title}
            onClick={() => onSelect(i)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full font-serif text-sm font-light tracking-wide transition-[color,background-color,box-shadow] duration-300 md:h-12 md:w-12 ${
              on
                ? 'bg-amber-200/[0.14] text-amber-50 shadow-[0_0_20px_-4px_rgba(212,175,95,0.45)]'
                : 'text-white/45 hover:bg-white/[0.06] hover:text-white/75'
            }`}
          >
            <span className="sr-only">{title}</span>
            <span aria-hidden className="text-[13px] md:text-[14px]">
              {i + 1}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function Hero() {
  const heroSectionRef = useRef<HTMLElement>(null)
  const [hologramIndex, setHologramIndex] = useState(0)
  const lenis = useLenis()

  const switchTitles = [
    'Arabian Oud Madawi Gold',
    'Dior Sauvage Eau de Parfum',
    'Initio Side Effect',
  ] as const

  return (
    <section
      ref={heroSectionRef}
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28 pb-28 md:pb-32"
    >
      <HeroLiquidGlassBackground visibilityRootRef={heroSectionRef} />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/88"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-stretch justify-center gap-14 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10">
        <div className="flex min-w-0 flex-col items-start justify-center gap-8 lg:max-w-[min(100%,34rem)] lg:flex-1 lg:gap-10">
          <h1 className="hero-reveal text-left font-serif text-balance text-xl font-light leading-snug tracking-[0.01em] text-white md:text-2xl md:leading-snug lg:text-3xl lg:leading-snug">
            Аромат — это невидимый наряд, который говорит о вас раньше слов
          </h1>
          <p className="hero-reveal hero-reveal-delay-1 max-w-md text-left font-sans text-sm font-light leading-relaxed tracking-wide text-white/58 md:text-base">
            Оставь след, который невозможно забыть
          </p>
          <div className="hero-reveal hero-reveal-delay-2 flex justify-start">
            <a
              href="#collections"
              className="group pointer-events-auto relative inline-flex items-center justify-center overflow-hidden rounded-full border border-amber-200/18 bg-white/[0.06] px-10 py-3.5 font-sans text-[11px] font-medium tracking-[0.22em] text-amber-50/95 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-500 hover:border-amber-200/35 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_0_48px_-8px_rgba(180,140,60,0.35)] active:scale-[0.99]"
            >
              <span
                className="pointer-events-none absolute inset-0 scale-125 opacity-0 blur-2xl transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
                aria-hidden
                style={{
                  background:
                    'radial-gradient(ellipse 75% 100% at 50% 40%, rgba(210, 175, 95, 0.28), transparent 62%)',
                }}
              />
              <span className="relative">Смотреть коллекцию</span>
            </a>
          </div>
        </div>

        <div className="pointer-events-none relative flex w-full flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10 md:gap-12 lg:min-h-[min(70vh,36rem)] lg:max-w-none lg:flex-row lg:justify-end lg:gap-20 xl:gap-24 lg:pr-0">
          <div className="relative isolate mx-auto aspect-[3/5] w-full max-w-[min(100%,21.5rem)] shrink-0 translate-x-14 sm:max-w-[22rem] sm:translate-x-18 md:max-w-[24.5rem] md:translate-x-24 lg:mx-0 lg:max-w-none lg:w-[min(100%,28rem)] lg:translate-x-32 xl:translate-x-44 2xl:translate-x-56">
            {heroHologramVariants.map((v, i) => (
              <HeroHologramLayer
                key={v.cardId}
                variant={v}
                active={hologramIndex === i}
                bottleFetchPriority={i === 0 ? 'high' : 'low'}
                lenis={lenis}
              />
            ))}
          </div>

          <div className="pointer-events-auto ml-2 shrink-0 sm:ml-10 md:ml-14 lg:ml-20 xl:ml-28 2xl:ml-36 lg:translate-x-[5cm]">
            <HologramSwitch
              activeIndex={hologramIndex}
              onSelect={setHologramIndex}
              optionTitles={switchTitles}
            />
          </div>
        </div>
      </div>

      <a
        href="#collections"
        className="hero-reveal hero-reveal-delay-3 absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/38 transition-colors hover:text-white/65 md:bottom-10"
        aria-label="Перейти к коллекциям"
      >
        <span
          className="font-sans text-[9px] tracking-[0.35em] uppercase"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Далее
        </span>
        <span
          className="block h-14 w-px bg-gradient-to-b from-amber-200/45 to-transparent"
          aria-hidden
        />
      </a>
    </section>
  )
}
