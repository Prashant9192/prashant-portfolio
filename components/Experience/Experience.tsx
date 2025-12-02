'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { useContent } from '@/contexts/ContentContext'

export default function Experience() {
    const { experiences } = useContent()

    return (
        <section id="experience" className="h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-full p-6 md:p-8 rounded-3xl bg-card border border-border backdrop-blur-sm overflow-hidden hover:border-primary/30 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20 transition-colors shadow-md flex flex-col"
            >
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-foreground flex-shrink-0"
                >
                    Experience
                </motion.h2>

                {experiences.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No experience data available.</p>
                ) : (
                    <div className="relative flex-1 min-h-0">
                        {/* Scrollable container - shows 2 cards by default */}
                        <div className="h-full max-h-[270px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent pr-2 hover:scrollbar-thumb-primary/50 transition-colors">
                            <div className="space-y-4 md:space-y-6 relative pb-4">
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={`${exp.role}-${exp.company}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative group"
                                    >
                                        <SpotlightCard className="rounded-xl group-hover:border-primary/50 transition-all duration-300" propClass="flex items-start gap-4 p-4 md:p-5">
                                            {/* Logo/Icon */}
                                            <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg ${exp.logoBg} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                                                {exp.logo}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                                                    {exp.role}
                                                </h3>
                                                <p className="text-sm md:text-base text-muted-foreground font-medium mb-1.5">
                                                    {exp.company}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{exp.period}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Timeline indicator on the left */}
                                            <div className="absolute -left-2 md:-left-3 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </SpotlightCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </section>
    )
}
