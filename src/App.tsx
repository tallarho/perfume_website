import { Route, Routes } from 'react-router-dom'
import { CursorStarTrail } from './components/CursorStarTrail'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { BrandMarquee } from './components/BrandMarquee'
import { EtherealExtractions } from './components/EtherealExtractions'
import { Philosophy } from './components/Philosophy'
import { SiteFooter } from './components/SiteFooter'
import { SiteLoader } from './components/SiteLoader'
import { ScrollToTop } from './components/ScrollToTop'
import { SmoothScroll } from './components/SmoothScroll'
import { PrivacyPage } from './pages/PrivacyPage'

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <EtherealExtractions />
        <BrandMarquee />
        <Philosophy />
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
