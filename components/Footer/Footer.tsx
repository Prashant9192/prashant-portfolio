
'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Github, Linkedin, Instagram, Twitter, ArrowUpRight, Heart } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
]

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const { contact } = useContent()
    const socials = contact?.socials

    return (
        <footer className="border-t border-border mt-auto">
            <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">

                {/* Top row — Brand + Nav */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">

                    {/* Brand + tagline */}
                    <div className="space-y-2">
                        <Link href="/" aria-label="Go to homepage">
                            <span className="font-black text-2xl tracking-tight text-foreground">
                                Prashant<span className="text-primary">.dev</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Building modern, performant web experiences with passion and precision.
                        </p>
                    </div>

                    {/* Quick Nav */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
                        {navLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* CTA Banner */}
                <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="font-semibold text-foreground">Have a project in mind?</p>
                        <p className="text-sm text-muted-foreground">Let&apos;s build something great together.</p>
                    </div>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 whitespace-nowrap flex-shrink-0"
                    >
                        Get in Touch
                        <ArrowUpRight size={15} />
                    </a>
                </div>

                {/* Bottom row — Copyright + Socials */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        © {currentYear} Prashant.dev · Built with
                        <Heart size={12} className="text-red-500 fill-red-500 mx-0.5" />
                        using Next.js
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        {socials?.github && (
                            <Link href={socials.github} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200" title="GitHub">
                                <Github size={18} />
                            </Link>
                        )}
                        {socials?.linkedin && (
                            <Link href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-[#0077B5] transition-colors hover:scale-110 duration-200" title="LinkedIn">
                                <Linkedin size={18} />
                            </Link>
                        )}
                        {socials?.twitter && (
                            <Link href={socials.twitter} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200" title="Twitter">
                                <Twitter size={18} />
                            </Link>
                        )}
                        {socials?.instagram && (
                            <Link href={socials.instagram} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-pink-500 transition-colors hover:scale-110 duration-200" title="Instagram">
                                <Instagram size={18} />
                            </Link>
                        )}
                        {socials?.facebook && (
                            <Link href={socials.facebook} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-[#1877F2] transition-colors hover:scale-110 duration-200" title="Facebook">
                                <Facebook size={18} />
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </footer>
    )
}
