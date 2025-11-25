'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import styles from './Header.module.css'
import { ChevronLeft } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`${styles.header} sticky top-0 z-50`}
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Brand />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
          <Link href="#skills" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Skills</Link>
          <Link href="#projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Projects</Link>
          <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Back button placeholder as seen in design */}
          <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground">
            <ChevronLeft size={16} />
          </button>

          {/* Theme Toggle (optional if we want to keep it, design doesn't explicitly show it but it's good practice) */}
          {/* <ThemeToggle /> */}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
