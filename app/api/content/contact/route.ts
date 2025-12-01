import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { ContactInfo } from '@/lib/models'

// Cache configuration - revalidate every 60 seconds
export const revalidate = 60

export async function GET() {
  const defaultContact: ContactInfo = {
    email: 'prashantbasnet222@gmail.com',
    phone: '+91 7030842261',
    location: 'Mumbai, India'
  }

  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json(defaultContact, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    const contact = await db.collection<ContactInfo>('contact').findOne({})
    
    if (!contact) {
      return NextResponse.json(defaultContact, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    const { _id, ...contactData } = contact
    return NextResponse.json(contactData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching contact data:', error)
    return NextResponse.json(defaultContact, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if (!body.email || !body.phone || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      )
    }

    const now = new Date()
    
    const result = await db.collection<ContactInfo>('contact').findOneAndUpdate(
      {},
      {
        $set: {
          ...body,
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    
    const updatedContact = result || body
    const { _id, ...contactData } = updatedContact
    return NextResponse.json({ success: true, data: contactData })
  } catch (error) {
    console.error('Error updating contact data:', error)
    return NextResponse.json(
      { error: 'Failed to update contact data' },
      { status: 500 }
    )
  }
}

