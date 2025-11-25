'use client'
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'

const experiences = [
    {
        id: 1,
        role: 'Web Developer',
        company: 'Digitrix Agency',
        period: 'Aug 2024 - Fras', // Matching the typo/text in image "Fras" (likely Present)
        logo: 'm', // Using 'm' as seen in image
        logoBg: 'bg-blue-600'
    },
    {
        id: 2,
        role: 'Sr. PHP Developer',
        company: 'Benum.oDesign',
        period: 'Apr 2024 - Jun 2024',
        logo: '☼', // Placeholder for the sun-like icon
        logoBg: 'bg-blue-500'
    }
]

export default function Experience() {
    return (
        <div id="experience" className="space-y-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold"
            >
                Experience
            </motion.h2>

            <div className="flex flex-col gap-4">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex items-center gap-4 p-4 rounded-xl bg-[#111318] border border-white/5 hover:border-primary/20 transition-all"
                    >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${exp.logoBg} flex items-center justify-center text-white font-bold text-xl`}>
                            {exp.logo}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {exp.role}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {exp.company}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                {exp.period}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
