'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Github, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="glass border-t border-gray-200 dark:border-white/10 mt-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

                {/* Brand */}
                <div className="flex items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Prashant.dev
                    </span>
                </div>

                {/* Copyright */}
                <div className="text-sm text-muted-foreground text-center">
                    Copyright {currentYear}© Prashant.dev
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-4">
                    <Link href="https://www.facebook.com/prashant.basnet.7902" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook size={20} />
                    </Link>
                    <Link href="https://github.com/Prashant9192/" className="text-muted-foreground hover:text-primary transition-colors">
                        <Github size={20} />
                    </Link>
                    <Link href="https://www.linkedin.com/in/prashant-basnet-173b87244/" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin size={20} />
                    </Link>
                    <Link href="https://www.instagram.com/basnet_prashant02/" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram size={20} />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
