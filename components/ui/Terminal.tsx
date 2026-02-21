'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, X, ChevronRight, Command } from 'lucide-react'
import { useContent } from '@/contexts/ContentContext'

export default function Terminal() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>(['Type "help" to see available commands'])
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { about, skills, projects, contact } = useContent()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [history])

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.toLowerCase().trim()
        let response = ''

        switch (cleanCmd) {
            case 'help':
                response = 'Available commands: about, skills, projects, contact, clear, exit'
                break
            case 'about':
                response = about?.bio || 'Loading about info...'
                break
            case 'skills':
                response = `My Skills: ${skills.map(s => s.name).join(', ')}`
                break
            case 'projects':
                response = projects.map(p => `• ${p.title}: ${p.liveUrl}`).join('\n')
                break
            case 'contact':
                response = `Email: ${contact?.email || 'prashantbasnet111@gmail.com'}\nLocation: ${contact?.location || 'Mumbai, India'}`
                break
            case 'clear':
                setHistory([])
                return
            case 'exit':
                setIsOpen(false)
                return
            case '':
                return
            default:
                response = `Command not found: ${cleanCmd}. Type "help" for a list of commands.`
        }

        setHistory(prev => [...prev, `> ${cmd}`, response])
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleCommand(input)
        setInput('')
    }

    return (
        <>
            {/* Floating Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 bg-zinc-900 text-primary rounded-full shadow-2xl border border-zinc-800 hover:scale-110 active:scale-95 transition-all group"
                >
                    <TerminalIcon size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none"
                    >
                        <div className="w-full max-w-3xl h-[500px] bg-zinc-950/95 border border-zinc-800 rounded-xl elevation-2xl flex flex-col pointer-events-auto backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-bottom border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <span className="text-xs text-zinc-500 font-mono ml-2 flex items-center gap-1">
                                        <Command size={12} /> dev-terminal — bash
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-500 hover:text-zinc-300"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Terminal Body */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-zinc-800"
                                onClick={() => inputRef.current?.focus()}
                            >
                                {history.map((line, i) => (
                                    <div key={i} className={line.startsWith('>') ? 'text-primary' : 'text-zinc-400 whitespace-pre-wrap'}>
                                        {line}
                                    </div>
                                ))}

                                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                                    <ChevronRight size={16} className="text-primary shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="bg-transparent border-none outline-none text-zinc-100 flex-1"
                                        autoFocus
                                        spellCheck={false}
                                        autoComplete="off"
                                    />
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
