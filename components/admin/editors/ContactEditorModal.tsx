'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ContactInfo } from '@/lib/models'

interface ContactEditorModalProps {
  onClose: () => void
}

export default function ContactEditorModal({ onClose }: ContactEditorModalProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<ContactInfo>({
        email: '',
        phone: '',
        location: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/contact')
            if (res.ok) {
                const contactData = await res.json()
                setData(contactData)
            }
        } catch (error) {
            toast.error('Failed to load contact data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('Contact information updated successfully!')
                onClose()
            } else {
                toast.error('Failed to update contact information')
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
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="your@email.com"
                />
                <p className="text-xs text-muted-foreground mt-2">This email will be displayed on the contact section</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                </label>
                <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="+91 1234567890"
                />
                <p className="text-xs text-muted-foreground mt-2">Clicking this number will copy it to clipboard</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                </label>
                <input
                    type="text"
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="City, Country"
                />
                <p className="text-xs text-muted-foreground mt-2">Your location will be displayed on the contact section</p>
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

