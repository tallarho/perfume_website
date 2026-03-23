export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="border-t border-white/[0.06] bg-void/88 px-6 py-24 backdrop-blur-[1px] md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative aspect-square max-h-[min(100vw,520px)] w-full overflow-hidden rounded-sm border border-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <img
            src="/about-founder.png"
            alt="Основатель DikiY Perfume с флаконом духов на фоне ночного города"
            className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
            loading="lazy"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/55 via-transparent to-[#050505]/25"
            aria-hidden
          />
        </div>

        <div className="lg:py-6">
          <p className="font-sans text-[11px] font-medium tracking-[0.3em] text-white/45 uppercase">
            О бренде
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
            Аромат как характер
          </h2>
          <p className="mt-8 font-sans text-sm leading-[1.85] text-white/55 md:text-[15px]">
            Наша парфюмерия строго в оригинале! Мы собираем нишевые и узнаваемые
            композиции так, чтобы каждый флакон читался ясно: без лишнего шума, с
            акцентом на качество и настроение.
          </p>
          <p className="mt-6 font-sans text-sm leading-[1.85] text-white/55 md:text-[15px]">
            График работы 10:00 - 22:00
          </p>
          <p className="mt-4 font-sans text-sm leading-[1.85] text-white/55 md:text-[15px]">
            Адрес: г. Грозный, Старый рынок, улица Мира 44
          </p>
          <a
            href="#"
            className="mt-10 inline-block border-b border-white/25 pb-0.5 font-sans text-[10px] font-medium tracking-[0.25em] text-white/85 uppercase transition-colors hover:border-white"
          >
            Подробнее
          </a>
        </div>
      </div>
    </section>
  )
}
