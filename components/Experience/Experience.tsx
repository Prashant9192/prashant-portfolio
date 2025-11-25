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
        <section id="experience" className="py-12">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-8"
                >
                    Experience
                </motion.h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative flex items-center gap-4 p-5 rounded-xl bg-[#111318] border border-white/5 hover:border-primary/20 transition-all"
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
        </section>
    )
}
