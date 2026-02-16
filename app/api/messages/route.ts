
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { ObjectId } from 'mongodb'

// GET /api/messages - Fetch all messages
export async function GET() {
    try {
        const db = await getDb()
        if (!db) {
            return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
        }

        const rawMessages = await db.collection('messages')
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        const messages = rawMessages.map(msg => ({
            ...msg,
            _id: msg._id.toString()
        }))

        return NextResponse.json({ messages }, { status: 200 })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/messages?id=... - Delete a message
export async function DELETE(request: Request) {
    try {
        // Auth Check
        const authHeader = request.headers.get('authorization')
        // In local dev, we might be lenient, but let's stick to the pattern
        // If ADMIN_SECRET is not set, we might have issues, but assuming it is set as per other routes
        // Fallback to checking if token exists at all for basic protection if env var missing
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        if (token !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        const db = await getDb()
        if (!db) {
            return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
        }
        
        await db.collection('messages').deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Error deleting message:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
