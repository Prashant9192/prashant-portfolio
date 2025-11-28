'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { ExperienceItem } from '@/lib/models'

export default function Experience() {
    const [experiences, setExperiences] = useState<ExperienceItem[]>([])

    useEffect(() => {
        async function fetchExperiences() {
            try {
                const res = await fetch('/api/content/experience')
                if (res.ok) {
                    const data = await res.json()
                    setExperiences(data.experiences || [])
                }
            } catch (error) {
                console.error('Failed to fetch experience data:', error)
            }
        }
        fetchExperiences()
    }, [])
    return (
        <section id="experience" className="h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-full p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors"
            >
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text"
                >
                    Experience
                </motion.h2>

                <div className="space-y-6 md:space-y-8">
                    {experiences.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No experience data available.</p>
                    ) : (
                        experiences.map((exp, index) => (
                            <motion.div
                                key={`${exp.role}-${exp.company}-${index}`}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <SpotlightCard className="rounded-2xl" propClass="flex items-center gap-3 md:gap-4 p-2">
                                    <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl ${exp.logoBg} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-inner`}>
                                        {exp.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold  group-hover:text-primary transition-colors">
                                            {exp.role}
                                        </h3>
                                        <p className="text-muted-foreground text-xs md:text-sm font-medium">
                                            {exp.company}
                                        </p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground/60 mt-0.5 md:mt-1">
                                            {exp.period}
                                        </p>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </section>
    )
}
