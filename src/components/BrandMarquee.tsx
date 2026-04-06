const CHUNKS = 14

export function BrandMarquee() {
  const items = Array.from({ length: CHUNKS }, (_, i) => (
    <span
      key={i}
      className="inline-block shrink-0 px-8 font-sans text-[11px] font-medium tracking-[0.35em] text-amber-200/55 uppercase md:px-10 md:text-xs md:tracking-[0.42em]"
    >
      AURA PERFUME
    </span>
  ))

  return (
    <div
      className="border-y border-white/[0.06] bg-[#080807] py-3 md:py-4"
      aria-hidden
    >
      <div className="brand-marquee relative overflow-hidden">
        <div className="brand-marquee__track flex w-max">
          <div className="flex shrink-0">{items}</div>
          <div className="flex shrink-0">{items}</div>
        </div>
      </div>
    </div>
  )
}
