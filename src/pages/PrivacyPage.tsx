import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-24 md:px-10 md:py-32">
      <div className="rounded-3xl border border-white/[0.08] bg-void/88 p-8 backdrop-blur-[1px] md:p-12">
        <h1 className="font-serif text-3xl font-light tracking-tight text-white md:text-5xl">
          Конфиденциальности
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-sm leading-relaxed text-white/70 md:text-base">
          Мы уважаем приватность посетителей сайта. Этот раздел будет дополнен полной
          политикой конфиденциальности и условиями обработки персональных данных.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 border border-white/15 px-5 py-3 font-sans text-[11px] tracking-[0.18em] text-white/80 uppercase transition-colors hover:border-white/30 hover:text-white"
        >
          Вернуться на главную
        </Link>
      </div>
    </main>
  )
}
