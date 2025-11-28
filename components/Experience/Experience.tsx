'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'

const experiences = [
    {
        id: 1,
        role: 'Web Developer',
        company: 'Digitrix Agency',
        period: 'Aug 2024 - Present',
        logo: 'm',
        logoBg: 'bg-blue-600'
    },
    {
        id: 2,
        role: 'Sr. PHP Developer',
        company: 'Benum.oDesign',
        period: 'Apr 2024 - Jun 2024',
        logo: '☼',
        logoBg: 'bg-blue-500'
    }
]

export default function Experience() {
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
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
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
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
