'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, User, Briefcase, Code, Award, Mail, Settings, LogOut, Home } from 'lucide-react'
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

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            router.push('/admin/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
    }

    const sections = [
        { name: 'Site Metadata', id: 'metadata' as ModalType, icon: Settings, description: 'Edit site title and description', color: 'text-blue-500 dark:text-blue-400', maxWidth: 'xl' as const },
        { name: 'Hero Section', id: 'hero' as ModalType, icon: Sparkles, description: 'Edit name, roles, and description', color: 'text-purple-500 dark:text-purple-400', maxWidth: 'xl' as const },
        { name: 'About Section', id: 'about' as ModalType, icon: User, description: 'Edit bio and status', color: 'text-green-500 dark:text-green-400', maxWidth: 'xl' as const },
        { name: 'Projects', id: 'projects' as ModalType, icon: Briefcase, description: 'Manage portfolio projects', color: 'text-orange-500 dark:text-orange-400', maxWidth: '2xl' as const },
        { name: 'Experience', id: 'experience' as ModalType, icon: Award, description: 'Manage work experience', color: 'text-yellow-500 dark:text-yellow-400', maxWidth: '2xl' as const },
        { name: 'Skills', id: 'skills' as ModalType, icon: Code, description: 'Manage technical skills', color: 'text-pink-500 dark:text-pink-400', maxWidth: '2xl' as const },
        { name: 'Contact Info', id: 'contact' as ModalType, icon: Mail, description: 'Edit email, phone, and location', color: 'text-indigo-500 dark:text-indigo-400', maxWidth: 'xl' as const },
    ]

    return (
        <>
            {/* Header matching portfolio theme */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        Portfolio CMS
                    </h1>
                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-xl bg-background border border-border hover:bg-accent transition-all text-foreground flex items-center gap-2"
                        >
                            <Home size={18} />
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive hover:bg-destructive/30 transition-all flex items-center gap-2"
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
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                        Dashboard
                    </h2>
                    <p className="text-muted-foreground">Manage your portfolio content</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <button
                            key={section.name}
                            onClick={() => setActiveModal(section.id)}
                            className="w-full text-left p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all group shadow-lg hover:shadow-xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-primary/10 ${section.color} group-hover:bg-primary/20 transition-all`}>
                                    <section.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">{section.name}</h3>
                                    <p className="text-sm text-muted-foreground">{section.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
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
