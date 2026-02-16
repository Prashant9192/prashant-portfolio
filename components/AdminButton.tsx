
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'

export default function AdminButton() {
    const [show, setShow] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Check if running on client and token exists
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('adminToken')
            if (token) {
                setShow(true)
            }
        }
    }, [])

    if (!show || pathname?.startsWith('/admin')) return null

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 font-medium"
            >
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">Admin Panel</span>
            </Link>
        </div>
    )
}
