'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
    return (
        <div id="about" className="space-y-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold"
            >
                About Me
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-6 items-center sm:items-start"
            >
                {/* Profile Image */}
                <div className="relative w-32 h-32 flex-shrink-0 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    {/* Placeholder for Profile Image - Replace with actual image */}
                    <Image
                        src="/MyAvatar.png"
                        alt="Prashant Basnet"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Bio Text */}
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                    <p>
                        I'm a Full Stack web Developer with experience in building scalable, SEO-friendly and modern web applications.
                    </p>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-lg"
            >
                Currently, I work at Digitrix Agency creating modern web solutions.
            </motion.p>
        </div>
    )
}
