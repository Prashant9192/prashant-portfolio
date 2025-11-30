import nodemailer from 'nodemailer'

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>()

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOTP(email: string, otp: string) {
  const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
  otpStore.set(email, { otp, expires })
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email)
  
  if (!stored) return false
  if (Date.now() > stored.expires) {
    otpStore.delete(email)
    return false
  }
  
  if (stored.otp === otp) {
    otpStore.delete(email)
    return true
  }
  
  return false
}

export async function sendOTPEmail(email: string, otp: string) {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.')
  }

  // Create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Admin Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">Portfolio CMS Login</h2>
        <p>Your OTP code is:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1f2937; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #6b7280;">This code will expire in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
