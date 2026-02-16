
'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import { ExperienceItem } from '@/lib/models'

export default function ExperienceAdmin() {
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
            toast.error('Failed to load experience data')
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
                toast.success('Experience updated successfully!')
            } else {
                toast.error('Failed to update experience')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
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
        if (!confirm('Are you sure you want to delete this experience item?')) return
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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
                    <p className="text-muted-foreground mt-2">Manage your work history and achievements.</p>
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

            <div className="space-y-6">
                {experiences.length === 0 ? (
                    <div className="bg-card border-2 border-dashed border-border rounded-xl p-12 text-center">
                        <p className="text-muted-foreground mb-4">No work experience added yet.</p>
                        <button
                            onClick={addExperience}
                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add First Experience
                        </button>
                    </div>
                ) : (
                    experiences.map((exp, index) => (
                        <div
                            key={index}
                            className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-4 bg-secondary/30 border-b border-border flex items-center justify-between">
                                <span className="font-semibold text-sm">Experience #{index + 1}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => moveExperience(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground disabled:opacity-30"
                                        title="Move Up"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveExperience(index, 'down')}
                                        disabled={index === experiences.length - 1}
                                        className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground disabled:opacity-30"
                                        title="Move Down"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <button
                                        onClick={() => removeExperience(index)}
                                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive hover:text-red-600"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 grid gap-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Role / Title</label>
                                        <input
                                            type="text"
                                            value={exp.role}
                                            onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                            placeholder="e.g. Senior Web Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                            placeholder="e.g. Google"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">Period</label>
                                        <input
                                            type="text"
                                            value={exp.period}
                                            onChange={(e) => updateExperience(index, 'period', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                            placeholder="e.g. Jan 2023 - Present"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Logo (Text)</label>
                                            <input
                                                type="text"
                                                value={exp.logo}
                                                onChange={(e) => updateExperience(index, 'logo', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                                placeholder="e.g. G"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Bg Color</label>
                                            <input
                                                type="text"
                                                value={exp.logoBg}
                                                onChange={(e) => updateExperience(index, 'logoBg', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm font-mono"
                                                placeholder="bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <button
                    onClick={addExperience}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus size={20} />
                    Add Another Position
                </button>
            </div>
        </div>
    )
}
