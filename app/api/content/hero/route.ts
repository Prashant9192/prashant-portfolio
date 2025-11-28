import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { HeroContent } from '@/lib/models'

export async function GET() {
  try {
    const db = await getDb()
    const hero = await db.collection<HeroContent>('hero').findOne({})
    
    if (!hero) {
      // Return default data if nothing exists in DB
      const defaultHero: HeroContent = {
        name: 'Prashant Basnet',
        roles: ['Full Stack Web Developer', 'UI/UX Enthusiast', 'React Specialist', 'Next.js Expert'],
        description: 'I build scalable, fast, and modern web applications. Currently, I work at Digitrix Agency.',
        avatar: '/MyAvatar.png',
        resumeUrl: '/Prashant-Resume.pdf'
      }
      return NextResponse.json(defaultHero)
    }

    // Remove MongoDB _id field and convert to plain object
    const { _id, ...heroData } = hero
    return NextResponse.json(heroData)
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return NextResponse.json(
      { error: 'Failed to read hero data' },
      { status: 500 }
    )
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
    
    const { _id, ...heroData } = result.value || body
    return NextResponse.json({ success: true, data: heroData })
  } catch (error) {
    console.error('Error updating hero data:', error)
    return NextResponse.json(
      { error: 'Failed to update hero data' },
      { status: 500 }
    )
  }
}
