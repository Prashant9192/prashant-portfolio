'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface HeroData {
    name: string
    roles: string[]
    description: string
    avatar: string
    resumeUrl: string
}

export default function HeroEditor() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<HeroData>({
        name: '',
        roles: ['', '', ''],
        description: '',
        avatar: '/MyAvatar.png',
        resumeUrl: '/Prashant-Resume.pdf'
    })

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            router.push('/admin')
            return
        }
        fetchData()
    }, [router])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/hero')
            const heroData = await res.json()
            setData(heroData)
        } catch (error) {
            toast.error('Failed to load hero data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/hero', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('Hero section updated successfully!')
            } else {
                toast.error('Failed to update hero section')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const updateRole = (index: number, value: string) => {
        const newRoles = [...data.roles]
        newRoles[index] = value
        setData({ ...data, roles: newRoles })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Edit Hero Section</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Roles */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Roles (Typewriter Effect)
                        </label>
                        <div className="space-y-3">
                            {data.roles.map((role, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={role}
                                    onChange={(e) => updateRole(index, e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder={`Role ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                            placeholder="Brief description about yourself"
                        />
                    </div>

                    {/* Avatar Path */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Avatar Image Path
                        </label>
                        <input
                            type="text"
                            value={data.avatar}
                            onChange={(e) => setData({ ...data, avatar: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="/MyAvatar.png"
                        />
                        <p className="text-xs text-gray-400 mt-2">Place image in /public folder</p>
                    </div>

                    {/* Resume URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Resume PDF Path
                        </label>
                        <input
                            type="text"
                            value={data.resumeUrl}
                            onChange={(e) => setData({ ...data, resumeUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="/Prashant-Resume.pdf"
                        />
                        <p className="text-xs text-gray-400 mt-2">Place PDF in /public folder</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
