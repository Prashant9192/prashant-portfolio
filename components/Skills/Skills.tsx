'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useContent } from '@/contexts/ContentContext'

export default function Skills() {
    const { skills } = useContent()
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
                                className="group flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default shadow-sm hover:shadow-lg dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
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
