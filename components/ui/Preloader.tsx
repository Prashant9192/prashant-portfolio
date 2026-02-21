'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
    // Skip preloader on repeat visits within the same session
    const [isLoading, setIsLoading] = useState(() => {
        if (typeof window === 'undefined') return true
        const visited = sessionStorage.getItem('preloader-shown')
        return !visited
    })

    useEffect(() => {
        if (!isLoading) return // Already skipped

        // Mark as shown so repeat visits skip the loader
        sessionStorage.setItem('preloader-shown', '1')

        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1800) // Reduced from 2000ms for snappier feel

        return () => clearTimeout(timer)
    }, [isLoading])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050511]"
                    initial={{ opacity: 1 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                            Prashant<span className="text-primary">.dev</span>
                        </div>
                        <motion.div
                            className="w-full h-1 bg-white/10 rounded-full overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="h-full bg-primary w-full origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
