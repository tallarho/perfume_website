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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-10">
        <a
          href="#home"
          className="font-serif text-lg font-light tracking-wide text-white md:text-xl"
        >
          DIKIY PERFUME
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 md:flex"
          aria-label="Основное меню"
        >
          <ul className="flex gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-white/80 transition-colors hover:text-white"
            aria-label="Избранное"
          >
            <StarIcon />
          </button>
        </div>
      </div>

      <nav
        className="flex justify-center gap-8 border-t border-white/[0.04] py-3 md:hidden"
        aria-label="Мобильное меню"
      >
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-[10px] font-medium tracking-[0.18em] text-white/60 uppercase"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
