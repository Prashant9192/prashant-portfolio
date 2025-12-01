import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

export async function GET() {
  const defaultMetadata: SiteMetadata = {
    title: 'Prashant Basnet — Web Developer',
    description: 'Portfolio',
    robots: 'index, follow',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    language: 'en'
  }

  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json(defaultMetadata)
    }

    const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
    
    if (!metadata) {
      return NextResponse.json(defaultMetadata)
    }

    const { _id, ...metadataData } = metadata
    return NextResponse.json(metadataData)
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json(defaultMetadata)
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
    
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required fields' },
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
    
    // Extract only the fields we want to update (exclude _id, createdAt, updatedAt from body)
    const { _id: bodyId, createdAt, updatedAt: bodyUpdatedAt, ...updateData } = body
    
    const result = await db.collection<SiteMetadata>('metadata').findOneAndUpdate(
      {},
      {
        $set: {
          ...updateData,
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
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update metadata' },
        { status: 500 }
      )
    }
    
    const { _id, ...metadataData } = result
    return NextResponse.json({ success: true, data: metadataData })
  } catch (error) {
    console.error('Error updating metadata:', error)
    return NextResponse.json(
      { error: 'Failed to update metadata' },
      { status: 500 }
    )
  }
}

