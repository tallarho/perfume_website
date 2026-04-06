function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18"
      height="18"
      aria-hidden
    >
      <path d="M12 2l1.8 5.5h5.8l-4.7 3.4 1.8 5.6L12 14.9 6.3 16.5l1.8-5.6L3.4 7.5h5.8L12 2z" />
    </svg>
  )
}

const nav = [
  { href: '#home', label: 'Главная' },
  { href: '#collections', label: 'Коллекции' },
  { href: '#philosophy', label: 'О нас' },
]

export function Header() {
  return (
    <header className="header-enter fixed top-0 right-0 left-0 z-50 border-b border-amber-100/[0.07] bg-[#050505]/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-[5.25rem] max-w-7xl items-center justify-between gap-6 px-6 py-2 md:h-[6.25rem] md:px-10 md:py-2.5">
        <a
          href="#home"
          className="flex shrink-0 items-center rounded-full outline-none ring-offset-2 ring-offset-[#050505]/80 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-200/35"
        >
          <img
            src="/logo-aura-perfume.webp"
            alt="AURA PERFUME"
            width={320}
            height={320}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-[4rem] w-auto max-h-full object-contain object-left md:h-[4.85rem]"
          />
        </a>

        <nav className="absolute left-1/2 flex -translate-x-1/2" aria-label="Основное меню">
          <ul className="flex items-center gap-3 md:gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[9px] font-medium tracking-[0.12em] text-white/68 uppercase transition-colors hover:text-white md:text-[11px] md:tracking-[0.2em] md:text-white/70"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-white/80 transition-colors hover:text-white"
            aria-label="Избранное"
          >
            <StarIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
