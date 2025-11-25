'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileCode, Database, Server, Layout, Code2, Terminal } from 'lucide-react'

const skills = [
    { name: 'Next.js', icon: <FileCode size={24} /> },
    { name: 'React', icon: <Code2 size={24} /> },
    { name: 'JavaScript', icon: <span className="font-bold text-xl">Js</span> },
    { name: 'TypeScript', icon: <span className="font-bold text-xl">TS</span> },
    { name: 'Node.js', icon: <Server size={24} /> },
    { name: 'Tailwind', icon: <Layout size={24} /> },
    { name: 'PHP', icon: <span className="font-bold text-xl">php</span> },
    { name: 'MongoDB', icon: <Database size={24} /> },
]

export default function Skills() {
    return (
        <section id="skills" className="py-20">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-12"
                >
                    Skills
                </motion.h2>

                <div className="flex flex-wrap gap-4">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-default shadow-sm"
                            title={skill.name}
                        >
                            <div className="text-foreground/80 group-hover:text-primary transition-colors">
                                {skill.icon}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
