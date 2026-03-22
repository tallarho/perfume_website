import { CosmicStarfield } from './components/CosmicStarfield'
import { CursorStarTrail } from './components/CursorStarTrail'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { EtherealExtractions } from './components/EtherealExtractions'
import { Philosophy } from './components/Philosophy'
import { SiteFooter } from './components/SiteFooter'
import { ViewportCursorProvider } from './components/ViewportCursorProvider'

export function App() {
  return (
    <ViewportCursorProvider>
    <div className="relative min-h-screen w-full bg-transparent text-white antialiased">
      <div className="pointer-events-none absolute inset-0 z-0 min-h-full w-full opacity-[0.42]">
        <CosmicStarfield />
      </div>
      <CursorStarTrail />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <EtherealExtractions />
          <Philosophy />
        </main>
        <SiteFooter />
      </div>
    </div>
    </ViewportCursorProvider>
  )
}
