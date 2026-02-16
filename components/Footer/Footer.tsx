
'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Github, Linkedin, Instagram, Twitter } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const { contact } = useContent()
    const socials = contact?.socials

    return (
        <footer className="border-t border-border mt-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

                {/* Brand */}
                <div className="flex items-center">
                    <span className="font-bold text-xl tracking-tight text-foreground">
                        Prashant<span className="text-primary">.dev</span>
                    </span>
                </div>

                {/* Copyright */}
                <div className="text-sm text-muted-foreground text-center">
                    Copyright {currentYear} © Prashant.dev
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-4">
                    {socials?.github && (
                        <Link href={socials.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="GitHub">
                            <Github size={20} />
                        </Link>
                    )}
                    {socials?.linkedin && (
                        <Link href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
                            <Linkedin size={20} />
                        </Link>
                    )}
                    {socials?.twitter && (
                        <Link href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Twitter">
                            <Twitter size={20} />
                        </Link>
                    )}
                    {socials?.instagram && (
                        <Link href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Instagram">
                            <Instagram size={20} />
                        </Link>
                    )}
                    {socials?.facebook && (
                        <Link href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Facebook">
                            <Facebook size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </footer>
    )
}
