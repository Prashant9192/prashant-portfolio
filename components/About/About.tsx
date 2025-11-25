'use client'


import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
    return (
        <div id="about" className="h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-full p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors"
            >
                {/* Status Badge */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-500">Available</span>
                </div>

                <div className="space-y-6 md:space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                    >
                        About Me
                    </motion.h2>

                    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
                        {/* Profile Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl group"
                        >
                            <Image
                                src="/MyAvatar.png"
                                alt="Prashant Basnet"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </motion.div>

                        {/* Bio Text */}
                        <div className="space-y-4 md:space-y-6">
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                I'm a Full Stack web Developer with experience in building scalable, SEO-friendly and modern web applications.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-8 pt-6 border-t border-white/5 flex items-center gap-3 text-sm text-primary/80 bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <span className="text-xl">🚀</span>
                    <span>Currently creating modern web solutions at <span className="font-semibold text-primary">Digitrix Agency</span></span>
                </div>
            </motion.div>
        </div>
    )
}
