
'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Plus, Trash2, X, Upload, Image, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import { Project } from '@/lib/models'

export default function ProjectsAdmin() {
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
                window.dispatchEvent(new Event('contentUpdated'))
                localStorage.setItem('contentUpdated', Date.now().toString())
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
        if (!confirm('Are you sure you want to delete this project?')) return
        const updated = projects.filter((_, i) => i !== index)
        const reordered = updated.map((project, i) => ({ ...project, order: i }))
        setProjects(reordered)
    }

    const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
        const updated = [...projects]
        updated[index] = { ...updated[index], [field]: value }
        setProjects(updated)
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

    const handleImageUpload = async (file: File, projectIndex: number) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

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
            toast.error('Failed to upload image')
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
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-2">Manage your portfolio projects.</p>
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

            <div className="space-y-8">
                {projects.length === 0 ? (
                    <div className="bg-card border-2 border-dashed border-border rounded-xl p-12 text-center">
                        <p className="text-muted-foreground mb-4">No projects added yet.</p>
                        <button
                            onClick={addProject}
                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add First Project
                        </button>
                    </div>
                ) : (
                    projects.map((project, index) => (
                        <div
                            key={index}
                            className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-4 bg-secondary/30 border-b border-border flex items-center justify-between">
                                <span className="font-semibold text-sm">Project #{index + 1}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => moveProject(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground disabled:opacity-30"
                                        title="Move Up"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveProject(index, 'down')}
                                        disabled={index === projects.length - 1}
                                        className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground disabled:opacity-30"
                                        title="Move Down"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <button
                                        onClick={() => removeProject(index)}
                                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive hover:text-red-600"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 grid gap-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Project Title</label>
                                            <input
                                                type="text"
                                                value={project.title}
                                                onChange={(e) => updateProject(index, 'title', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                                placeholder="Project Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                                            <textarea
                                                value={project.description}
                                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm resize-none"
                                                placeholder="Project description..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">Live URL</label>
                                                <input
                                                    type="url"
                                                    value={project.liveUrl}
                                                    onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">GitHub URL</label>
                                                <input
                                                    type="url"
                                                    value={project.githubUrl}
                                                    onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-sm"
                                                    placeholder="https://github..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Project Image</label>
                                            <div className="space-y-3">
                                                <div className="relative w-full aspect-video rounded-lg bg-background border border-input overflow-hidden flex items-center justify-center">
                                                    {project.image ? (
                                                        <img
                                                            src={project.image}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                                                            <Image size={24} />
                                                            <span className="text-xs">No image uploaded</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
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
                                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed text-sm cursor-pointer transition-colors ${uploadingImages[index]
                                                            ? 'border-primary/50 bg-primary/5 cursor-wait'
                                                            : 'border-input hover:border-primary hover:bg-accent'
                                                            }`}
                                                    >
                                                        {uploadingImages[index] ? (
                                                            <>
                                                                <Loader2 size={14} className="animate-spin text-primary" />
                                                                <span>Uploading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload size={14} />
                                                                <span>Upload Image</span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">Tags</label>
                                            <div className="bg-background border border-input rounded-lg p-2 space-y-2">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.tags.map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs"
                                                        >
                                                            {tag}
                                                            <button
                                                                onClick={() => removeTag(index, tagIndex)}
                                                                className="hover:text-destructive transition-colors"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type tag & press Enter"
                                                    className="w-full bg-transparent outline-none text-sm placeholder-muted-foreground"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault()
                                                            addTag(index, e.currentTarget.value)
                                                            e.currentTarget.value = ''
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <button
                    onClick={addProject}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus size={20} />
                    Add Another Project
                </button>
            </div>
        </div>
    )
}
