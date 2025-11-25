'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import styles from './Header.module.css'


export default function Header() {
  const [activeSection, setActiveSection] = React.useState('home')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    // { name: 'Contact', href: '#contact' }, // Uncomment when Contact section is added
  ]

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
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${activeSection === link.href.substring(1)
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-primary'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
