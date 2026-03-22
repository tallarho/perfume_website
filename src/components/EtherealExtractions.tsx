type Product = {
  name: string
  notes: string
  offset: string
}

const products: Product[] = [
  {
    name: 'Nova Nebula',
    notes: 'Bergamot • Stellar musk • Oak moss',
    offset: 'lg:translate-y-0',
  },
  {
    name: 'Stardust Mist',
    notes: 'White amber • Ionized air • Iris root',
    offset: 'lg:translate-y-14',
  },
  {
    name: 'Solar Flare',
    notes: 'Saffron • Solar vanilla • Black pepper',
    offset: 'lg:translate-y-6',
  },
  {
    name: 'Astral Void',
    notes: 'Oud • Cold metal • Smoked incense',
    offset: 'lg:translate-y-10',
  },
  {
    name: 'Lunar Path',
    notes: 'Moonflower • Silver sage • Wet stone',
    offset: 'lg:-translate-y-2',
  },
  {
    name: 'Supernova',
    notes: 'Plum nectar • Spark aldehydes • Cedar',
    offset: 'lg:translate-y-16',
  },
]

function ProductPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gradient-to-b from-white/[0.08] to-transparent"
      aria-label={`${label} — placeholder for product photo`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(195, 165, 105, 0.2), transparent), linear-gradient(165deg, rgba(255,255,255,0.06) 0%, transparent 45%)',
        }}
      />
      <div className="absolute inset-x-[28%] bottom-[18%] top-[22%] rounded-b-lg rounded-t-2xl border border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.02] shadow-[inset_0_-20px_40px_rgba(0,0,0,0.4)]" />
      <div className="absolute top-[20%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/15 blur-[1px]" />
    </div>
  )
}

export function EtherealExtractions() {
  return (
    <section
      id="collections"
      className="border-t border-white/[0.06] bg-void/88 px-6 py-24 backdrop-blur-[1px] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col gap-8 lg:mb-28 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="max-w-md font-serif text-3xl font-light tracking-tight text-white md:text-4xl lg:text-5xl">
            Ethereal Extractions
          </h2>
          <p className="max-w-md font-sans text-sm leading-relaxed text-white/50 md:text-[15px]">
            Each composition is mapped like a constellation — rare materials,
            precise orbits of note, and a trail that lingers in the dark.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
          {products.map((p) => (
            <article
              key={p.name}
              className={`flex flex-col ${p.offset} transition-transform duration-500`}
            >
              <ProductPlaceholder label={p.name} />
              <div className="mt-8">
                <h3 className="font-serif text-xl font-light text-white md:text-2xl">
                  {p.name}
                </h3>
                <p className="mt-2 font-sans text-[11px] leading-relaxed tracking-[0.12em] text-white/45 uppercase">
                  {p.notes}
                </p>
                <a
                  href="#"
                  className="mt-5 inline-block border-b border-white/25 pb-0.5 font-sans text-[10px] font-medium tracking-[0.25em] text-white/80 uppercase transition-colors hover:border-white hover:text-white"
                >
                  Buy
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
