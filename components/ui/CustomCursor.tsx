'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(true) // assume touch until proven otherwise

    // Mouse position
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring animation
    const springConfig = { damping: 25, stiffness: 700 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        // Only enable custom cursor for pointer/hover capable devices
        const isPointerDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        setIsTouchDevice(!isPointerDevice)

        if (!isPointerDevice) return // No cursor needed on touch devices

        let timer: NodeJS.Timeout

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16)
            mouseY.set(e.clientY - 16)
            setIsVisible(true)

            clearTimeout(timer)
            timer = setTimeout(() => {
                setIsVisible(false)
            }, 1000) // Hide after 1 second of inactivity
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
            setIsVisible(true)
            clearTimeout(timer)
            timer = setTimeout(() => {
                setIsVisible(false)
            }, 1000)
        }

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mouseover', handleMouseOver)
            clearTimeout(timer)
        }
    }, [mouseX, mouseY])

    // Don't render on touch devices at all
    if (isTouchDevice) return null

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorX,
                y: cursorY,
                scale: isHovering ? 1.5 : 1,
                opacity: isVisible ? 1 : 0,
                backgroundColor: isHovering ? 'var(--primary)' : 'transparent',
            }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isHovering ? 1.5 : 1,
            }}
            transition={{
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }}
        >
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
        </motion.div>
    )
}
