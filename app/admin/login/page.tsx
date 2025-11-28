'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const ADMIN_EMAIL = 'prashantbasnet664@gmail.com'

export default function AdminLogin() {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState(ADMIN_EMAIL)
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if already logged in
        if (localStorage.getItem('adminToken')) {
            router.push('/admin')
        }
    }, [router])

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('OTP sent to your email!')
                setStep('otp')
            } else {
                toast.error(data.error || 'Failed to send OTP')
            }
        } catch (err) {
            toast.error('Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('adminToken', data.token)
                toast.success('Login successful!')
                router.push('/admin')
            } else {
                toast.error(data.error || 'Invalid OTP')
            }
        } catch (err) {
            toast.error('Verification failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Mail size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
                    </div>
                    <p className="text-muted-foreground mb-8">
                        {step === 'email'
                            ? 'Enter your email to receive OTP'
                            : 'Enter the 6-digit code sent to your email'}
                    </p>

                    {step === 'email' ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="your@email.com"
                                    required
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground mt-2">Admin email is pre-configured</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                                    6-Digit OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all text-center text-2xl tracking-widest font-bold"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground mt-2">Code expires in 10 minutes</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Login'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep('email')
                                    setOtp('')
                                }}
                                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

