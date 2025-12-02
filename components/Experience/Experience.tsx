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
                        {/* Timeline line with gradient */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50 dark:from-primary/30 dark:via-primary/50 dark:to-primary/30" />
                        
                        {/* Scrollable container with fixed height */}
                        <div className="h-full max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2">
                            <div className="space-y-6 md:space-y-8 relative pb-4">
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={`${exp.role}-${exp.company}-${index}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative pl-12 md:pl-16 group"
                                    >
                                        {/* Timeline dot with glow effect */}
                                        <div className="absolute left-4 md:left-6 top-3 z-10">
                                            <div className="w-4 h-4 rounded-full bg-primary border-2 border-card dark:border-white/5 shadow-lg shadow-primary/50 group-hover:shadow-primary/80 transition-shadow" />
                                            <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        
                                        {/* Connecting line to card */}
                                        <div className="absolute left-[26px] md:left-[30px] top-6 w-4 h-0.5 bg-primary/30 group-hover:bg-primary/50 transition-colors" />
                                        
                                        <SpotlightCard className="rounded-2xl group-hover:border-primary/50 transition-all" propClass="flex items-center gap-3 md:gap-4 p-4 md:p-5">
                                            <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl ${exp.logoBg} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-inner group-hover:scale-105 transition-transform`}>
                                                {exp.logo}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base md:text-lg font-bold group-hover:text-primary transition-colors">
                                                    {exp.role}
                                                </h3>
                                                <p className="text-muted-foreground text-xs md:text-sm font-medium mt-0.5">
                                                    {exp.company}
                                                </p>
                                                <p className="text-[10px] md:text-xs text-muted-foreground/60 mt-1 flex items-center gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                                                    {exp.period}
                                                </p>
                                            </div>
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
