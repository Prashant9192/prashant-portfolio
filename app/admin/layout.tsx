
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import AdminSidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Auth protection (Basic check)
  useEffect(() => {
    // Skip check if already on login page
    if (isLoginPage) return

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router, isLoginPage])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }
  }

  // Simplified layout for login page
  if (isLoginPage) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background flex items-center justify-center">
          {children}
        </div>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen overflow-hidden bg-background cursor-auto">
        {/* Sidebar */}
        <div className="relative z-50">
          <AdminSidebar onLogout={handleLogout} />
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative w-full lg:pl-64 pt-16 lg:pt-0">
          <div className="min-h-full p-4 lg:p-8">
            {children}
          </div>
        </main>

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
