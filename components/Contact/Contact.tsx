'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Mail, MapPin, Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import MagneticButton from '@/components/ui/MagneticButton'
import { ContactInfo } from '@/lib/models'

export default function Contact() {
    const [isFlipped, setIsFlipped] = useState(false)
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    useEffect(() => {
        async function fetchContactInfo() {
            try {
                const res = await fetch('/api/content/contact')
                if (res.ok) {
                    const data = await res.json()
                    setContactInfo(data)
                }
            } catch (error) {
                console.error('Failed to fetch contact info:', error)
            }
        }
        fetchContactInfo()
    }, [])

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
            toast.success('Message sent successfully!')
            setFormData({ name: '', email: '', message: '' })

            // Reset success message after 3 seconds
            setTimeout(() => {
                setStatus('idle')
                setIsFlipped(false) // Flip back after success
            }, 3000)
        } catch (error) {
            console.error('Error:', error)
            setStatus('error')
            toast.error('Failed to send message. Please try again.')
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
        <section id="contact" className="py-20 relative overflow-hidden min-h-[800px] flex items-center justify-center">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 [perspective:1000px]">
                <motion.div
                    className="relative w-full max-w-md lg:max-w-4xl mx-auto grid"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* FRONT FACE - Contact Info */}
                    <div
                        className="col-start-1 row-start-1 w-full h-full backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="h-full py-6 px-4 md:py-8 md:px-8 lg:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col lg:flex-row lg:items-center lg:gap-12 justify-between shadow-2xl">
                            <div className="text-center lg:text-left space-y-4 lg:flex-1">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                    Get in <span className="text-primary">Touch</span>
                                </h2>
                                <p className="text-muted-foreground text-base lg:text-lg">
                                    Have a project in mind? Let's discuss how we can work together.
                                </p>
                                <div className="hidden lg:block pt-8">
                                    <MagneticButton>
                                        <button
                                            onClick={() => setIsFlipped(true)}
                                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                                        >
                                            Write a Message
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </MagneticButton>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6 my-6 md:my-8 lg:my-0 lg:flex-1">
                                {contactInfo?.email && (
                                    <div
                                        onClick={() => window.location.href = `mailto:${contactInfo.email}`}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item"
                                    >
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover/item:bg-primary/20 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-lg">Email</p>
                                            <p className="text-sm text-muted-foreground break-all">{contactInfo.email}</p>
                                        </div>
                                    </div>
                                )}

                                {contactInfo?.phone && (
                                    <div
                                        onClick={() => {
                                            navigator.clipboard.writeText(contactInfo.phone);
                                            toast.success('Phone number copied to clipboard!');
                                        }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item"
                                    >
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover/item:bg-primary/20 transition-colors">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Phone</p>
                                            <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {contactInfo?.location && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Location</p>
                                            <p className="text-sm text-muted-foreground">{contactInfo.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsFlipped(true)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-lg flex lg:hidden items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group mt-auto"
                            >
                                Write a Message
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* BACK FACE - Contact Form */}
                    <div
                        className="col-start-1 row-start-1 w-full h-full backface-hidden"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="h-full py-6 px-4 md:py-8 md:px-8 lg:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col shadow-2xl">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h2 className="text-2xl lg:text-3xl font-bold">Send Message</h2>
                                <button
                                    onClick={() => setIsFlipped(false)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3 md:gap-4 lg:gap-6">
                                <div className="grid lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium ml-1">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary/50 outline-none transition-all duration-300 placeholder:text-white/20"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="space-y-1.5 md:space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary/50 outline-none transition-all duration-300 placeholder:text-white/20"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:space-y-2 flex-1">
                                    <label htmlFor="message" className="text-sm font-medium ml-1">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full h-full min-h-[120px] lg:min-h-[160px] px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary/50 outline-none transition-all duration-300 resize-none placeholder:text-white/20"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3.5 md:py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4 md:mt-6"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
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
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
