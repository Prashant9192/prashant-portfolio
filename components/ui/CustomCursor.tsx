'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)

    // Mouse position
    const mouseX = useMotionValue(-100)
    const mouseY = useMotionValue(-100)

    // Smooth spring animation for the "premium" feel
    const springConfig = { damping: 40, stiffness: 400, mass: 0.5 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        // Precise touch detection
        const checkDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
            setIsSmallScreen(window.innerWidth < 1024)
        }

        checkDevice()

        const moveCursor = (e: MouseEvent) => {
            // Offset to center the 32px (8rem) circle
            mouseX.set(e.clientX - 16)
            mouseY.set(e.clientY - 16)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isClickable = target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer') ||
                getComputedStyle(target).cursor === 'pointer'

            setIsHovering(!!isClickable)
        }

        const handleMouseDown = () => setIsMouseDown(true)
        const handleMouseUp = () => setIsMouseDown(false)

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mouseover', handleMouseOver)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('resize', checkDevice)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mouseover', handleMouseOver)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('resize', checkDevice)
        }
    }, [mouseX, mouseY])

    if (isTouchDevice || isSmallScreen) return null

    return (
        <>
            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: 12, // Center within the 32px ring (16-4)
                    translateY: 12,
                }}
            />
            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full pointer-events-none z-[9998] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                animate={{
                    scale: isHovering ? 2.5 : (isMouseDown ? 0.8 : 1),
                    backgroundColor: isHovering ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                    borderWidth: isHovering ? '1px' : '2px',
                }}
                transition={{
                    scale: { type: 'spring', damping: 20, stiffness: 300 },
                    backgroundColor: { duration: 0.2 }
                }}
            >
                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-50" />
            </motion.div>
        </>
    )
}
