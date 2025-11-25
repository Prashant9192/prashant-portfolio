'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'

const projects = [
    {
        id: 1,
        title: 'Create Recepts',
        description: 'SaaS web app for personn bookseeping',
        tags: ['React', 'Node.js', 'MonoGDB'],
        image: '/projects/receipts.png',
        bgColor: 'bg-[#1A1D26]'
    },
    {
        id: 2,
        title: 'AI Homework',
        description: 'Subscription based platform developed with Kext.js',
        tags: ['AI', 'Homework'],
        image: '/projects/homework.png',
        bgColor: 'bg-[#1A1D26]'
    },
    {
        id: 3,
        title: 'Portfolio Websites',
        description: 'Developed using VITE L/CSS and Lavelscript',
        tags: ['HTML', 'CSS', 'JA'],
        image: '/projects/portfolio.png',
        bgColor: 'bg-[#1A1D26]'
    }
]

export default function Projects() {
    return (
        <section id="projects" className="py-12">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-8"
                >
                    Projects
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group rounded-xl bg-[#111318] border border-white/5 overflow-hidden hover:border-primary/20 transition-all"
                        >
                            <div className="p-6 pb-0">
                                <h3 className="text-xl font-bold mb-2 text-white">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 h-10">
                                    {project.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded bg-[#1F2229] text-muted-foreground border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Image Area */}
                            <div className="relative aspect-[4/3] bg-[#1F2229] mx-6 mb-6 rounded-lg overflow-hidden border border-white/5 group-hover:border-primary/20 transition-colors">
                                {/* Placeholder for project screenshot */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
