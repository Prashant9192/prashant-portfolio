import './globals.css'
import Header from '@/components/Header/Header'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'Prashant Basnet — Web Developer',
  description: 'Portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="mx-auto max-w-6xl px-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
