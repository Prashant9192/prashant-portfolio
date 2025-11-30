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
        if (typeof window !== 'undefined' && localStorage.getItem('adminToken')) {
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
                if (typeof window !== 'undefined') {
                    localStorage.setItem('adminToken', data.token)
                }
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
                <div className="relative bg-card border-2 border-border rounded-3xl p-8 shadow-2xl overflow-hidden">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                                <Mail className="text-primary" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Admin Login
                                </h1>
                                <p className="text-xs text-muted-foreground">Secure Access Portal</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-8 text-lg">
                            {step === 'email'
                                ? 'Enter your email to receive a verification code'
                                : 'Enter the 6-digit code sent to your email'}
                        </p>

                    {step === 'email' ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-3">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-background border-2 border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium"
                                    placeholder="your@email.com"
                                    required
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1">
                                    <span>🔒</span> Admin email is pre-configured
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold hover:from-primary/90 hover:to-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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
                                <label htmlFor="otp" className="block text-sm font-semibold text-foreground mb-3">
                                    6-Digit Verification Code
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-5 py-4 rounded-xl bg-background border-2 border-input text-foreground placeholder-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all text-center text-3xl tracking-[0.5em] font-bold"
                                    placeholder="••••••"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground mt-3 text-center">⏱️ Code expires in 10 minutes</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold hover:from-primary/90 hover:to-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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
                                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors font-medium py-2 hover:underline"
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

