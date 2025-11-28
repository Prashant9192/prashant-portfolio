'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Skill } from '@/lib/models'

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>([])

    useEffect(() => {
        async function fetchSkills() {
            try {
                const res = await fetch('/api/content/skills')
                if (res.ok) {
                    const data = await res.json()
                    setSkills(data.skills || [])
                }
            } catch (error) {
                console.error('Failed to fetch skills data:', error)
            }
        }
        fetchSkills()
    }, [])
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

                <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    {skills.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No skills available.</p>
                    ) : (
                        <div className="flex animate-scroll gap-8 w-max">
                            {/* Duplicate the skills list to create the infinite loop effect */}
                            {[...skills, ...skills].map((skill, index) => (
                                <motion.div
                                    key={`${skill.name}-${index}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-white/10 transition-all cursor-default shadow-sm hover:shadow-lg"
                                title={skill.name}
                            >
                                <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={skill.icon}
                                        alt={skill.name}
                                        fill
                                        className={`object-contain ${skill.className || ''}`}
                                    />
                                </div>
                            </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
