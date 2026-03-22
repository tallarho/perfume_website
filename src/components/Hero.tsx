import { HeroSpiralBackground } from './HeroSpiralBackground'

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28 pb-28 md:pb-32"
    >
      <HeroSpiralBackground />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/48 via-black/22 to-black/78"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 text-center md:gap-12 lg:px-10">
        <div className="w-full max-w-4xl">
          <h1 className="hero-reveal font-serif text-balance text-3xl font-semibold leading-[1.2] tracking-[0.02em] text-white sm:text-4xl md:text-5xl md:leading-[1.15] lg:text-6xl">
            Аромат, в котором живёт дикость вселенной
          </h1>
          <p className="hero-reveal hero-reveal-delay-1 mx-auto mt-5 max-w-lg font-sans text-sm font-light leading-relaxed tracking-wide text-white/58 md:mt-6 md:text-base">
            Оставь след, который невозможно забыть
          </p>
          <div className="hero-reveal hero-reveal-delay-2 mt-12 flex justify-center md:mt-14">
            <a
              href="#collections"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-violet-400/35 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#a855f7] px-10 py-3.5 font-sans text-[11px] font-medium tracking-[0.22em] text-white uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_24px_-4px_rgba(124,58,237,0.55)] transition-[transform,box-shadow,filter] duration-500 hover:border-violet-300/45 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_1px_rgba(167,139,250,0.35),0_8px_40px_-6px_rgba(139,92,246,0.55)] hover:brightness-110 active:scale-[0.99]"
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
                style={{
                  background:
                    'linear-gradient(105deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(255,255,255,0.12) 100%)',
                }}
              />
              <span className="relative">Смотреть коллекцию</span>
            </a>
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
          className="block h-14 w-px bg-gradient-to-b from-violet-300/55 to-transparent"
          aria-hidden
        />
      </a>
    </section>
  )
}
