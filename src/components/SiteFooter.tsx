import { Link } from 'react-router-dom'

export function SiteFooter() {
  const links = [
    { label: 'Конфиденциальность', href: '/privacy', external: false },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/dikiy_perfume?igsh=cjAxYWVzNjQwbmQz',
    },
    { label: 'WhatsApp', href: 'http://wa.me/+79280896164' },
  ] as const

  return (
    <footer className="border-t border-white/[0.06] bg-void/88 px-6 py-10 backdrop-blur-[1px] md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="font-sans text-[10px] tracking-[0.15em] text-white/35 uppercase">
          © {new Date().getFullYear()} DIKIY PERFUME · Все права защищены
        </p>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <ul className="flex flex-wrap gap-8">
            {links.map((item) => (
              <li key={item.label}>
                {'external' in item && item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white/70"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase transition-colors hover:text-white/70"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="max-w-[26rem] font-sans text-[9px] leading-snug text-white/35 normal-case sm:text-right">
            Компания Meta признана в РФ экстремистской организацией, ее деятельность запрещена.
          </p>
        </div>
      </div>
    </footer>
  )
}
