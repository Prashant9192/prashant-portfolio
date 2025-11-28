'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'
import Preloader from '@/components/ui/Preloader'
import ParticlesBackground from '@/components/ui/ParticlesBackground'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && (
        <>
          <Preloader />
          <CustomCursor />
          <ScrollProgress />
          <ParticlesBackground />
          <Header />
        </>
      )}
      <main className={!isAdminRoute ? "mx-auto max-w-6xl md:px-4 min-h-[calc(100vh-160px)]" : ""}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  )
}

