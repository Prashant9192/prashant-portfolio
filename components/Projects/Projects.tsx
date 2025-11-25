'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

const projects = [
    {
        id: 1,
        title: 'Create Receipts',
        description: 'SaaS web app for personal bookkeeping and receipt management. Streamlines financial tracking with intuitive tools.',
        tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
        image: '/projects/receipts.png',
        liveUrl: '#',
        githubUrl: '#'
    },
    {
        id: 2,
        title: 'AI Homework',
        description: 'Subscription based AI homework helper platform developed with Next.js. Helps students solve complex problems instantly.',
        tags: ['Next.js', 'OpenAI API', 'Stripe', 'TypeScript'],
        image: '/projects/homework.png',
        liveUrl: '#',
        githubUrl: '#'
    },
    {
        id: 3,
        title: 'Portfolio Websites',
        description: 'Modern portfolio websites developed using Vite, Tailwind CSS and Framer Motion. Showcasing creative developer identities.',
        tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
        image: '/projects/portfolio.png',
        liveUrl: '#',
        githubUrl: '#'
    }
]

export default function Projects() {
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
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative flex flex-col rounded-2xl border !border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Placeholder Gradient - Replace with Image component when assets are ready */}
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <span className="text-muted-foreground/50 font-medium">Project Preview</span>
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute bottom-4 right-4 z-20 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <a href={project.githubUrl} className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors" title="View Code">
                                        <Github size={18} />
                                    </a>
                                    <a href={project.liveUrl} className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20" title="Live Demo">
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
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
