import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { ExperienceContent, ExperienceItem } from '@/lib/models'

export async function GET() {
  try {
    const db = await getDb()
    const experience = await db.collection<ExperienceContent>('experience').findOne({})
    
    if (!experience || !experience.experiences || experience.experiences.length === 0) {
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
      return NextResponse.json({ experiences: defaultExperiences })
    }

    // Sort by order and remove _id
    const sortedExperiences = experience.experiences
      .sort((a, b) => a.order - b.order)
      .map(({ _id, ...exp }) => exp)
    
    return NextResponse.json({ experiences: sortedExperiences })
  } catch (error) {
    console.error('Error fetching experience data:', error)
    return NextResponse.json(
      { error: 'Failed to read experience data' },
      { status: 500 }
    )
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
    
    const sortedExperiences = (result.value?.experiences || experiencesWithOrder)
      .sort((a: ExperienceItem, b: ExperienceItem) => a.order - b.order)
      .map(({ _id, ...exp }: ExperienceItem) => exp)
    
    return NextResponse.json({ success: true, data: { experiences: sortedExperiences } })
  } catch (error) {
    console.error('Error updating experience data:', error)
    return NextResponse.json(
      { error: 'Failed to update experience data' },
      { status: 500 }
    )
  }
}

