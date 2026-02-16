
'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import { AboutContent } from '@/lib/models'

export default function AboutAdmin() {
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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
                    <p className="text-muted-foreground mt-2">Update your bio and current work status.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

            <div className="grid gap-6 p-6 rounded-xl border bg-card">
                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Bio Description
                    </label>
                    <textarea
                        value={data.bio}
                        onChange={(e) => setData({ ...data, bio: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                        placeholder="Share your story..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Status */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Current Status
                        </label>
                        <div className="p-4 rounded-xl border bg-background space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={data.status.available}
                                    onChange={(e) => setData({
                                        ...data,
                                        status: { ...data.status, available: e.target.checked }
                                    })}
                                    className="w-5 h-5 rounded border-input text-primary focus:ring-primary/50"
                                />
                                <label htmlFor="available" className="text-foreground font-medium cursor-pointer">
                                    Available for work
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={data.status.company}
                                    onChange={(e) => setData({
                                        ...data,
                                        status: { ...data.status, company: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-input text-sm"
                                    placeholder="e.g. Digitrix Agency"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar Preview */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Profile Image
                        </label>
                        <div className="flex items-start gap-4 p-4 rounded-xl border bg-background">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-secondary">
                                <img
                                    src={data.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                    <User className="text-white" size={24} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="block text-xs font-medium text-muted-foreground">
                                    Image Path
                                </label>
                                <input
                                    type="text"
                                    value={data.avatar}
                                    onChange={(e) => setData({ ...data, avatar: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-input text-sm font-mono"
                                    placeholder="/MyAvatar.png"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Use the Hero section to upload a new avatar image.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
