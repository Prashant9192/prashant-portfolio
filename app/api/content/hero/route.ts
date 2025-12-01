import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { HeroContent } from '@/lib/models'

// Cache configuration - revalidate every 60 seconds
export const revalidate = 60

export async function GET() {
  const defaultHero: HeroContent = {
    name: 'Prashant Basnet',
    roles: ['Full Stack Web Developer', 'UI/UX Enthusiast', 'React Specialist', 'Next.js Expert'],
    description: 'I build scalable, fast, and modern web applications. Currently, I work at Digitrix Agency.',
    avatar: '/MyAvatar.png',
    resumeUrl: '/Prashant-Resume.pdf'
  }

  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json(defaultHero)
    }

    const hero = await db.collection<HeroContent>('hero').findOne({})
    
    if (!hero) {
      return NextResponse.json(defaultHero)
    }

    const { _id, ...heroData } = hero
    return NextResponse.json(heroData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return NextResponse.json(defaultHero, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  }
}

export async function POST(request: Request) {
  try {
    // Check for admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.roles || !body.description) {
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
    
    // Update or insert hero content
    const result = await db.collection<HeroContent>('hero').findOneAndUpdate(
      {}, // Find any existing document
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
    
    const updatedHero = result || body
    const { _id, ...heroData } = updatedHero
    return NextResponse.json({ success: true, data: heroData })
  } catch (error) {
    console.error('Error updating hero data:', error)
    return NextResponse.json(
      { error: 'Failed to update hero data' },
      { status: 500 }
    )
  }
}
