
'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Upload, FileText, Image } from 'lucide-react'
import { toast } from 'sonner'

interface HeroData {
    name: string
    roles: string[]
    description: string
    avatar: string
    resumeUrl: string
}

export default function HeroAdmin() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [uploadingResume, setUploadingResume] = useState(false)
    const [data, setData] = useState<HeroData>({
        name: '',
        roles: ['', '', ''],
        description: '',
        avatar: '/MyAvatar.png',
        resumeUrl: '/Prashant-Resume.pdf'
    })
    const avatarInputRef = useRef<HTMLInputElement>(null)
    const resumeInputRef = useRef<HTMLInputElement>(null)

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

    const handleFileUpload = async (file: File, type: 'avatar' | 'resume') => {
        // Validate file
        if (type === 'avatar' && !file.type.startsWith('image/')) {
            toast.error('Please upload an image file for avatar')
            return
        }
        if (type === 'resume' && file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file for resume')
            return
        }

        // Check file size (max 5MB for images, 10MB for PDFs)
        const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error(`File size must be less than ${type === 'avatar' ? '5MB' : '10MB'}`)
            return
        }

        if (type === 'avatar') {
            setUploadingAvatar(true)
        } else {
            setUploadingResume(true)
        }

        try {
            const token = localStorage.getItem('adminToken')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to upload file')
            }

            const result = await res.json()

            if (type === 'avatar') {
                setData({ ...data, avatar: result.path })
                toast.success('Avatar uploaded successfully!')
            } else {
                setData({ ...data, resumeUrl: result.path })
                toast.success('Resume uploaded successfully!')
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload file')
        } finally {
            if (type === 'avatar') {
                setUploadingAvatar(false)
                if (avatarInputRef.current) {
                    avatarInputRef.current.value = ''
                }
            } else {
                setUploadingResume(false)
                if (resumeInputRef.current) {
                    resumeInputRef.current.value = ''
                }
            }
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file, 'avatar')
        }
    }

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file, 'resume')
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
                    <h1 className="text-3xl font-bold tracking-tight">Hero Section</h1>
                    <p className="text-muted-foreground mt-2">Manage your main headline and introduction.</p>
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

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Avatar Image
                        </label>
                        <div className="space-y-3">
                            {data.avatar && (
                                <div className="relative w-full h-48 rounded-xl bg-background border border-input overflow-hidden flex items-center justify-center p-4">
                                    <img
                                        src={data.avatar}
                                        alt="Avatar preview"
                                        className="h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    id="avatar-upload"
                                    disabled={uploadingAvatar}
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${uploadingAvatar
                                        ? 'border-primary/50 bg-primary/5 cursor-wait'
                                        : 'border-input hover:border-primary hover:bg-accent'
                                        }`}
                                >
                                    {uploadingAvatar ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin text-primary" />
                                            <span className="text-sm text-foreground">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Image size={18} className="text-foreground" />
                                            <span className="text-sm text-foreground">Upload Avatar Image</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Resume PDF
                        </label>
                        <div className="space-y-3">
                            <div className="h-48 rounded-xl bg-background border border-input flex flex-col items-center justify-center p-6 text-center">
                                {data.resumeUrl ? (
                                    <>
                                        <FileText size={48} className="text-primary mb-2" />
                                        <p className="text-sm font-medium text-foreground break-all">
                                            {data.resumeUrl.split('/').pop()}
                                        </p>
                                        <a
                                            href={data.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline mt-2"
                                        >
                                            View Current Resume
                                        </a>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">No resume uploaded</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    ref={resumeInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleResumeChange}
                                    className="hidden"
                                    id="resume-upload"
                                    disabled={uploadingResume}
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${uploadingResume
                                        ? 'border-primary/50 bg-primary/5 cursor-wait'
                                        : 'border-input hover:border-primary hover:bg-accent'
                                        }`}
                                >
                                    {uploadingResume ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin text-primary" />
                                            <span className="text-sm text-foreground">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} className="text-foreground" />
                                            <span className="text-sm text-foreground">Upload Resume PDF</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
