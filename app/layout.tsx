import './globals.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'
import Preloader from '@/components/ui/Preloader'

export const metadata = {
  title: 'Prashant Basnet — Web Developer',
  description: 'Portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="cursor-none">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Preloader />
          <CustomCursor />
          <ScrollProgress />
          <Header />
          <main className="mx-auto max-w-6xl md:px-4 min-h-[calc(100vh-160px)]">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
