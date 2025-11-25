'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
    return (
        <section id="about" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-2 gap-12 items-center"
                >
                    {/* Profile Image */}
                    <div className="flex justify-center md:justify-start">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-card shadow-xl">
                            {/* Placeholder for Profile Image */}
                            <div className="w-full h-full bg-muted flex items-center justify-center text-4xl">
                                PB
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>

                        <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                            <p>
                                I'm a Full Stack Web Developer with experience in building scalable, SEO-friendly, and modern web applications.
                            </p>
                            <p>
                                Currently, I work at Digitrix Agency creating modern web solutions. I love solving complex problems and learning new technologies.
                            </p>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    )
}
