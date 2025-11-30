import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { ProjectsContent, Project } from '@/lib/models'

export async function GET() {
  try {
    const db = await getDb()
    const projects = await db.collection<ProjectsContent>('projects').findOne({})
    
    if (!projects || !projects.projects || projects.projects.length === 0) {
      const defaultProjects: Project[] = [
        {
          title: 'Create Receipts',
          description: 'SaaS web app for personal bookkeeping and receipt management. Streamlines financial tracking with intuitive tools.',
          tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
          image: '/projects/receipts.png',
          liveUrl: '#',
          githubUrl: '#',
          order: 0
        },
        {
          title: 'AI Homework',
          description: 'Subscription based AI homework helper platform developed with Next.js. Helps students solve complex problems instantly.',
          tags: ['Next.js', 'OpenAI API', 'Stripe', 'TypeScript'],
          image: '/projects/homework.png',
          liveUrl: '#',
          githubUrl: '#',
          order: 1
        },
        {
          title: 'Portfolio Websites',
          description: 'Modern portfolio websites developed using Vite, Tailwind CSS and Framer Motion. Showcasing creative developer identities.',
          tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
          image: '/projects/portfolio.png',
          liveUrl: '#',
          githubUrl: '#',
          order: 2
        }
      ]
      return NextResponse.json({ projects: defaultProjects })
    }

    const sortedProjects = projects.projects
      .sort((a, b) => a.order - b.order)
      .map(({ _id, ...project }) => project)
    
    return NextResponse.json({ projects: sortedProjects })
  } catch (error) {
    console.error('Error fetching projects data:', error)
    return NextResponse.json(
      { error: 'Failed to read projects data' },
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
    
    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: 'Missing or invalid projects array' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const now = new Date()
    
    const projectsWithOrder = body.projects.map((project: Project, index: number) => ({
      ...project,
      order: project.order ?? index
    }))
    
    const result = await db.collection<ProjectsContent>('projects').findOneAndUpdate(
      {},
      {
        $set: {
          projects: projectsWithOrder,
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
    
    const projectsToSort = result?.projects || projectsWithOrder
    const sortedProjects = projectsToSort
      .sort((a: Project, b: Project) => a.order - b.order)
      .map((project: Project & { _id?: unknown }) => {
        const { _id, ...rest } = project
        return rest
      })
    
    return NextResponse.json({ success: true, data: { projects: sortedProjects } })
  } catch (error) {
    console.error('Error updating projects data:', error)
    return NextResponse.json(
      { error: 'Failed to update projects data' },
      { status: 500 }
    )
  }
}

