
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Message } from '@/lib/models'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message } = body

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

        // 2. Email Notification (Nodemailer) - TEMPORARILY DISABLED
        let emailSent = false
        // Only attempt if SMTP config is present
        /*
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                })

                await transporter.sendMail({
                    from: process.env.SMTP_FROM || process.env.SMTP_USER, // "Sender Name <email>"
                    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Send to yourself
                    replyTo: email, // Allow direct reply to sender
                    subject: `New Portfolio Message from ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">New Message Received</h2>
                            <p>You have a new inquiry from your portfolio website.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Message:</strong></p>
                            <blockquote style="background: #f4f4f5; padding: 15px; border-radius: 8px; border-left: 4px solid #000;">
                                ${message.replace(/\n/g, '<br>')}
                            </blockquote>
                            <br />
                            <p style="font-size: 12px; color: #666;">This email was sent automatically from your portfolio.</p>
                        </div>
                    `,
                })
                emailSent = true
            } catch (emailError) {
                console.error('Failed to send email:', emailError)
            }
        }
        */

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
