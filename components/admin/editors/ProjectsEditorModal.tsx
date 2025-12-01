'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Plus, Trash2, X, Upload, Image } from 'lucide-react'
import { toast } from 'sonner'
import { Project } from '@/lib/models'

interface ProjectsEditorModalProps {
  onClose: () => void
}

export default function ProjectsEditorModal({ onClose }: ProjectsEditorModalProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({})
    const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/projects')
            if (res.ok) {
                const data = await res.json()
                setProjects(data.projects || [])
            }
        } catch (error) {
            toast.error('Failed to load projects data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch('/api/content/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ projects })
            })

            if (res.ok) {
                toast.success('Projects updated successfully!')
                onClose()
            } else {
                toast.error('Failed to update projects')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const addProject = () => {
        setProjects([...projects, {
            title: '',
            description: '',
            tags: [],
            image: '',
            liveUrl: '#',
            githubUrl: '#',
            order: projects.length
        }])
    }

    const removeProject = (index: number) => {
        const updated = projects.filter((_, i) => i !== index)
        const reordered = updated.map((project, i) => ({ ...project, order: i }))
        setProjects(reordered)
    }

    const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
        const updated = [...projects]
        updated[index] = { ...updated[index], [field]: value }
        setProjects(updated)
    }

    const addTag = (index: number, tag: string) => {
        if (!tag.trim()) return
        const project = projects[index]
        if (!project.tags.includes(tag.trim())) {
            updateProject(index, 'tags', [...project.tags, tag.trim()])
        }
    }

    const removeTag = (projectIndex: number, tagIndex: number) => {
        const project = projects[projectIndex]
        const updatedTags = project.tags.filter((_, i) => i !== tagIndex)
        updateProject(projectIndex, 'tags', updatedTags)
    }

    const moveProject = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === projects.length - 1) return

        const updated = [...projects]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
        
        const reordered = updated.map((project, i) => ({ ...project, order: i }))
        setProjects(reordered)
    }

    const handleImageUpload = async (file: File, projectIndex: number) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error('File size must be less than 5MB')
            return
        }

        setUploadingImages(prev => ({ ...prev, [projectIndex]: true }))

        try {
            const token = localStorage.getItem('adminToken')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'project')

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to upload image')
            }

            const result = await res.json()
            updateProject(projectIndex, 'image', result.path)
            toast.success('Project image uploaded successfully!')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload image')
        } finally {
            setUploadingImages(prev => ({ ...prev, [projectIndex]: false }))
            const input = imageInputRefs.current[projectIndex]
            if (input) {
                input.value = ''
            }
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, projectIndex: number) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file, projectIndex)
        }
    }

    const setImageInputRef = (projectIndex: number, element: HTMLInputElement | null) => {
        imageInputRefs.current[projectIndex] = element
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
                    onClick={addProject}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {projects.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                        No projects added. Click "Add Project" to get started.
                    </div>
                ) : (
                    projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-2xl p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-muted-foreground">Project #{index + 1}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => moveProject(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveProject(index, 'down')}
                                        disabled={index === projects.length - 1}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => removeProject(index)}
                                        className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Project Title
                                    </label>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Project Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Project Image
                                    </label>
                                    <div className="space-y-3">
                                        {project.image && (
                                            <div className="relative w-full h-32 rounded-xl bg-background border border-input overflow-hidden">
                                                <img
                                                    src={project.image}
                                                    alt={`${project.title || 'Project'} preview`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <input
                                                ref={(el) => setImageInputRef(index, el)}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, index)}
                                                className="hidden"
                                                id={`project-image-${index}`}
                                                disabled={uploadingImages[index]}
                                            />
                                            <label
                                                htmlFor={`project-image-${index}`}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                                    uploadingImages[index]
                                                        ? 'border-primary/50 bg-primary/5 cursor-wait'
                                                        : 'border-input hover:border-primary hover:bg-accent'
                                                }`}
                                            >
                                                {uploadingImages[index] ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin text-primary" />
                                                        <span className="text-sm text-foreground">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Image size={18} className="text-foreground" />
                                                        <span className="text-sm text-foreground">Upload Image</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        {project.image && (
                                            <p className="text-xs text-muted-foreground">
                                                Current: <span className="font-mono">{project.image}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={project.description}
                                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                                    placeholder="Project description..."
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Live URL
                                    </label>
                                    <input
                                        type="url"
                                        value={project.liveUrl}
                                        onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        GitHub URL
                                    </label>
                                    <input
                                        type="url"
                                        value={project.githubUrl}
                                        onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {project.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm border border-primary/30"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => removeTag(index, tagIndex)}
                                                className="hover:text-destructive transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a tag and press Enter"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addTag(index, e.currentTarget.value)
                                            e.currentTarget.value = ''
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-2">Press Enter to add a tag</p>
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

