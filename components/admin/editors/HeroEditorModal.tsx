'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface HeroData {
    name: string
    roles: string[]
    description: string
    avatar: string
    resumeUrl: string
}

interface HeroEditorModalProps {
  onClose: () => void
}

export default function HeroEditorModal({ onClose }: HeroEditorModalProps) {
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
        fetchData()
    }, [])

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
                onClose()
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
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="Your full name"
                />
            </div>

            {/* Roles */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Roles (Typewriter Effect)
                </label>
                <div className="space-y-3">
                    {data.roles.map((role, index) => (
                        <input
                            key={index}
                            type="text"
                            value={role}
                            onChange={(e) => updateRole(index, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder={`Role ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                    placeholder="Brief description about yourself"
                />
            </div>

            {/* Avatar Path */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Avatar Image Path
                </label>
                <input
                    type="text"
                    value={data.avatar}
                    onChange={(e) => setData({ ...data, avatar: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="/MyAvatar.png"
                />
                <p className="text-xs text-muted-foreground mt-2">Place image in /public folder</p>
            </div>

            {/* Resume URL */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Resume PDF Path
                </label>
                <input
                    type="text"
                    value={data.resumeUrl}
                    onChange={(e) => setData({ ...data, resumeUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="/Prashant-Resume.pdf"
                />
                <p className="text-xs text-muted-foreground mt-2">Place PDF in /public folder</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-background border border-border hover:bg-accent transition-all text-foreground"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        </div>
    )
}

