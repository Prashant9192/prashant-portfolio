
'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react'
import { toast } from 'sonner'
import { ContactInfo } from '@/lib/models'

export default function ContactAdmin() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<ContactInfo>({
        email: '',
        phone: '',
        location: '',
        socials: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: '',
            facebook: ''
        }
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/contact')
            if (res.ok) {
                const contactData = await res.json()
                setData({
                    ...contactData,
                    socials: {
                        github: '',
                        linkedin: '',
                        twitter: '',
                        instagram: '',
                        facebook: '',
                        ...contactData.socials
                    }
                })
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
            } else {
                toast.error('Failed to update contact information')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const updateSocial = (platform: keyof NonNullable<ContactInfo['socials']>, value: string) => {
        setData(prev => ({
            ...prev,
            socials: {
                ...prev.socials,
                [platform]: value
            }
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Info & Socials</h1>
                    <p className="text-muted-foreground mt-2">Manage your public contact details and social media links.</p>
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

            <div className="grid gap-8">
                {/* Contact Details Section */}
                <div className="p-6 rounded-xl border bg-card space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Mail className="text-primary" size={20} />
                        Contact Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="+91 1234567890"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData({ ...data, location: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="p-6 rounded-xl border bg-card space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Github className="text-primary" size={20} />
                        Social Profiles
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">GitHub URL</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="url"
                                    value={data.socials?.github || ''}
                                    onChange={(e) => updateSocial('github', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="https://github.com/username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">LinkedIn URL</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="url"
                                    value={data.socials?.linkedin || ''}
                                    onChange={(e) => updateSocial('linkedin', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Twitter (X) URL</label>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="url"
                                    value={data.socials?.twitter || ''}
                                    onChange={(e) => updateSocial('twitter', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="https://twitter.com/username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Instagram URL</label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="url"
                                    value={data.socials?.instagram || ''}
                                    onChange={(e) => updateSocial('instagram', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="https://instagram.com/username"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">Facebook URL</label>
                            <div className="relative">
                                <Facebook className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="url"
                                    value={data.socials?.facebook || ''}
                                    onChange={(e) => updateSocial('facebook', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="https://facebook.com/username"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
