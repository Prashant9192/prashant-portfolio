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
        <div id="experience" className="h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors"
            >
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                >
                    Experience
                </motion.h2>

                <div className="relative space-y-8 pl-4">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-12"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-10 bg-[#050511] rounded-full border border-white/10">
                                <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                            </div>

                            <div className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${exp.logoBg} flex items-center justify-center text-white font-bold text-xl shadow-inner`}>
                                    {exp.logo}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                        {exp.role}
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium">
                                        {exp.company}
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        {exp.period}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
