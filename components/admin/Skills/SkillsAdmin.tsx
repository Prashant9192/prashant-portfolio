
'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import { Skill } from '@/lib/models'

export default function SkillsAdmin() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [skills, setSkills] = useState<Skill[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/skills')
            if (res.ok) {
                const data = await res.json()
                setSkills(data.skills || [])
            }
        } catch (error) {
            toast.error('Failed to load skills data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ skills })
            })

            if (res.ok) {
                toast.success('Skills updated successfully!')
            } else {
                toast.error('Failed to update skills')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const addSkill = () => {
        setSkills([...skills, {
            name: '',
            icon: '',
            className: '',
            order: skills.length
        }])
    }

    const removeSkill = (index: number) => {
        if (!confirm('Are you sure you want to delete this skill?')) return
        const updated = skills.filter((_, i) => i !== index)
        const reordered = updated.map((skill, i) => ({ ...skill, order: i }))
        setSkills(reordered)
    }

    const updateSkill = (index: number, field: keyof Skill, value: string) => {
        const updated = [...skills]
        updated[index] = { ...updated[index], [field]: value }
        setSkills(updated)
    }

    const moveSkill = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === skills.length - 1) return

        const updated = [...skills]
        const newIndex = direction === 'up' ? index - 1 : index + 1
            ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]

        const reordered = updated.map((skill, i) => ({ ...skill, order: i }))
        setSkills(reordered)
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
                    <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                    <p className="text-muted-foreground mt-2">Manage your technical skills.</p>
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
                {skills.length === 0 ? (
                    <div className="bg-card border-2 border-dashed border-border rounded-xl p-12 text-center">
                        <p className="text-muted-foreground mb-4">No skills added yet.</p>
                        <button
                            onClick={addSkill}
                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add First Skill
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="group bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center p-1.5">
                                            {skill.icon ? (
                                                <img
                                                    src={skill.icon}
                                                    alt={skill.name}
                                                    className={`w-full h-full object-contain ${skill.className || ''}`}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-border" />
                                            )}
                                        </div>
                                        <span className="font-semibold text-sm">#{index + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => moveSkill(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30"
                                            title="Move Up"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => moveSkill(index, 'down')}
                                            disabled={index === skills.length - 1}
                                            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30"
                                            title="Move Down"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                        <button
                                            onClick={() => removeSkill(index)}
                                            className="p-1.5 rounded hover:bg-destructive/10 text-destructive hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm"
                                        placeholder="Skill Name (e.g. React)"
                                    />
                                    <input
                                        type="url"
                                        value={skill.icon}
                                        onChange={(e) => updateSkill(index, 'icon', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm text-xs font-mono"
                                        placeholder="Icon URL"
                                    />
                                    <input
                                        type="text"
                                        value={skill.className || ''}
                                        onChange={(e) => updateSkill(index, 'className', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm text-xs"
                                        placeholder="Classes (e.g. invert)"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        onClick={addSkill}
                        className="px-6 py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-primary hover:text-primary transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus size={18} />
                        Add New Skill
                    </button>
                </div>

                <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                    <h3 className="text-sm font-semibold text-primary mb-2">💡 Icon Resources</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                        You can find high-quality skill icons here (copy the image URL):
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <a href="https://devicon.dev/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline border-b border-primary/30">
                            DevIcon.dev
                        </a>
                        <a href="https://simpleicons.org/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline border-b border-primary/30">
                            SimpleIcons.org
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
