import { NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'prashantbasnet664@gmail.com'

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
    
    if (!token) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Set HTTP-only cookie for middleware protection
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    
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
