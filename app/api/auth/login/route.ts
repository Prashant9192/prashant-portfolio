import { NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'

const ADMIN_EMAIL = 'prashantbasnet664@gmail.com'

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()
    
    // Verify it's the admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized email' },
        { status: 401 }
      )
    }
    
    // Verify OTP
    const isValid = verifyOTP(email, otp)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      )
    }
    
    // Return admin token
    const token = process.env.ADMIN_SECRET
    
    return NextResponse.json({ 
      success: true, 
      token 
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
