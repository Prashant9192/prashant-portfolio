'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Skill } from '@/lib/models'

interface SkillsEditorModalProps {
  onClose: () => void
}

export default function SkillsEditorModal({ onClose }: SkillsEditorModalProps) {
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
                onClose()
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
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={addSkill}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Skill
                </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {skills.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                        No skills added. Click "Add Skill" to get started.
                    </div>
                ) : (
                    skills.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-2xl p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-muted-foreground">Skill #{index + 1}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => moveSkill(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveSkill(index, 'down')}
                                        disabled={index === skills.length - 1}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => removeSkill(index)}
                                        className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Skill Name
                                    </label>
                                    <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Next.js"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Icon URL
                                    </label>
                                    <input
                                        type="url"
                                        value={skill.icon}
                                        onChange={(e) => updateSkill(index, 'icon', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="https://cdn.jsdelivr.net/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    CSS Classes (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={skill.className || ''}
                                    onChange={(e) => updateSkill(index, 'className', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="dark:invert"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Optional Tailwind CSS classes (e.g., "dark:invert" for dark mode styling)
                                </p>
                            </div>

                            {skill.icon && (
                                <div className="mt-4 p-4 bg-background rounded-xl border border-border">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Icon Preview
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center">
                                            <img
                                                src={skill.icon}
                                                alt={skill.name || 'Icon'}
                                                className={`w-10 h-10 object-contain ${skill.className || ''}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none'
                                                }}
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {skill.name || 'No name set'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <h3 className="text-sm font-medium text-primary mb-2">💡 Icon Resources</h3>
                <p className="text-xs text-muted-foreground mb-2">
                    You can use icons from:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                        <a href="https://devicon.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            DevIcon CDN
                        </a>
                        {' '} - Example: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
                    </li>
                    <li>Simple Icons, Heroicons, or any public CDN</li>
                </ul>
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

