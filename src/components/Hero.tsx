import { HeroLiquidGlassBackground } from './HeroLiquidGlass'
import { HeroPerfumeCanvas } from './HeroPerfumeCanvas'

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28 pb-28 md:pb-32"
    >
      <HeroLiquidGlassBackground />

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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-12 px-6 md:gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 xl:gap-16 xl:px-14">
        <div className="w-full max-w-3xl shrink-0 text-center lg:max-w-xl lg:text-left xl:max-w-2xl">
          <h1 className="hero-reveal font-serif text-balance text-4xl font-semibold leading-[1.2] tracking-[0.02em] text-white md:text-6xl md:leading-[1.15] lg:text-7xl">
            Дикий аромат
          </h1>
          <p className="hero-reveal hero-reveal-delay-1 mx-auto mt-5 max-w-md font-sans text-sm font-light leading-relaxed tracking-wide text-white/58 md:mt-6 md:text-base lg:mx-0 lg:max-w-sm">
            Оставь след, который невозможно забыть
          </p>
          <div className="hero-reveal hero-reveal-delay-2 mt-12 md:mt-14">
            <a
              href="#collections"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-amber-200/18 bg-white/[0.06] px-10 py-3.5 font-sans text-[11px] font-medium tracking-[0.22em] text-amber-50/95 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-500 hover:border-amber-200/35 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_0_48px_-8px_rgba(180,140,60,0.35)] active:scale-[0.99]"
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

        <div className="hero-reveal hero-reveal-delay-1 relative z-10 w-full max-w-md shrink-0 overflow-hidden rounded-2xl border border-amber-100/10 bg-black/25 shadow-[0_0_80px_-24px_rgba(180,140,70,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] lg:max-w-[min(440px,42vw)] xl:max-w-[480px]">
          <HeroPerfumeCanvas />
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
