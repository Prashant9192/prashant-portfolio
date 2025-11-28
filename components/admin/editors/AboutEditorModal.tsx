'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AboutContent } from '@/lib/models'

interface AboutEditorModalProps {
  onClose: () => void
}

export default function AboutEditorModal({ onClose }: AboutEditorModalProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<AboutContent>({
        bio: '',
        avatar: '/MyAvatar.png',
        status: {
            available: true,
            company: 'Digitrix Agency'
        }
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/about')
            const aboutData = await res.json()
            setData(aboutData)
        } catch (error) {
            toast.error('Failed to load about data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/about', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('About section updated successfully!')
                onClose()
            } else {
                toast.error('Failed to update about section')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
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
            {/* Bio */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Bio Description
                </label>
                <textarea
                    value={data.bio}
                    onChange={(e) => setData({ ...data, bio: e.target.value })}
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

            {/* Status */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                    Current Status
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="available"
                        checked={data.status.available}
                        onChange={(e) => setData({
                            ...data,
                            status: { ...data.status, available: e.target.checked }
                        })}
                        className="w-5 h-5 rounded bg-background border-input text-primary focus:ring-primary/50"
                    />
                    <label htmlFor="available" className="text-foreground">
                        Available for work
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        value={data.status.company}
                        onChange={(e) => setData({
                            ...data,
                            status: { ...data.status, company: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="Company name"
                    />
                </div>
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

