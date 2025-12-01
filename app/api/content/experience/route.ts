import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { ExperienceContent, ExperienceItem } from '@/lib/models'

// Cache configuration - revalidate every 60 seconds
export const revalidate = 60

export async function GET() {
  const defaultExperiences: ExperienceItem[] = [
    {
      role: 'Web Developer',
      company: 'Digitrix Agency',
      period: 'Aug 2024 - Present',
      logo: 'm',
      logoBg: 'bg-blue-600',
      order: 0
    },
    {
      role: 'Sr. PHP Developer',
      company: 'Benum.oDesign',
      period: 'Apr 2024 - Jun 2024',
      logo: '☼',
      logoBg: 'bg-blue-500',
      order: 1
    }
  ]

  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ experiences: defaultExperiences }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    const experience = await db.collection<ExperienceContent>('experience').findOne({})
    
    if (!experience || !experience.experiences || experience.experiences.length === 0) {
      return NextResponse.json({ experiences: defaultExperiences }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    // Sort by order and remove _id
    const sortedExperiences = experience.experiences
      .sort((a, b) => a.order - b.order)
      .map(({ _id, ...exp }) => exp)
    
    return NextResponse.json({ experiences: sortedExperiences }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching experience data:', error)
    return NextResponse.json({ experiences: defaultExperiences }, {
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
    
    if (!body.experiences || !Array.isArray(body.experiences)) {
      return NextResponse.json(
        { error: 'Missing or invalid experiences array' },
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
    
    // Add order to each experience if not present
    const experiencesWithOrder = body.experiences.map((exp: ExperienceItem, index: number) => ({
      ...exp,
      order: exp.order ?? index
    }))
    
    const result = await db.collection<ExperienceContent>('experience').findOneAndUpdate(
      {},
      {
        $set: {
          experiences: experiencesWithOrder,
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
    
    const experiencesToSort = result?.experiences || experiencesWithOrder
    const sortedExperiences = experiencesToSort
      .sort((a: ExperienceItem, b: ExperienceItem) => a.order - b.order)
      .map((exp: ExperienceItem & { _id?: unknown }) => {
        const { _id, ...rest } = exp
        return rest
      })
    
    return NextResponse.json({ success: true, data: { experiences: sortedExperiences } })
  } catch (error) {
    console.error('Error updating experience data:', error)
    return NextResponse.json(
      { error: 'Failed to update experience data' },
      { status: 500 }
    )
  }
}

