'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { X, Menu } from 'lucide-react'
import styles from './Header.module.css'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((s) => !s)}
        className="rounded-md p-2 border"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={`${styles.mobilePanel} ${open ? styles.mobileOpen : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <nav className="flex flex-col gap-4 p-6">
          <Link href="/projects" onClick={() => setOpen(false)}>Projects</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <a href="/Prashant-Resume.pdf" onClick={() => setOpen(false)}>Download Resume</a>
        </nav>
      </div>
    </>
  )
}
