
'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import MagneticButton from '@/components/ui/MagneticButton'

export default function Header() {
  const [activeSection, setActiveSection] = React.useState('home')

  // Use scroll hook to detect active section
  const { scrollY } = useScroll()

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

  // Removed 'Experience' from desktop nav to merge with 'About'
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-4 md:pt-6"
      >
        <div className="
          w-full md:w-[90%] max-w-5xl 
          backdrop-blur-xl bg-background/70 dark:bg-background/60 
          border border-border/40 shadow-sm 
          rounded-2xl md:rounded-full 
          px-4 md:px-6 h-16 md:h-14 
          flex items-center justify-between
          transition-all duration-300
        ">
          {/* Logo area */}
          <div className="flex items-center gap-4">
            <Brand />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
            {navLinks.map((link) => {
              // Logic to highlight 'About' even if 'Experience' section is active
              const isActive = activeSection === link.href.substring(1) ||
                (link.href === '#about' && activeSection === 'experience');

              return (
                <MagneticButton key={link.name}>
                  <Link
                    href={link.href}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                </MagneticButton>
              )
            })}
          </nav>

          {/* Actions area */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </motion.header>
    </>
  )
}
