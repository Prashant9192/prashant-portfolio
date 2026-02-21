'use client'

import React, { useRef } from 'react'
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import MagneticButton from '@/components/ui/MagneticButton'
import { useContent } from '@/contexts/ContentContext'

export default function Hero() {
    const ref = useRef(null)
    const { hero: heroData, contact } = useContent()

    // 3D Tilt Effect
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 })
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 })

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        x.set((clientX - left) / width - 0.5)
        y.set((clientY - top) / height - 0.5)
    }

    function onMouseLeave() {
        x.set(0)
        y.set(0)
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15])

    const socials = contact?.socials

    return (
        <section id="home" className="relative pt-20 pb-12 md:pt-32 md:pb-20 overflow-hidden">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 z-10"
                >
                    <h1 className="font-bold tracking-tight mb-1">
                        Hi, I&apos;m <br />
                        <span className="whitespace-nowrap text-primary">{heroData?.name || 'Loading...'}</span>
                    </h1>

                    {heroData?.roles && heroData.roles.length > 0 && (
                        <div className="text-2xl md:text-3xl font-semibold text-[#3B82F6] mb-1 md:whitespace-nowrap h-[40px] flex items-center">
                            <Typewriter
                                options={{
                                    strings: heroData.roles,
                                    autoStart: true,
                                    loop: true,
                                    deleteSpeed: 50,
                                    delay: 50,
                                }}
                            />
                        </div>
                    )}

                    <p className="text-muted-foreground text-lg max-w-lg leading-relaxed mb-1">
                        {heroData?.description || 'Loading...'}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        <MagneticButton>
                            <a
                                href="#projects"
                                className="text-base inline-flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors group"
                            >
                                View Projects
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </MagneticButton>

                        {heroData?.resumeUrl && (
                            <MagneticButton>
                                <a
                                    href={heroData.resumeUrl}
                                    download={heroData.resumeUrl.split('/').pop()}
                                    className="text-base inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors border border-border dark:border-white/5"
                                >
                                    <Download size={16} />
                                    Download Resume
                                </a>
                            </MagneticButton>
                        )}
                    </div>

                    {/* Social Links — visible immediately without scrolling to footer */}
                    {socials && (socials.github || socials.linkedin || socials.twitter) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex items-center gap-3 pt-1"
                        >
                            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Connect</span>
                            <div className="h-px w-8 bg-border" />
                            <div className="flex items-center gap-2">
                                {socials.github && (
                                    <a
                                        href={socials.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub Profile"
                                        className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 text-muted-foreground hover:scale-110"
                                    >
                                        <Github size={16} />
                                    </a>
                                )}
                                {socials.linkedin && (
                                    <a
                                        href={socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn Profile"
                                        className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all duration-200 text-muted-foreground hover:scale-110"
                                    >
                                        <Linkedin size={16} />
                                    </a>
                                )}
                                {socials.twitter && (
                                    <a
                                        href={socials.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Twitter / X Profile"
                                        className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200 text-muted-foreground hover:scale-110"
                                    >
                                        <Twitter size={16} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Avatar Image with 3D Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative flex justify-center md:justify-end [perspective:1000px]"
                >
                    <motion.div
                        ref={ref}
                        onMouseMove={onMouseMove}
                        onMouseLeave={onMouseLeave}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="relative w-full max-w-lg cursor-pointer"
                    >
                        {/* Glow effect behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full -z-10" />

                        {/* Floating Animation Wrapper */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Image
                                src={heroData?.avatar || '/MyAvatar.png'}
                                alt={`${heroData?.name || 'Portfolio'} Avatar`}
                                width={600}
                                height={600}
                                className="relative z-10 object-contain drop-shadow-2xl"
                                priority
                                style={{ transform: "translateZ(50px)" }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    )
}
