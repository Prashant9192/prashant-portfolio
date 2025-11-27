import { NextResponse } from 'next/server'
import { generateOTP, storeOTP, sendOTPEmail } from '@/lib/otp'

const ADMIN_EMAIL = 'prashantbasnet664@gmail.com'

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
    
    // Generate and store OTP
    const otp = generateOTP()
    storeOTP(email, otp)
    
    // Send OTP via email
    await sendOTPEmail(email, otp)
    
    return NextResponse.json({ 
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
