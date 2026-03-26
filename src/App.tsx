import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CursorStarTrail } from './components/CursorStarTrail'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SiteFooter } from './components/SiteFooter'
import { SiteLoader } from './components/SiteLoader'
import { ScrollToTop } from './components/ScrollToTop'
import { SmoothScroll } from './components/SmoothScroll'
import { PrivacyPage } from './pages/PrivacyPage'

const BrandMarquee = lazy(() =>
  import('./components/BrandMarquee').then((m) => ({ default: m.BrandMarquee })),
)
const EtherealExtractions = lazy(() =>
  import('./components/EtherealExtractions').then((m) => ({ default: m.EtherealExtractions })),
)
const Philosophy = lazy(() =>
  import('./components/Philosophy').then((m) => ({ default: m.Philosophy })),
)

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-20" aria-hidden />}>
          <EtherealExtractions />
          <BrandMarquee />
          <Philosophy />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}

export function App() {
  return (
    <>
      <SiteLoader />
      <SmoothScroll>
        <div className="relative min-h-screen w-full bg-transparent text-white antialiased">
          <CursorStarTrail />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </div>
          <ScrollToTop />
        </div>
      </SmoothScroll>
    </>
  )
}
