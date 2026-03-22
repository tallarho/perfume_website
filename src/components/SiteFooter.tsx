export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-void/88 px-6 py-10 backdrop-blur-[1px] md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="font-sans text-[10px] tracking-[0.15em] text-white/35 uppercase">
          © {new Date().getFullYear()} DIKIY PERFUME · Все права защищены
        </p>
        <ul className="flex flex-wrap gap-8">
          {(['Конфиденциальность', 'Условия', 'Архив'] as const).map((label) => (
            <li key={label}>
              <a
                href="#"
                className="font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white/70"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
