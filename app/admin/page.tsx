'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, User, Briefcase, Code, Award, Mail, Settings, LogOut, Home, TrendingUp, Activity, Layers, ArrowRight } from 'lucide-react'
import Modal from '@/components/admin/Modal'
import MetadataEditorModal from '@/components/admin/editors/MetadataEditorModal'
import HeroEditorModal from '@/components/admin/editors/HeroEditorModal'
import AboutEditorModal from '@/components/admin/editors/AboutEditorModal'
import ProjectsEditorModal from '@/components/admin/editors/ProjectsEditorModal'
import ExperienceEditorModal from '@/components/admin/editors/ExperienceEditorModal'
import SkillsEditorModal from '@/components/admin/editors/SkillsEditorModal'
import ContactEditorModal from '@/components/admin/editors/ContactEditorModal'

type ModalType = 'metadata' | 'hero' | 'about' | 'projects' | 'experience' | 'skills' | 'contact' | null

export default function AdminDashboard() {
    const router = useRouter()
    const [activeModal, setActiveModal] = useState<ModalType>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!localStorage.getItem('adminToken')) {
            router.push('/admin/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
    }

    const sections = [
        { 
            name: 'Site Metadata', 
            id: 'metadata' as ModalType, 
            icon: Settings, 
            description: 'SEO settings and site information', 
            color: 'text-blue-500 dark:text-blue-400',
            bgGradient: 'from-blue-500/10 to-blue-600/5',
            borderColor: 'border-blue-500/20',
            maxWidth: 'xl' as const 
        },
        { 
            name: 'Hero Section', 
            id: 'hero' as ModalType, 
            icon: Sparkles, 
            description: 'Main headline and introduction', 
            color: 'text-purple-500 dark:text-purple-400',
            bgGradient: 'from-purple-500/10 to-purple-600/5',
            borderColor: 'border-purple-500/20',
            maxWidth: 'xl' as const 
        },
        { 
            name: 'About Section', 
            id: 'about' as ModalType, 
            icon: User, 
            description: 'Personal bio and availability', 
            color: 'text-green-500 dark:text-green-400',
            bgGradient: 'from-green-500/10 to-green-600/5',
            borderColor: 'border-green-500/20',
            maxWidth: 'xl' as const 
        },
        { 
            name: 'Projects', 
            id: 'projects' as ModalType, 
            icon: Briefcase, 
            description: 'Portfolio projects showcase', 
            color: 'text-orange-500 dark:text-orange-400',
            bgGradient: 'from-orange-500/10 to-orange-600/5',
            borderColor: 'border-orange-500/20',
            maxWidth: '2xl' as const 
        },
        { 
            name: 'Experience', 
            id: 'experience' as ModalType, 
            icon: Award, 
            description: 'Work history and achievements', 
            color: 'text-yellow-500 dark:text-yellow-400',
            bgGradient: 'from-yellow-500/10 to-yellow-600/5',
            borderColor: 'border-yellow-500/20',
            maxWidth: '2xl' as const 
        },
        { 
            name: 'Skills', 
            id: 'skills' as ModalType, 
            icon: Code, 
            description: 'Technical skills and expertise', 
            color: 'text-pink-500 dark:text-pink-400',
            bgGradient: 'from-pink-500/10 to-pink-600/5',
            borderColor: 'border-pink-500/20',
            maxWidth: '2xl' as const 
        },
        { 
            name: 'Contact Info', 
            id: 'contact' as ModalType, 
            icon: Mail, 
            description: 'Contact details and location', 
            color: 'text-indigo-500 dark:text-indigo-400',
            bgGradient: 'from-indigo-500/10 to-indigo-600/5',
            borderColor: 'border-indigo-500/20',
            maxWidth: 'xl' as const 
        },
    ]

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            {/* Enhanced Header */}
            <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                                <Layers className="text-primary" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Portfolio CMS
                                </h1>
                                <p className="text-xs text-muted-foreground">Content Management System</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/"
                                className="px-5 py-2.5 rounded-xl bg-background border border-border hover:bg-accent hover:border-primary/50 transition-all text-foreground flex items-center gap-2 font-medium group"
                            >
                                <Home size={18} className="group-hover:scale-110 transition-transform" />
                                View Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-2 font-medium group"
                            >
                                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h2 className="text-4xl font-bold text-foreground mb-2">
                        Welcome Back 👋
                    </h2>
                    <p className="text-muted-foreground text-lg">Manage and update your portfolio content</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <Activity className="text-blue-500" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">{sections.length}</h3>
                        <p className="text-sm text-muted-foreground">Content Sections</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                                <TrendingUp className="text-purple-500" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">100%</h3>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-green-500/20">
                                <Sparkles className="text-green-500" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">Live</h3>
                        <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                </div>

                {/* Content Sections Grid */}
                <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-6">Content Management</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section, index) => (
                            <button
                                key={section.name}
                                onClick={() => setActiveModal(section.id)}
                                className="group relative w-full text-left p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10 overflow-hidden animate-in fade-in-up"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3.5 rounded-xl bg-gradient-to-br ${section.bgGradient} ${section.borderColor} border group-hover:scale-110 transition-transform duration-300`}>
                                            <section.icon className={section.color} size={24} />
                                        </div>
                                        <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {section.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Modals */}
            {activeModal && (() => {
                const section = sections.find(s => s.id === activeModal)
                if (!section) return null

                return (
                    <Modal
                        isOpen={true}
                        onClose={() => setActiveModal(null)}
                        title={`Edit ${section.name}`}
                        maxWidth={section.maxWidth}
                    >
                        {activeModal === 'metadata' && <MetadataEditorModal onClose={() => setActiveModal(null)} onSave={() => {}} />}
                        {activeModal === 'hero' && <HeroEditorModal onClose={() => setActiveModal(null)} />}
                        {activeModal === 'about' && <AboutEditorModal onClose={() => setActiveModal(null)} />}
                        {activeModal === 'projects' && <ProjectsEditorModal onClose={() => setActiveModal(null)} />}
                        {activeModal === 'experience' && <ExperienceEditorModal onClose={() => setActiveModal(null)} />}
                        {activeModal === 'skills' && <SkillsEditorModal onClose={() => setActiveModal(null)} />}
                        {activeModal === 'contact' && <ContactEditorModal onClose={() => setActiveModal(null)} />}
                    </Modal>
                )
            })()}
        </>
    )
}
