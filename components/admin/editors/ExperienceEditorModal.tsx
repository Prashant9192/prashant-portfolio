'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ExperienceItem } from '@/lib/models'

interface ExperienceEditorModalProps {
  onClose: () => void
}

export default function ExperienceEditorModal({ onClose }: ExperienceEditorModalProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [experiences, setExperiences] = useState<ExperienceItem[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/experience')
            if (res.ok) {
                const data = await res.json()
                setExperiences(data.experiences || [])
            }
        } catch (error) {
            toast.error('Failed to load experience data', { id: 'experience-load-error' })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/experience', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ experiences })
            })

            if (res.ok) {
                toast.success('Experience updated successfully!', { id: 'experience-update-success' })
                onClose()
            } else {
                toast.error('Failed to update experience', { id: 'experience-update-error' })
            }
        } catch (error) {
            toast.error('An error occurred while saving', { id: 'experience-save-error' })
        } finally {
            setSaving(false)
        }
    }

    const addExperience = () => {
        setExperiences([...experiences, {
            role: '',
            company: '',
            period: '',
            logo: '',
            logoBg: 'bg-blue-600',
            order: experiences.length
        }])
    }

    const removeExperience = (index: number) => {
        const updated = experiences.filter((_, i) => i !== index)
        const reordered = updated.map((exp, i) => ({ ...exp, order: i }))
        setExperiences(reordered)
    }

    const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
        const updated = [...experiences]
        updated[index] = { ...updated[index], [field]: value }
        setExperiences(updated)
    }

    const moveExperience = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === experiences.length - 1) return

        const updated = [...experiences]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
        
        const reordered = updated.map((exp, i) => ({ ...exp, order: i }))
        setExperiences(reordered)
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
            <div className="flex justify-end">
                <button
                    onClick={addExperience}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Experience
                </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {experiences.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                        No experiences added. Click "Add Experience" to get started.
                    </div>
                ) : (
                    experiences.map((exp, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-2xl p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-muted-foreground">Experience #{index + 1}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => moveExperience(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveExperience(index, 'down')}
                                        disabled={index === experiences.length - 1}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => removeExperience(index)}
                                        className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Role / Title
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.role}
                                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Web Developer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Company Name"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Period
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.period}
                                        onChange={(e) => updateExperience(index, 'period', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Aug 2024 - Present"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Logo (Emoji or Symbol)
                                    </label>
                                    <input
                                        type="text"
                                        value={exp.logo}
                                        onChange={(e) => updateExperience(index, 'logo', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="m or ☼"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Logo Background Color (Tailwind Class)
                                </label>
                                <input
                                    type="text"
                                    value={exp.logoBg}
                                    onChange={(e) => updateExperience(index, 'logoBg', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="bg-blue-600"
                                />
                                <p className="text-xs text-muted-foreground mt-2">Example: bg-blue-600, bg-purple-500, bg-green-600</p>
                            </div>
                        </div>
                    ))
                )}
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

