'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export default function SpotlightCard({ children, className = '', propClass = '' }: { children: React.ReactNode, className?: string, propClass?: string }) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <div
            className={`group relative border border-border bg-card dark:border-white/10 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(59, 130, 246, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className={`relative h-full ${propClass}`}>
                {children}
            </div>
        </div>
    )
}
