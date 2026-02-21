
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Message } from '@/lib/models'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message, website } = body

        // Honeypot check: If the 'website' field is filled, it's a bot.
        // We return 200 (Success) to fool the bot into thinking it worked,
        // but we don't actually save or process anything.
        if (website) {
            console.log('[Contact API] Bot detected and rejected via honeypot.')
            return NextResponse.json(
                { message: 'Message sent successfully' },
                { status: 200 }
            )
        }

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 1. Save to MongoDB
        let dbSaved = false
        try {
            const db = await getDb()
            if (db) {
                const newMessage = {
                    name,
                    email,
                    message,
                    read: false,
                    createdAt: new Date()
                }
                const result = await db.collection('messages').insertOne(newMessage)
                if (result.acknowledged) {
                    dbSaved = true
                }
            } else {
                console.error('Database connection unavailable')
            }
        } catch (dbError) {
            console.error('Failed to save to database:', dbError)
        }

        // 2. Email Notification (Nodemailer)
        let emailSent = false
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                })

                await transporter.sendMail({
                    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_USER, // Send to yourself
                    replyTo: email,
                    subject: `New Inquiry from ${name} via Portfolio`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                            <div style="background: #3B82F6; padding: 20px; color: white;">
                                <h1 style="margin: 0; font-size: 20px;">New Message Received</h1>
                            </div>
                            <div style="padding: 24px; background: white;">
                                <p style="margin-top: 0; color: #64748b;">You have a new inquiry from your portfolio website.</p>
                                <div style="display: grid; gap: 12px; margin: 24px 0;">
                                    <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">From</p>
                                        <p style="margin: 4px 0 0; color: #0f172a; font-weight: 600;">${name}</p>
                                    </div>
                                    <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Email</p>
                                        <p style="margin: 4px 0 0; color: #3B82F6; font-weight: 600;">${email}</p>
                                    </div>
                                </div>
                                <div style="padding: 12px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #3B82F6;">
                                    <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Message</p>
                                    <p style="margin: 8px 0 0; color: #334155; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                                </div>
                                <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
                                    <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">Reply to ${name}</a>
                                </div>
                            </div>
                        </div>
                    `,
                })
                emailSent = true
            } catch (emailError) {
                console.error('Failed to send email:', emailError)
            }
        }

        // 3. Forward to Google Sheets (Backup)
        let sheetSaved = false
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL
        
        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message, timestamp: new Date().toISOString() }),
                })
                
                if (response.ok) {
                    sheetSaved = true
                }
            } catch (sheetError) {
                console.error('Failed to send to Google Sheets:', sheetError)
            }
        }

        // Response Strategy: Check if at least one storage method worked
        // If no SMTP configured, we rely on DB. If DB failed, we fail.
        if (dbSaved || emailSent || sheetSaved) {
             return NextResponse.json(
                { message: 'Message sent successfully' },
                { status: 200 }
            )
        } else {
             return NextResponse.json(
                { error: 'Failed to send message. Please try again later.' },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
