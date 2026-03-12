import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { generateOTP, storeOTP } from '@/lib/otp'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'prashantbasnet664@gmail.com'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Verify it's the admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized email' },
        { status: 401 }
      )
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('EMAIL_USER or EMAIL_PASSWORD is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    storeOTP(email, otp)

    // Send OTP via email using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
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
    })

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
