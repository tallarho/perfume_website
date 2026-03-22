export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="border-t border-white/[0.06] bg-void-deep/90 px-6 py-24 backdrop-blur-[1px] md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div
          className="relative aspect-square max-h-[min(100vw,520px)] w-full overflow-hidden rounded-sm"
          aria-label="Abstract cosmic texture — placeholder for editorial image"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 30% 20%, rgba(90, 85, 110, 0.22), transparent 50%),
                radial-gradient(ellipse 100% 100% at 70% 80%, rgba(28, 22, 38, 0.45), transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(18, 16, 24, 1), #050208)
              `,
            }}
          />
          <div
            className="absolute inset-0 mix-blend-overlay opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="lg:py-6">
          <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-white/45 uppercase">
            The philosophy
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
            Bottled cosmic resonance
          </h2>
          <p className="mt-8 font-sans text-sm leading-[1.85] text-white/55 md:text-[15px]">
            We believe fragrance is a silent astronomy — invisible light that
            charts memory, desire, and distance. Our atelier distills that
            idea into glass: compositions that feel vast yet intimate, like
            naming a star only you can find.
          </p>
          <a
            href="#"
            className="mt-10 inline-block border-b border-white/25 pb-0.5 font-sans text-[10px] font-medium tracking-[0.25em] text-white/85 uppercase transition-colors hover:border-white"
          >
            Read the editorial
          </a>
        </div>
      </div>
    </section>
  )
}
