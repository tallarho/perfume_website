import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ARABIAN_OUD_MADAWI_CARD_ID,
  ARABIAN_OUD_MADAWI_PHOTO_FRAME_ID,
  FLASH_PRODUCT_CARD_EVENT,
  INITIO_SIDE_EFFECT_CARD_ID,
  INITIO_SIDE_EFFECT_PHOTO_FRAME_ID,
  SAUVAGE_DIOR_CARD_ID,
  SAUVAGE_DIOR_PHOTO_FRAME_ID,
} from './productAnchors'
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react'

export {
  ARABIAN_OUD_MADAWI_CARD_ID,
  ARABIAN_OUD_MADAWI_PHOTO_FRAME_ID,
  FLASH_PRODUCT_CARD_EVENT,
  INITIO_SIDE_EFFECT_CARD_ID,
  INITIO_SIDE_EFFECT_PHOTO_FRAME_ID,
  SAUVAGE_DIOR_CARD_ID,
  SAUVAGE_DIOR_PHOTO_FRAME_ID,
} from './productAnchors'

type Product = {
  name: string
  notes: string
  image: string
  offset: string
  cardId?: string
  /** Длинный текст для модального окна (клик по карточке) */
  detailBlurb?: string
  /** Пять нот пирамиды в модалке — сверху вниз (от верха к базе) */
  pyramidNotes: readonly [string, string, string, string, string]
}

/**
 * Порядок карточек, фото и offset — без изменений.
 * Названия 1–16 — твой список по порядку слотов (слева направо, сверху вниз).
 */
const products: Product[] = [
  {
    name: 'Bois Impérial Essential',
    notes: 'Essential Parfums',
    image: '/perfumes/Blue Talisman Ex Nihilo.webp',
    offset: 'lg:translate-y-0',
    detailBlurb:
      'Древесно-ароматический парфюм Essential Parfums: зелёный шалфей, кедр и нота «чёрного чая» создают сухой, элегантный силуэт. Создан Кентином Бишем — минималистичная бутылка и чистый, современный характер для повседневной роскоши.',
    pyramidNotes: ['шалфей', 'чёрный чай', 'кедр', 'базилик', 'ветивер'],
  },
  {
    name: 'Sauvage Dior',
    notes: 'Christian Dior',
    image: '/perfumes/Bois-Imperial-Essential-Parfums.webp',
    offset: 'lg:translate-y-14',
    cardId: SAUVAGE_DIOR_CARD_ID,
    detailBlurb:
      'Культовый «дикий» свежий аромат: бергамот Калабрии, пряные перцы и глубокий амброксан. Мужественный, узнаваемый силуэт для дня и вечера — современная классика Dior.',
    pyramidNotes: ['бергамот', 'перец', 'лаванда', 'амброксан', 'пачули'],
  },
  {
    name: 'Blue Talisman Ex Nihilo',
    notes: 'Ex Nihilo',
    image: '/perfumes/Bvlgari.webp',
    offset: 'lg:translate-y-6',
    detailBlurb:
      'Парижский модерн и чистые аккорды: цитрус, ароматические ноты и древесно-мускусная база. Лёгкий, элегантный характер — как второй слой на коже, без лишней тяжести.',
    pyramidNotes: ['цитрус', 'ароматика', 'цветы', 'мускус', 'древесность'],
  },
  {
    name: 'Creed Aventus',
    notes: 'Creed',
    image: '/perfumes/Christian Dior Sauvage.webp',
    offset: 'lg:translate-y-10',
    detailBlurb:
      'Легендарный фруктово-древесный букет: ананас, чёрная смородина, берёза и дымный шлейф. Символ силы и уверенности — один из самых узнаваемых люксовых ароматов в мире.',
    pyramidNotes: ['ананас', 'смородина', 'дубовый мох', 'берёза', 'мускус'],
  },
  {
    name: 'Intriga Devil',
    notes: 'DikiY Perfume',
    image: '/perfumes/creed-aventus.webp',
    offset: 'lg:-translate-y-2',
    detailBlurb:
      'Домашняя линия DikiY Perfume: соблазнительный восточный или древесно-пряный характер с тёплой базой. Для тех, кто любит глубину, стойкость и «интригу» в шлейфе.',
    pyramidNotes: ['цитрус', 'пряности', 'роза', 'уд', 'ваниль'],
  },
  {
    name: 'Arabian Oud Madawi Gold',
    notes: 'Arabian Oud',
    image: '/perfumes/Devils Intrigue.webp',
    offset: 'lg:translate-y-16',
    cardId: ARABIAN_OUD_MADAWI_CARD_ID,
    detailBlurb:
      'Роскошный восточный букет: роза, фруктовые аккорды и благородный уд. Сладковато-пудровый, плотный шлейф в духе арабской парфюмерии — праздник и статус в одном флаконе.',
    pyramidNotes: ['фрукты', 'роза', 'шафран', 'уд', 'мускус'],
  },
  {
    name: 'Marc-Antoine Barrois Tilia',
    notes: 'Marc-Antoine Barrois',
    image: '/perfumes/Escentric Molecules Molecule 02.webp',
    offset: 'lg:translate-y-0',
    detailBlurb:
      'Солнечный цветочно-древесный аромат: лайм, инжир, липовый цвет и кедр. Прозрачный, но тёплый — как летний сад в Провансе, утончённо и по-французски.',
    pyramidNotes: ['лайм', 'инжир', 'липовый цвет', 'мимоза', 'кедр'],
  },
  {
    name: 'Louis Vuitton Symphony',
    notes: 'Louis Vuitton',
    image: '/perfumes/ganymede.webp',
    offset: 'lg:translate-y-14',
    detailBlurb:
      'Свежая энергия от Жака Кавалье: имбирь, грейпфрут и лёгкая древесность. Бодрящий, «дорожный» люкс LV — чистый, современный и универсальный для любого сезона.',
    pyramidNotes: ['грейпфрут', 'бергамот', 'имбирь', 'мускус', 'древесность'],
  },
  {
    name: 'Ombre Nomade Louis Vuitton',
    notes: 'Louis Vuitton',
    image: '/perfumes/Initio SIDE EFFECT.webp',
    offset: 'lg:translate-y-6',
    detailBlurb:
      'Глубокий восточный люкс: уд, бензоин, пряности и кожаный оттенок. Тёмный, медитативный шлейф — аромат для вечера и особых моментов, без компромиссов по стойкости.',
    pyramidNotes: ['малина', 'бензоин', 'роза', 'уд', 'кожа'],
  },
  {
    name: 'Tiziana Terenzi Kirke',
    notes: 'Tiziana Terenzi',
    image: '/perfumes/Louis Vuitton Ombre Nomade.webp',
    offset: 'lg:translate-y-10',
    detailBlurb:
      'Фруктово-мускусная сказка: маракуйя, персик, малина и мягкая ванильно-древесная база. Сияющий, «сочный» унисекс — праздник на коже и один из хитов итальянского дома.',
    pyramidNotes: ['маракуйя', 'персик', 'малина', 'ваниль', 'мускус'],
  },
  {
    name: 'Imagination Louis Vuitton',
    notes: 'Louis Vuitton',
    image: '/perfumes/louis-vuitton-imagination.webp',
    offset: 'lg:-translate-y-2',
    detailBlurb:
      'Светлый цитрусово-амбровый рисунок: чёрный чай, амбра, гваяковое дерево и свежие цитрусы. Утончённый, «воздушный» LV — интеллигентная росковь без крика.',
    pyramidNotes: ['цитрусы', 'чёрный чай', 'амбра', 'гваяк', 'кедр'],
  },
  {
    name: 'Initio Side Effect',
    notes: 'Initio Parfums',
    image: '/perfumes/initio-side-effect.webp',
    offset: 'lg:translate-y-16',
    cardId: INITIO_SIDE_EFFECT_CARD_ID,
    detailBlurb:
      'Гурманско-пряный взрыв: ром, ваниль, корица и табак. Сладкий, обволакивающий и невероятно стойкий — для тех, кто хочет оставить след в комнате и в памяти.',
    pyramidNotes: ['корица', 'ром', 'ваниль', 'табак', 'какао'],
  },
  {
    name: "Louis Vuitton L'Immensité",
    notes: 'Louis Vuitton',
    image: '/perfumes/louis-vuitton-symphony.webp',
    offset: 'lg:translate-y-0',
    detailBlurb:
      'Бесконечная свежесть: грейпфрут, имбирь, амброксан и чистая древесность. Морской, просторный характер — как окно в открытое небо, минимализм и сила LV.',
    pyramidNotes: ['грейпфрут', 'имбирь', 'амброксан', 'ладан', 'древесность'],
  },
  {
    name: 'Marc-Antoine Barrois Ganymede',
    notes: 'Marc-Antoine Barrois',
    image: '/perfumes/madawi.webp',
    offset: 'lg:translate-y-14',
    detailBlurb:
      'Минерально-цитрусовый футуризм: мандарин, шафран, замша и «мокрый» камень. Уникальный унисекс — интеллектуальный, современный и легко узнаваемый с первых нот.',
    pyramidNotes: ['мандарин', 'шафран', 'фиалка', 'минералы', 'замша'],
  },
  {
    name: 'Le Gemme Tygar Bvlgari',
    notes: 'Bvlgari',
    image: '/perfumes/tilia.webp',
    offset: 'lg:translate-y-6',
    detailBlurb:
      'Линия Le Gemme: яркий грейпфрут, амбровое дерево и сухой древесный шлейф. Солнечная сила и итальянская росковь — брутальный свежий люкс для уверенного входа.',
    pyramidNotes: ['грейпфрут', 'амбра', 'серая амбра', 'древесина', 'элеми'],
  },
  {
    name: 'Escentric Molecules Molecule 02',
    notes: 'Escentric Molecules',
    image: '/perfumes/Tiziana Terenzi Kirke.webp',
    offset: 'lg:translate-y-10',
    detailBlurb:
      'Чистый амброксан: один молекулярный компонент, который по-разному раскрывается на каждой коже. «Облако» шлейфа, почти невидимый старт и магнетизм на расстоянии — минимализм Escentric.',
    pyramidNotes: ['амброксан', 'кожа', 'древесный шлейф', 'мускус', 'ваша кожа'],
  },
]

/** Текст в fly-модалке: свой `detailBlurb` или один общий шаблон без дублирования разметки */
function productFlyDescription(p: Product): string {
  const extra = p.detailBlurb?.trim()
  if (extra) return extra
  return `${p.name} — ${p.notes}. Оригинальные и масляные духи в подборке DikiY Perfume. Объём и наличие уточняйте при заказе.`
}

const volumeOptions = ['10 мл', '20 мл', '30 мл', '50 мл'] as const

const COLLECTION_SECTION_TITLE = 'Коллекция'

function collectionTitleLetterClass(i: number, activeIndex: number | null): string {
  const base = 'collection-title-gradient-char'
  if (activeIndex === null) return base
  const dist = Math.abs(i - activeIndex)
  if (dist === 0) return `${base} ${base}--active`
  if (dist === 1) return `${base} ${base}--neighbor`
  return base
}

/** Заголовок: подсветка буквы под курсором + соседи слабее; сброс при уходе со слова. */
const CollectionTitleHeading = memo(function CollectionTitleHeading() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <h2
      aria-label={COLLECTION_SECTION_TITLE}
      className="collection-title-gradient-group w-fit cursor-default font-serif text-[clamp(3rem,12vw,7.5rem)] font-light uppercase leading-[0.92] tracking-[0.04em] md:tracking-[0.06em]"
    >
      <span
        aria-hidden="true"
        className="inline-block"
        onMouseLeave={() => setActiveIndex(null)}
      >
        {COLLECTION_SECTION_TITLE.split('').map((char, i) => (
          <span
            key={`collection-letter-${i}`}
            className={collectionTitleLetterClass(i, activeIndex)}
            onMouseEnter={() => setActiveIndex(i)}
          >
            {char}
          </span>
        ))}
      </span>
    </h2>
  )
})

/** Фото заполняет прямоугольник карточки (object-cover), края совпадают со скруглением. */
const ProductCard = memo(function ProductCard({
  name,
  image,
  photoFrameId,
  imageRef,
  hideImage,
}: {
  name: string
  image: string
  /** Якорь для обводки по рамке фото (2-я / 3-я голограмма). */
  photoFrameId?: string
  imageRef?: Ref<HTMLImageElement | null>
  /** Скрыть фото на карточке, пока летит клон в модалке */
  hideImage?: boolean
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
            ref={imageRef}
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.045] ${hideImage ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
      </div>
    </div>
  )
})

const FLY_MODAL_TRANSITION_MS = 680

type FlyRect = { top: number; left: number; width: number; height: number }

function rectToFlyRect(r: DOMRect): FlyRect {
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

/** Только размеры финального фото в модалке (позицию даёт групповое центрирование). */
function getFlyFinalImageSize(from: FlyRect): { width: number; height: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  /* Максимально крупное фото в модалке */
  const maxW = Math.min(vw - 32, 760)
  const maxH = vh * 0.82
  const aspect = from.width / from.height
  let finalW = maxW
  let finalH = finalW / aspect
  if (finalH > maxH) {
    finalH = maxH
    finalW = finalH * aspect
  }
  return { width: finalW, height: finalH }
}

const FLY_MODAL_GAP = 18
const FLY_TEXT_MIN_W = 200
const FLY_TEXT_MAX_W = 448
/** Оценка высоты колонки (текст + кнопка) для вертикального центрирования группы */
const FLY_TEXT_COLUMN_EST_H = 400

function flyNoteStripWidth(vw: number): number {
  if (vw < 400) return 68
  if (vw < 640) return 82
  return 96
}

type FlyGroupLayout =
  | {
      mode: 'row'
      img: FlyRect
      text: { left: number; bottom: number; width: number }
      noteStripW: number
    }
  | {
      mode: 'stack'
      img: FlyRect
      text: { left: number; top: number; width: number }
      noteStripW: number
    }

/** Картинка + текст + кнопка одной группой по центру экрана */
function getFlyGroupLayout(imgW: number, imgH: number): FlyGroupLayout {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = FLY_MODAL_GAP
  const noteStripW = flyNoteStripWidth(vw)
  let textW = Math.min(FLY_TEXT_MAX_W, vw - imgW - noteStripW - gap - 40)

  if (textW < FLY_TEXT_MIN_W) {
    const colW = Math.min(FLY_TEXT_MAX_W, Math.max(imgW, 280), vw - 32)
    const totalH = imgH + 16 + FLY_TEXT_COLUMN_EST_H
    let imgTop = (vh - totalH) / 2 - 24
    if (imgTop < 16) imgTop = 16
    const imgLeft = (vw - imgW) / 2
    return {
      mode: 'stack',
      img: { left: imgLeft, top: imgTop, width: imgW, height: imgH },
      text: {
        left: (vw - colW) / 2,
        top: imgTop + imgH + 16,
        width: colW,
      },
      noteStripW,
    }
  }

  const groupW = imgW + noteStripW + gap + textW
  const groupH = Math.max(imgH, FLY_TEXT_COLUMN_EST_H)
  const groupLeft = (vw - groupW) / 2
  const groupTop = (vh - groupH) / 2 - 24
  const safeGroupTop = Math.max(12, groupTop)

  const imgLeft = groupLeft
  const imgTop = safeGroupTop + groupH - imgH
  const textLeft = groupLeft + imgW + noteStripW + gap
  const textBottom = Math.max(12, vh - safeGroupTop - groupH)

  return {
    mode: 'row',
    img: { left: imgLeft, top: imgTop, width: imgW, height: imgH },
    text: { left: textLeft, bottom: textBottom, width: textW },
    noteStripW,
  }
}

/** Вертикальная линия с маркерами — впритык справа от фото в fly-модалке */
function FlyFragranceNotesStrip({
  notes,
  imgRect,
  stripW,
  flyExpanded,
}: {
  notes: readonly [string, string, string, string, string]
  imgRect: FlyRect
  stripW: number
  flyExpanded: boolean
}) {
  return (
    <div
      className="fixed z-[241] pointer-events-none cursor-default select-none transition-[top,left,width,height] duration-[680ms] ease-[cubic-bezier(0.22,1,0.32,1)] motion-reduce:!transition-none motion-reduce:duration-0"
      style={{
        left: `${imgRect.left + imgRect.width}px`,
        top: `${imgRect.top}px`,
        width: `${stripW}px`,
        height: `${imgRect.height}px`,
      }}
      role="group"
      aria-label="Пирамида нот аромата, сверху вниз"
    >
      <div
        className="relative h-full w-full py-1.5 pl-0.5 transition-opacity duration-500 ease-out motion-reduce:!transition-none motion-reduce:duration-0"
        style={{
          opacity: flyExpanded ? 1 : 0,
          transitionDelay: flyExpanded ? '200ms' : '0ms',
        }}
      >
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-amber-200/55 via-amber-200/25 to-amber-200/50"
        />
        <div className="relative flex h-full flex-col justify-between">
          {notes.map((note, i) => (
            <div key={`${i}-${note}`} className="flex min-h-0 items-center gap-1.5">
              <span
                aria-hidden
                className="relative z-[1] ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/90 shadow-[0_0_0_2px_rgba(0,0,0,0.35)]"
              />
              <span className="min-w-0 font-sans text-[8px] leading-[1.15] tracking-[0.05em] text-white/68 sm:text-[10px] sm:tracking-[0.06em]">
                {note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
  const lenis = useLenis()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const cardImageRefs = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: products.length }, () => null),
  )
  const revealRefs = useRef<(HTMLDivElement | null)[]>(Array.from({ length: products.length }, () => null))
  const flyCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cardImageRefCallbacks = useMemo(
    () =>
      products.map(
        (_, i) => (el: HTMLImageElement | null) => {
          cardImageRefs.current[i] = el
        },
      ),
    [],
  )
  const revealRefCallbacks = useMemo(
    () =>
      products.map(
        (_, i) => (el: HTMLDivElement | null) => {
          revealRefs.current[i] = el
        },
      ),
    [],
  )

  const [flyModal, setFlyModal] = useState<null | {
    product: Product
    description: string
    from: FlyRect
  }>(null)
  const [flyExpanded, setFlyExpanded] = useState(false)

  const flyImageSize = useMemo(
    () => (flyModal ? getFlyFinalImageSize(flyModal.from) : null),
    [flyModal],
  )

  const flyGroupLayout = useMemo(() => {
    if (!flyModal || !flyImageSize || typeof window === 'undefined') return null
    return getFlyGroupLayout(flyImageSize.width, flyImageSize.height)
  }, [flyModal, flyImageSize])

  const closeFlyModal = useCallback(() => {
    setFlyExpanded(false)
    if (flyCloseTimerRef.current) clearTimeout(flyCloseTimerRef.current)
    flyCloseTimerRef.current = window.setTimeout(() => {
      setFlyModal(null)
      flyCloseTimerRef.current = null
    }, FLY_MODAL_TRANSITION_MS)
  }, [])

  const openFlyModal = useCallback((product: Product, description: string, from: DOMRect) => {
    if (flyCloseTimerRef.current) {
      clearTimeout(flyCloseTimerRef.current)
      flyCloseTimerRef.current = null
    }
    setFlyModal({
      product,
      description,
      from: rectToFlyRect(from),
    })
    setFlyExpanded(false)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setFlyExpanded(true)
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFlyExpanded(true))
      })
    }
  }, [])

  useEffect(() => {
    if (!flyModal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFlyModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [flyModal, closeFlyModal])

  /** Fly-модалка и окно «Купить»: блок скролла страницы + остановка Lenis */
  const modalScrollLocked = flyModal !== null || selectedProduct !== null
  useEffect(() => {
    if (!modalScrollLocked) return
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      lenis?.start()
    }
  }, [modalScrollLocked, lenis])

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
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedProduct])

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const items = revealRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!items.length) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: 'transform,opacity,willChange' })
      return
    }

    // Изначально: только opacity + translate3d (force3D), без layout-свойств.
    gsap.set(items, {
      opacity: 0,
      y: 18,
      force3D: true,
      willChange: 'transform,opacity',
    })

    const batchInstance = ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        batch.forEach((el, idx) => {
          const col = Number((el as HTMLElement).dataset.col ?? 0)
          const columnDelay = (col % 4) * 0.055
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.72,
            delay: columnDelay + idx * 0.05,
            ease: 'expo.out',
            force3D: true,
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(el, { clearProps: 'willChange' })
            },
          })
        })
      },
    })

    return () => {
      batchInstance.forEach((trigger) => trigger.kill())
      gsap.killTweensOf(items)
    }
  }, [])

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
              <CollectionTitleHeading />
              <p className="max-w-[min(100%,20rem)] font-sans text-base font-light uppercase leading-snug tracking-[0.14em] text-white/55 sm:max-w-xs sm:pb-1.5 md:text-lg md:leading-snug md:tracking-[0.16em]">
                оригинальные и масляные духи
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:[grid-auto-rows:1fr]">
            {products.map((p, index) => (
              <article
                key={p.image}
                id={p.cardId}
                className={`product-grid-item flex h-full min-h-0 cursor-pointer flex-col ${p.offset}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return
                  const img = cardImageRefs.current[index]
                  if (!img) return
                  openFlyModal(p, productFlyDescription(p), img.getBoundingClientRect())
                }}
              >
                <div
                  ref={revealRefCallbacks[index]}
                  className="product-reveal"
                  data-col={index % 4}
                >
                  <ProductCard
                    name={p.name}
                    image={p.image}
                    imageRef={cardImageRefCallbacks[index]}
                    hideImage={Boolean(flyModal && flyModal.product.image === p.image)}
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
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>

      {flyModal &&
        flyGroupLayout &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-fly-product-title"
            className="fixed inset-0 z-[240]"
          >
            <div
              role="presentation"
              className="absolute inset-0 cursor-pointer bg-black/55 transition-opacity duration-500 ease-out"
              style={{
                opacity: flyExpanded ? 1 : 0,
                backdropFilter: flyExpanded ? 'blur(24px) saturate(1.12)' : 'blur(0px)',
                WebkitBackdropFilter: flyExpanded ? 'blur(24px) saturate(1.12)' : 'blur(0px)',
              }}
              onClick={closeFlyModal}
            />
            <img
              src={flyModal.product.image}
              alt=""
              className="fixed z-[241] cursor-default rounded-xl object-cover shadow-[0_28px_100px_rgba(0,0,0,0.75)] ring-1 ring-white/12 transition-[top,left,width,height] duration-[680ms] ease-[cubic-bezier(0.22,1,0.32,1)] motion-reduce:!transition-none motion-reduce:duration-0"
              style={{
                top: flyExpanded ? flyGroupLayout.img.top : flyModal.from.top,
                left: flyExpanded ? flyGroupLayout.img.left : flyModal.from.left,
                width: flyExpanded ? flyGroupLayout.img.width : flyModal.from.width,
                height: flyExpanded ? flyGroupLayout.img.height : flyModal.from.height,
              }}
              aria-hidden
            />
            <FlyFragranceNotesStrip
              notes={flyModal.product.pyramidNotes}
              imgRect={
                flyExpanded
                  ? flyGroupLayout.img
                  : flyModal.from
              }
              stripW={flyGroupLayout.noteStripW}
              flyExpanded={flyExpanded}
            />
            <div
              className="fixed z-[242] cursor-default text-left transition-opacity duration-500 ease-out motion-reduce:!transition-none motion-reduce:duration-0"
              style={{
                left: `${flyGroupLayout.text.left}px`,
                width: `${flyGroupLayout.text.width}px`,
                ...(flyGroupLayout.mode === 'row'
                  ? {
                      bottom: `${flyGroupLayout.text.bottom}px`,
                      top: 'auto',
                    }
                  : {
                      top: `${flyGroupLayout.text.top}px`,
                      bottom: 'auto',
                    }),
                opacity: flyExpanded ? 1 : 0,
                transitionDelay: flyExpanded ? '200ms' : '0ms',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-sans text-[10px] tracking-[0.22em] text-amber-200/55 uppercase">
                {flyModal.product.notes}
              </p>
              <h2
                id="collection-fly-product-title"
                className="mt-2 font-serif text-2xl font-light text-white md:text-3xl"
              >
                {flyModal.product.name}
              </h2>
              <p className="mt-4 font-sans text-[15px] leading-relaxed text-white/82 md:text-base">
                {flyModal.description}
              </p>
              <button
                type="button"
                onClick={closeFlyModal}
                className="mt-8 rounded-full border border-white/20 bg-white/[0.06] px-8 py-3 font-sans text-[10px] tracking-[0.2em] text-white/90 uppercase transition-colors hover:border-amber-200/40 hover:bg-white/[0.1]"
              >
                Закрыть
              </button>
            </div>
          </div>,
          document.body,
        )}

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
            selectedProduct
              ? 'translate-y-[-2.25rem] scale-100 opacity-100 md:translate-y-[-3rem]'
              : 'translate-y-4 scale-95 opacity-0'
          }`}
        >
          <p className="font-sans text-[10px] tracking-[0.2em] text-white/45 uppercase">
            Купить
          </p>
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
