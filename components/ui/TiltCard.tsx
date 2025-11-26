'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = ref.current?.getBoundingClientRect()
        if (rect) {
            const width = rect.width
            const height = rect.height
            const mouseXFromCenter = e.clientX - rect.left - width / 2
            const mouseYFromCenter = e.clientY - rect.top - height / 2
            x.set(mouseXFromCenter)
            y.set(mouseYFromCenter)
        }
    }

    function handleMouseLeave() {
        x.set(0)
        y.set(0)
    }

    const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
    const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
