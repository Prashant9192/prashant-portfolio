import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { SkillsContent, Skill } from '@/lib/models'

export async function GET() {
  const defaultSkills: Skill[] = [
    {
      name: 'Next.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      className: 'dark:invert',
      order: 0
    },
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      order: 1
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      order: 2
    },
    {
      name: 'TypeScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      order: 3
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      order: 4
    },
    {
      name: 'Tailwind',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
      order: 5
    },
    {
      name: 'PHP',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      order: 6
    },
    {
      name: 'MongoDB',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      order: 7
    }
  ]

  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ skills: defaultSkills })
    }

    const skills = await db.collection<SkillsContent>('skills').findOne({})
    
    if (!skills || !skills.skills || skills.skills.length === 0) {
      return NextResponse.json({ skills: defaultSkills })
    }

    const sortedSkills = skills.skills
      .sort((a, b) => a.order - b.order)
      .map(({ _id, ...skill }) => skill)
    
    return NextResponse.json({ skills: sortedSkills })
  } catch (error) {
    console.error('Error fetching skills data:', error)
    return NextResponse.json({ skills: defaultSkills })
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
    
    if (!body.skills || !Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: 'Missing or invalid skills array' },
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
    
    const skillsWithOrder = body.skills.map((skill: Skill, index: number) => ({
      ...skill,
      order: skill.order ?? index
    }))
    
    const result = await db.collection<SkillsContent>('skills').findOneAndUpdate(
      {},
      {
        $set: {
          skills: skillsWithOrder,
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
    
    const skillsToSort = result?.skills || skillsWithOrder
    const sortedSkills = skillsToSort
      .sort((a: Skill, b: Skill) => a.order - b.order)
      .map((skill: Skill & { _id?: unknown }) => {
        const { _id, ...rest } = skill
        return rest
      })
    
    return NextResponse.json({ success: true, data: { skills: sortedSkills } })
  } catch (error) {
    console.error('Error updating skills data:', error)
    return NextResponse.json(
      { error: 'Failed to update skills data' },
      { status: 500 }
    )
  }
}

