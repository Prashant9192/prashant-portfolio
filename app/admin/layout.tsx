import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background Blobs - Same as portfolio */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        
        <Toaster 
          richColors 
          position="top-right" 
          toastOptions={{ duration: 4000 }}
          closeButton
          expand={false}
        />
      </div>
    </ThemeProvider>
  )
}

