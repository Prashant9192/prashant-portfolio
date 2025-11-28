'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import MagneticButton from '@/components/ui/MagneticButton'
import { HeroContent } from '@/lib/models'

export default function Hero() {
    const ref = useRef(null)
    const [heroData, setHeroData] = useState<HeroContent | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHeroData() {
            try {
                const res = await fetch('/api/content/hero')
                if (res.ok) {
                    const data = await res.json()
                    setHeroData(data)
                }
            } catch (error) {
                console.error('Failed to fetch hero data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchHeroData()
    }, [])

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
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-1 ">
                        Hi, I'm <br />
                        <span className="whitespace-nowrap">{heroData?.name || 'Loading...'}</span>
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

                    <p className="text-muted-foreground text-lg max-w-lg leading-relaxed mb-1 ">
                        {heroData?.description || 'Loading...'}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <MagneticButton>
                            <a
                                href="#projects"
                                className="text-base inline-flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                View Projects
                            </a>
                        </MagneticButton>

                        {heroData?.resumeUrl && (
                            <MagneticButton>
                                <a
                                    href={heroData.resumeUrl}
                                    download={heroData.resumeUrl.split('/').pop()}
                                    className="text-base inline-flex items-center gap-2 bg-[#1F2229] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2A2D35] transition-colors border border-white/5"
                                >
                                    Download Resume
                                </a>
                            </MagneticButton>
                        )}
                    </div>
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

