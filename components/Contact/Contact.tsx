'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error('Failed to send message')

            setStatus('success')
            setFormData({ name: '', email: '', message: '' })

            // Reset success message after 3 seconds
            setTimeout(() => setStatus('idle'), 3000)
        } catch (error) {
            console.error('Error:', error)
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section id="contact" className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center md:text-left"
                >
                    <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Get in <span className="text-primary">Touch</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                        Have a project in mind or just want to say hi? I'm always open to discussing new ideas and opportunities.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="h-full"
                    >
                        <div className="h-full p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors space-y-8">

                            <div className="relative flex items-start gap-6 group/item">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300 shadow-inner">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">Email</h3>
                                    <p className="text-muted-foreground group-hover/item:text-primary transition-colors">hello@prashant.dev</p>
                                </div>
                            </div>

                            <div className="relative flex items-start gap-6 group/item">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300 shadow-inner">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">Phone</h3>
                                    <p className="text-muted-foreground group-hover/item:text-primary transition-colors">+977 9800000000</p>
                                </div>
                            </div>

                            <div className="relative flex items-start gap-6 group/item">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300 shadow-inner">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">Location</h3>
                                    <p className="text-muted-foreground group-hover/item:text-primary transition-colors">Kathmandu, Nepal</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors space-y-6">

                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium ml-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary/50 outline-none transition-all duration-300 placeholder:text-white/20"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary/50 outline-none transition-all duration-300 placeholder:text-white/20"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium ml-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary/50 outline-none transition-all duration-300 resize-none placeholder:text-white/20"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : status === 'success' ? (
                                    'Message Sent!'
                                ) : status === 'error' ? (
                                    'Failed to Send'
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
