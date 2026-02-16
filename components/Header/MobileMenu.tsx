'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { X, Menu, FileText, Home, User, Code, Briefcase, Send, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const menuItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Skills', href: '#skills', icon: Cpu },
    { name: 'Projects', href: '#projects', icon: Code },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Contact', href: '#contact', icon: Send },
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] md:hidden"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[101] w-full max-w-xs bg-card/95 backdrop-blur-xl border-l border-border p-6 shadow-2xl h-full overflow-y-auto md:hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-xl">Menu</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors text-lg font-medium group"
                    >
                      <span className="p-2 rounded-lg bg-secondary/30 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <item.icon size={20} />
                      </span>
                      {item.name}
                    </Link>
                  ))}

                  <div className="h-px bg-border my-2" />

                  <a
                    href="/Prashant-Resume.pdf"
                    download="Prashant-Resume.pdf"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors text-lg font-medium group"
                  >
                    <span className="p-2 rounded-lg bg-secondary/30 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </span>
                    Download Resume
                  </a>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
