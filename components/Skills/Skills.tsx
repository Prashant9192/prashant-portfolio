'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useContent } from '@/contexts/ContentContext'
import SpotlightCard from '@/components/ui/SpotlightCard'

export default function Skills() {
    const { skills, loading } = useContent()
    
    return (
        <section id="skills" className="py-20 relative overflow-hidden">
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
                    className="mb-8 md:mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Skills & <span className="text-primary">Technologies</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                        Technologies and tools I use to bring ideas to life
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-muted-foreground">Loading skills...</p>
                        </div>
                    </div>
                ) : skills.length === 0 ? (
                    <p className="text-muted-foreground text-center py-20">No skills available.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={`${skill.name}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <SpotlightCard className="rounded-xl group cursor-pointer h-full" propClass="flex flex-col items-center justify-center p-4 md:p-6 gap-3 min-h-[140px] md:min-h-[160px]">
                                    {/* Icon Container */}
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                        {skill.icon ? (
                                            <img
                                                src={skill.icon}
                                                alt={skill.name}
                                                className={`w-full h-full object-contain transition-all duration-300 ${skill.className || ''}`}
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.currentTarget
                                                    target.style.display = 'none'
                                                    const parent = target.parentElement
                                                    if (parent && !parent.querySelector('.skill-fallback')) {
                                                        const fallback = document.createElement('div')
                                                        fallback.className = 'skill-fallback w-full h-full flex items-center justify-center rounded-lg bg-primary/10'
                                                        const span = document.createElement('span')
                                                        span.className = 'text-2xl md:text-3xl font-bold text-primary'
                                                        span.textContent = skill.name.charAt(0).toUpperCase()
                                                        fallback.appendChild(span)
                                                        parent.appendChild(fallback)
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center rounded-lg bg-primary/10">
                                                <span className="text-2xl md:text-3xl font-bold text-primary">
                                                    {skill.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skill Name */}
                                    <div className="text-center w-full">
                                        <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {skill.name}
                                        </h3>
                                    </div>

                                    {/* Hover Effect Indicator */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
