'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Info, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { SiteMetadata } from '@/lib/models'

interface MetadataEditorModalProps {
  onClose: () => void
  onSave?: () => void
}

export default function MetadataEditorModal({ onClose, onSave }: MetadataEditorModalProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingFavicon, setUploadingFavicon] = useState(false)
    const faviconInputRef = useRef<HTMLInputElement>(null)
    const [data, setData] = useState<SiteMetadata>({
        title: '',
        description: '',
        keywords: '',
        author: '',
        canonicalUrl: '',
        robots: 'index, follow',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogUrl: '',
        ogType: 'website',
        ogSiteName: '',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        twitterSite: '',
        twitterCreator: '',
        viewport: 'width=device-width, initial-scale=1',
        themeColor: '#2563eb',
        language: 'en',
        favicon: '',
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/metadata')
            if (res.ok) {
                const metadataData = await res.json()
                setData({
                    title: metadataData.title || '',
                    description: metadataData.description || '',
                    keywords: metadataData.keywords || '',
                    author: metadataData.author || '',
                    canonicalUrl: metadataData.canonicalUrl || '',
                    robots: metadataData.robots || 'index, follow',
                    ogTitle: metadataData.ogTitle || '',
                    ogDescription: metadataData.ogDescription || '',
                    ogImage: metadataData.ogImage || '',
                    ogUrl: metadataData.ogUrl || '',
                    ogType: metadataData.ogType || 'website',
                    ogSiteName: metadataData.ogSiteName || '',
                    twitterCard: metadataData.twitterCard || 'summary_large_image',
                    twitterTitle: metadataData.twitterTitle || '',
                    twitterDescription: metadataData.twitterDescription || '',
                    twitterImage: metadataData.twitterImage || '',
                    twitterSite: metadataData.twitterSite || '',
                    twitterCreator: metadataData.twitterCreator || '',
                    viewport: metadataData.viewport || 'width=device-width, initial-scale=1',
                    themeColor: metadataData.themeColor || '#2563eb',
                    language: metadataData.language || 'en',
                    favicon: metadataData.favicon || '',
                })
            }
        } catch (error) {
            toast.error('Failed to load metadata', { id: 'metadata-load-error' })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/metadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                toast.success('Metadata updated successfully!', { id: 'metadata-update-success' })
                onSave?.()
                setTimeout(() => {
                    onClose()
                    window.location.reload()
                }, 1000)
            } else {
                toast.error('Failed to update metadata', { id: 'metadata-update-error' })
            }
        } catch (error) {
            toast.error('An error occurred while saving', { id: 'metadata-save-error' })
        } finally {
            setSaving(false)
        }
    }

    const handleFaviconUpload = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Favicon must be an image file', { id: 'favicon-file-type-error' })
            return
        }

        // Check file size (max 2MB for favicon)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error('Favicon file size must be less than 2MB', { id: 'favicon-file-size-error' })
            return
        }

        setUploadingFavicon(true)

        try {
            const token = localStorage.getItem('adminToken')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'favicon')

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to upload favicon')
            }

            const result = await res.json()
            setData({ ...data, favicon: result.path })
            toast.success('Favicon uploaded successfully!', { id: 'favicon-upload-success' })
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload favicon', { 
                id: 'favicon-upload-error' 
            })
        } finally {
            setUploadingFavicon(false)
            if (faviconInputRef.current) {
                faviconInputRef.current.value = ''
            }
        }
    }

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFaviconUpload(file)
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
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Basic SEO */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Info size={18} />
                    Basic SEO
                </h3>
                
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Site Title *
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="Prashant Basnet — Web Developer"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-2">Appears in browser tab and search results</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Meta Description *
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                        placeholder="Brief description for SEO (150-160 characters recommended)"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-2">{data.description.length}/160 characters</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Keywords
                    </label>
                    <input
                        type="text"
                        value={data.keywords || ''}
                        onChange={(e) => setData({ ...data, keywords: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="web developer, portfolio, react, nextjs (comma-separated)"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Comma-separated keywords</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            value={data.author || ''}
                            onChange={(e) => setData({ ...data, author: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="Your Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Language
                        </label>
                        <input
                            type="text"
                            value={data.language || 'en'}
                            onChange={(e) => setData({ ...data, language: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="en"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Canonical URL
                    </label>
                    <input
                        type="url"
                        value={data.canonicalUrl || ''}
                        onChange={(e) => setData({ ...data, canonicalUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="https://yourdomain.com"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Main URL of your site</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Robots Meta
                    </label>
                    <select
                        value={data.robots || 'index, follow'}
                        onChange={(e) => setData({ ...data, robots: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    >
                        <option value="index, follow">Index, Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, follow">No Index, Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                </div>
            </div>

            {/* Favicon */}
            <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon size={18} />
                    Favicon
                </h3>
                
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Site Favicon
                    </label>
                    <div className="space-y-3">
                        {data.favicon && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-input">
                                <div className="w-16 h-16 rounded-lg bg-background border border-input flex items-center justify-center overflow-hidden shrink-0">
                                    <img
                                        src={data.favicon}
                                        alt="Favicon preview"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {data.favicon.split('/').pop()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Current favicon</p>
                                </div>
                                <a
                                    href={data.favicon}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline shrink-0"
                                >
                                    View
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <input
                                ref={faviconInputRef}
                                type="file"
                                accept="image/x-icon,image/png,image/svg+xml,image/jpeg,image/webp"
                                onChange={handleFaviconChange}
                                className="hidden"
                                id="favicon-upload"
                                disabled={uploadingFavicon}
                            />
                            <label
                                htmlFor="favicon-upload"
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                    uploadingFavicon
                                        ? 'border-primary/50 bg-primary/5 cursor-wait'
                                        : 'border-input hover:border-primary hover:bg-accent'
                                }`}
                            >
                                {uploadingFavicon ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin text-primary" />
                                        <span className="text-sm text-foreground">Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={18} className="text-foreground" />
                                        <span className="text-sm text-foreground">Upload Favicon</span>
                                    </>
                                )}
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-primary">Recommended: .ico format</span> for best browser compatibility. Size: 32x32px or 64x64px (max 2MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-foreground">Open Graph (Facebook, LinkedIn)</h3>
                
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        OG Title
                    </label>
                    <input
                        type="text"
                        value={data.ogTitle || ''}
                        onChange={(e) => setData({ ...data, ogTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="Leave empty to use site title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        OG Description
                    </label>
                    <textarea
                        value={data.ogDescription || ''}
                        onChange={(e) => setData({ ...data, ogDescription: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                        placeholder="Leave empty to use meta description"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            OG Image URL
                        </label>
                        <input
                            type="url"
                            value={data.ogImage || ''}
                            onChange={(e) => setData({ ...data, ogImage: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="/MyAvatar.png or full URL"
                        />
                        <p className="text-xs text-muted-foreground mt-2">Recommended: 1200x630px</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            OG Type
                        </label>
                        <select
                            value={data.ogType || 'website'}
                            onChange={(e) => setData({ ...data, ogType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        >
                            <option value="website">Website</option>
                            <option value="profile">Profile</option>
                            <option value="article">Article</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            OG URL
                        </label>
                        <input
                            type="url"
                            value={data.ogUrl || ''}
                            onChange={(e) => setData({ ...data, ogUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="https://yourdomain.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            OG Site Name
                        </label>
                        <input
                            type="text"
                            value={data.ogSiteName || ''}
                            onChange={(e) => setData({ ...data, ogSiteName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="Your Site Name"
                        />
                    </div>
                </div>
            </div>

            {/* Twitter Card */}
            <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-foreground">Twitter Card</h3>
                
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Twitter Card Type
                    </label>
                    <select
                        value={data.twitterCard || 'summary_large_image'}
                        onChange={(e) => setData({ ...data, twitterCard: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Twitter Title
                    </label>
                    <input
                        type="text"
                        value={data.twitterTitle || ''}
                        onChange={(e) => setData({ ...data, twitterTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="Leave empty to use site title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Twitter Description
                    </label>
                    <textarea
                        value={data.twitterDescription || ''}
                        onChange={(e) => setData({ ...data, twitterDescription: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                        placeholder="Leave empty to use meta description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Twitter Image URL
                    </label>
                    <input
                        type="url"
                        value={data.twitterImage || ''}
                        onChange={(e) => setData({ ...data, twitterImage: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="Leave empty to use OG image"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Recommended: 1200x675px</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Twitter Site Handle
                        </label>
                        <input
                            type="text"
                            value={data.twitterSite || ''}
                            onChange={(e) => setData({ ...data, twitterSite: e.target.value.replace('@', '') })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="yourhandle (without @)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Twitter Creator Handle
                        </label>
                        <input
                            type="text"
                            value={data.twitterCreator || ''}
                            onChange={(e) => setData({ ...data, twitterCreator: e.target.value.replace('@', '') })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="yourhandle (without @)"
                        />
                    </div>
                </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-foreground">Additional Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Viewport
                        </label>
                        <input
                            type="text"
                            value={data.viewport || 'width=device-width, initial-scale=1'}
                            onChange={(e) => setData({ ...data, viewport: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Theme Color
                        </label>
                        <input
                            type="color"
                            value={data.themeColor || '#2563eb'}
                            onChange={(e) => setData({ ...data, themeColor: e.target.value })}
                            className="w-full h-12 rounded-xl bg-background border border-input cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-2">Browser theme color</p>
                    </div>
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
                    disabled={saving || !data.title || !data.description}
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
