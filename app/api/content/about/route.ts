import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { AboutContent } from '@/lib/models'

// Cache configuration - revalidate every 60 seconds
export const revalidate = 60

export async function GET() {
  try {
    const db = await getDb()
    if (!db) {
      // Return default data if database is unavailable
      const defaultAbout: AboutContent = {
        bio: "I'm a Full Stack web Developer with experience in building scalable, SEO-friendly and modern web applications.",
        avatar: '/MyAvatar.png',
        status: {
          available: true,
          company: 'Digitrix Agency'
        }
      }
      return NextResponse.json(defaultAbout, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    const about = await db.collection<AboutContent>('about').findOne({})
    
    if (!about) {
      const defaultAbout: AboutContent = {
        bio: "I'm a Full Stack web Developer with experience in building scalable, SEO-friendly and modern web applications.",
        avatar: '/MyAvatar.png',
        status: {
          available: true,
          company: 'Digitrix Agency'
        }
      }
      return NextResponse.json(defaultAbout, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    const { _id, ...aboutData } = about
    return NextResponse.json(aboutData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching about data:', error)
    // Return default data on error
    const defaultAbout: AboutContent = {
      bio: "I'm a Full Stack web Developer with experience in building scalable, SEO-friendly and modern web applications.",
      avatar: '/MyAvatar.png',
      status: {
        available: true,
        company: 'Digitrix Agency'
      }
    }
    return NextResponse.json(defaultAbout, {
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
    
    if (!body.bio || !body.status) {
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
    
    const result = await db.collection<AboutContent>('about').findOneAndUpdate(
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
    
    const updatedAbout = result || body
    const { _id, ...aboutData } = updatedAbout
    return NextResponse.json({ success: true, data: aboutData })
  } catch (error) {
    console.error('Error updating about data:', error)
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    )
  }
}

