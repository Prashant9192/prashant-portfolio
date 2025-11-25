import { NextResponse } from 'next/server'

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

        // Get Google Script URL from environment variable
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL

        if (!GOOGLE_SCRIPT_URL) {
            console.error('GOOGLE_SHEETS_WEBAPP_URL is not defined')
            // For demo purposes, if no URL is set, we'll simulate success but log a warning
            // In production, this should probably fail or use a fallback
            return NextResponse.json(
                { message: 'Message received (Simulation Mode: Set GOOGLE_SHEETS_WEBAPP_URL to save to Sheets)' },
                { status: 200 }
            )
        }

        // Forward data to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message, timestamp: new Date().toISOString() }),
        })

        if (!response.ok) {
            throw new Error('Failed to submit to Google Sheets')
        }

        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 200 }
        )

    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
