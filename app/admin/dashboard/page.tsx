'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, LogOut, Home } from 'lucide-react'

export default function AdminDashboard() {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            router.push('/admin')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        router.push('/admin')
    }

    const sections = [
        { name: 'Hero Section', href: '/admin/hero', icon: FileText, description: 'Edit name, roles, and description' },
        { name: 'About Section', href: '/admin/about', icon: FileText, description: 'Coming soon' },
        { name: 'Projects', href: '/admin/projects', icon: FileText, description: 'Coming soon' },
        { name: 'Experience', href: '/admin/experience', icon: FileText, description: 'Coming soon' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Portfolio CMS</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                            <Home size={18} />
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                    <p className="text-gray-300">Manage your portfolio content</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <Link
                            key={section.name}
                            href={section.href}
                            className="block p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                    <section.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{section.name}</h3>
                                    <p className="text-sm text-gray-400">{section.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
