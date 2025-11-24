'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import styles from './Header.module.css'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`${styles.header} sticky top-0 z-50`}
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Brand />
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6" aria-label="Main navigation">
          <Link href="/projects" className="opacity-90 hover:opacity-100 transition">Projects</Link>
          <Link href="/about" className="opacity-90 hover:opacity-100 transition">About</Link>
          <Link href="/contact" className="opacity-90 hover:opacity-100 transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
