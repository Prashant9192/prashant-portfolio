'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import SpotlightCard from '@/components/ui/SpotlightCard'
import TiltCard from '@/components/ui/TiltCard'
import { useContent } from '@/contexts/ContentContext'
import { Project } from '@/lib/models'

interface ProjectsProps {
    serverData?: Project[]
}

export default function Projects({ serverData }: ProjectsProps) {
    const { projects } = useContent()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Initialize with a default value (3) to match server-side rendering
    const [projectsPerView, setProjectsPerView] = useState(3)

    React.useEffect(() => {
        const calculateProjectsPerView = () => {
            if (window.innerWidth < 768) return 1
            if (window.innerWidth < 1024) return 2
            return 3
        }

        const handleResize = () => {
            setProjectsPerView(calculateProjectsPerView())
        }

        // Set initial value based on actual screen size
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const totalProjects = projects.length
    const maxIndex = Math.max(0, totalProjects - projectsPerView)

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const visibleProjects = projects.slice(currentIndex, currentIndex + projectsPerView)

    return (
        <section id="projects" className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 md:mb-12 flex items-center justify-between"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Featured <span className="text-primary">Projects</span>
                    </h2>

                    {/* Navigation Buttons */}
                    {projects.length > projectsPerView && (
                        <div className="flex gap-2">
                            <button
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className="p-3 rounded-full bg-card border border-border hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border group"
                                aria-label="Previous projects"
                            >
                                <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={currentIndex >= maxIndex}
                                className="p-3 rounded-full bg-card border border-border hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border group"
                                aria-label="Next projects"
                            >
                                <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    )}
                </motion.div>

                {projects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No projects available.</p>
                ) : (
                    <>
                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="wait">
                                {visibleProjects.map((project, index) => (
                                    <motion.div
                                        key={`${project.title}-${currentIndex + index}`}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex"
                                    >
                                        <TiltCard className="w-full">
                                            <SpotlightCard className="flex flex-col rounded-2xl h-full group min-h-[420px]">
                                                {/* Image Container */}
                                                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                                                    {/* Project Image */}
                                                    {project.image ? (
                                                        <Image
                                                            src={project.image}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            onError={(e) => {
                                                                const target = e.currentTarget
                                                                target.style.display = 'none'
                                                                const parent = target.parentElement
                                                                if (parent && !parent.querySelector('.project-placeholder')) {
                                                                    const placeholder = document.createElement('div')
                                                                    placeholder.className = 'project-placeholder absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center'
                                                                    const span = document.createElement('span')
                                                                    span.className = 'text-muted-foreground dark:text-muted-foreground/50 font-medium'
                                                                    span.textContent = 'Project Preview'
                                                                    placeholder.appendChild(span)
                                                                    parent.appendChild(placeholder)
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                            <span className="text-muted-foreground dark:text-muted-foreground/50 font-medium">Project Preview</span>
                                                        </div>
                                                    )}

                                                    {/* Overlay Actions */}
                                                    <div className="absolute bottom-4 right-4 z-20 flex gap-2 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                                        <a
                                                            href={project.githubUrl}
                                                            className="p-2 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-black/30 dark:border-white/20 text-white hover:bg-black/30 dark:hover:bg-white/20 transition-colors"
                                                            title="View Code"
                                                            onClick={(e) => {
                                                                if (project.githubUrl === '#') {
                                                                    e.preventDefault()
                                                                }
                                                            }}
                                                        >
                                                            <Github size={18} />
                                                        </a>
                                                        <a
                                                            href={project.liveUrl}
                                                            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                                            title="Live Demo"
                                                            onClick={(e) => {
                                                                if (project.liveUrl === '#') {
                                                                    e.preventDefault()
                                                                }
                                                            }}
                                                        >
                                                            <ArrowUpRight size={18} />
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex flex-col flex-grow p-6">
                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                                                        {project.description}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mt-auto">
                                                        {project.tags.map(tag => (
                                                            <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </SpotlightCard>
                                        </TiltCard>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        {projects.length > projectsPerView && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'w-8 bg-primary'
                                            : 'w-2 bg-border hover:bg-primary/50'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* NoScript fallback */}
            <noscript>
                <div className="container mx-auto px-4">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Featured <span className="text-primary">Projects</span>
                        </h2>
                    </div>

                    {serverData && serverData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {serverData.map((project, index) => (
                                <div key={`${project.title}-${index}`} className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-md">
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        {project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <span className="text-muted-foreground font-medium">Project Preview</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-grow p-6">
                                        <h3 className="text-xl font-bold mb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-auto mb-4">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            {project.githubUrl && project.githubUrl !== '#' && (
                                                <a
                                                    href={project.githubUrl}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-colors text-sm"
                                                >
                                                    View Code
                                                </a>
                                            )}
                                            {project.liveUrl && project.liveUrl !== '#' && (
                                                <a
                                                    href={project.liveUrl}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm"
                                                >
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </noscript>
        </section>
    )
}
