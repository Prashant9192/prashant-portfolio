
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Message } from '@/lib/models'

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

        // Basic Rate Limiting (Optional: check last message from this email in DB)
        // For now, we'll skip complex IP-based rate limiting to keep it simple and portable.

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

        // 2. Forward to Google Sheets (Backup/Notification)
        let sheetSaved = false
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL
        
        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message, timestamp: new Date().toISOString() }),
                })
                
                if (response.ok) {
                    sheetSaved = true
                } else {
                    console.warn('Google Sheets API returned error:', response.statusText)
                }
            } catch (sheetError) {
                console.error('Failed to send to Google Sheets:', sheetError)
            }
        } else {
            // If no Google Sheet URL, we treat DB success as sufficient
            // If DB failed too, then sheetSaved remains false
            if (dbSaved) sheetSaved = true; // effectively "success" if DB worked
        }

        // 3. Response Strategy
        if (dbSaved || sheetSaved) {
             return NextResponse.json(
                { message: 'Message sent successfully' },
                { status: 200 }
            )
        } else {
             // Both failed
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
