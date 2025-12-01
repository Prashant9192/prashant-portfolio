'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import SpotlightCard from '@/components/ui/SpotlightCard'
import TiltCard from '@/components/ui/TiltCard'
import { useContent } from '@/contexts/ContentContext'

export default function Projects() {
    const { projects } = useContent()
    return (
        <section id="projects" className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Featured <span className="text-primary">Projects</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 col-span-full">No projects available.</p>
                    ) : (
                        projects.map((project, index) => (
                            <motion.div
                                key={`${project.title}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                            <TiltCard className="h-full">
                                <SpotlightCard className="flex flex-col rounded-2xl h-full">
                                    {/* Image Container */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Project Image */}
                                        {project.image ? (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                onError={(e) => {
                                                    // Fallback to placeholder if image fails to load
                                                    const target = e.currentTarget
                                                    target.style.display = 'none'
                                                    const parent = target.parentElement
                                                    if (parent && !parent.querySelector('.project-placeholder')) {
                                                        const placeholder = document.createElement('div')
                                                        placeholder.className = 'project-placeholder absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center'
                                                        placeholder.innerHTML = '<span class="text-muted-foreground dark:text-muted-foreground/50 font-medium">Project Preview</span>'
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
                                        <div className="absolute bottom-4 right-4 z-20 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
