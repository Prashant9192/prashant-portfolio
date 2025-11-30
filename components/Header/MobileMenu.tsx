'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Menu } from 'lucide-react'
import styles from './Header.module.css'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(`.${styles.mobilePanel}`) && !target.closest('button')) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  return (
    <>
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((s) => !s)}
        className="rounded-md p-2 hover:bg-secondary/50 transition-colors"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`${styles.mobilePanel} ${open ? styles.mobileOpen : ''}`}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
      >
        <div className="px-4 pt-4 pb-8">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link href="#home" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="#about" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">About</Link>
            <Link href="#skills" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">Skills</Link>
            <Link href="#projects" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">Projects</Link>
            <Link href="#experience" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">Experience</Link>
            <Link href="#contact" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">Contact</Link>
            <a href="/Prashant-Resume.pdf" download="Prashant-Resume.pdf" onClick={() => setOpen(false)} className="text-foreground hover:text-primary transition-colors">Download Resume</a>
          </nav>
        </div>
      </div>
    </>
  )
}
