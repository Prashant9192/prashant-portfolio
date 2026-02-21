
'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Github, Linkedin, Instagram, Twitter, ArrowUpRight, Heart, Cpu, ShieldCheck } from 'lucide-react'
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
        <footer className="border-t border-border mt-auto bg-zinc-950/10">
            <div className="mx-auto max-w-6xl px-4 py-12">

                {/* Top row — Brand + Nav */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">

                    {/* Brand + tagline */}
                    <div className="space-y-2">
                        <Link href="/" aria-label="Go to homepage">
                            <span className="font-black text-2xl tracking-tight text-foreground">
                                Prashant<span className="text-primary">.dev</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Building performant, human-centric web experiences with passion and precision.
                        </p>
                    </div>

                    {/* Quick Nav */}
                    <nav className="flex flex-wrap gap-x-8 gap-y-4" aria-label="Footer navigation">
                        {navLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* CTA Banner */}
                <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                    <div className="text-center sm:text-left">
                        <p className="font-bold text-lg text-foreground">Have a project in mind?</p>
                        <p className="text-sm text-muted-foreground">Let&apos;s build something great together.</p>
                    </div>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                    >
                        Get in Touch
                        <ArrowUpRight size={16} />
                    </a>
                </div>

                {/* Bottom row — Copyright + Socials */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50">

                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                        © {currentYear} Prashant.dev · Built with
                        <Heart size={12} className="text-red-500 fill-red-500 mx-0.5" />
                        using Next.js
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        {socials?.github && (
                            <Link href={socials.github} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-all duration-200" title="GitHub">
                                <Github size={20} />
                            </Link>
                        )}
                        {socials?.linkedin && (
                            <Link href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-[#0077B5] transition-all duration-200" title="LinkedIn">
                                <Linkedin size={20} />
                            </Link>
                        )}
                        {socials?.twitter && (
                            <Link href={socials.twitter} target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-all duration-200" title="Twitter">
                                <Twitter size={20} />
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </footer>
    )
}
