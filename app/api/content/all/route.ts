import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import {
  HeroContent,
  AboutContent,
  ExperienceContent,
  ProjectsContent,
  SkillsContent,
  ContactInfo,
  SiteMetadata,
  ExperienceItem,
  Project,
  Skill
} from '@/lib/models'

// Cache configuration - revalidate every 60 seconds
export const revalidate = 60

// Default data fallbacks
const defaultHero: HeroContent = {
  name: 'Prashant Basnet',
  roles: ['Full Stack Web Developer', 'UI/UX Enthusiast', 'React Specialist', 'Next.js Expert'],
  description: 'I build scalable, fast, and modern web applications. Currently, I work at Digitrix Agency.',
  avatar: '/MyAvatar.png',
  resumeUrl: '/Prashant-Resume.pdf'
}

const defaultAbout: AboutContent = {
  bio: "I'm a Full Stack web Developer with experience in building scalable, SEO-friendly and modern web applications.",
  avatar: '/MyAvatar.png',
  status: {
    available: true,
    company: 'Digitrix Agency'
  }
}

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

const defaultSkills: Skill[] = [
  {
    name: 'Next.js',
    icon: 'https://api.iconify.design/logos:nextjs-icon.svg',
    className: 'dark:invert',
    order: 0
  },
  {
    name: 'React',
    icon: 'https://api.iconify.design/logos:react.svg',
    order: 1
  },
  {
    name: 'JavaScript',
    icon: 'https://api.iconify.design/logos:javascript.svg',
    order: 2
  },
  {
    name: 'TypeScript',
    icon: 'https://api.iconify.design/logos:typescript-icon.svg',
    order: 3
  },
  {
    name: 'Node.js',
    icon: 'https://api.iconify.design/logos:nodejs-icon.svg',
    order: 4
  },
  {
    name: 'Tailwind CSS',
    icon: 'https://api.iconify.design/logos:tailwindcss-icon.svg',
    order: 5
  },
  {
    name: 'PHP',
    icon: 'https://api.iconify.design/logos:php.svg',
    order: 6
  },
  {
    name: 'MongoDB',
    icon: 'https://api.iconify.design/logos:mongodb-icon.svg',
    order: 7
  }
]

const defaultContact: ContactInfo = {
  email: 'prashantbasnet222@gmail.com',
  phone: '+91 7030842261',
  location: 'Mumbai, India'
}

export async function GET() {
  try {
    const db = await getDb()
    
    if (!db) {
      // Return all default data if database is unavailable
      return NextResponse.json({
        hero: defaultHero,
        about: defaultAbout,
        experiences: defaultExperiences,
        projects: defaultProjects,
        skills: defaultSkills,
        contact: defaultContact
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      })
    }

    // Fetch all collections in parallel with projection for better performance
    // Projection reduces data transfer by excluding _id fields
    const [
      heroResult,
      aboutResult,
      experienceResult,
      projectsResult,
      skillsResult,
      contactResult
    ] = await Promise.all([
      db.collection<HeroContent>('hero').findOne({}, { projection: { _id: 0 } }).catch(() => null),
      db.collection<AboutContent>('about').findOne({}, { projection: { _id: 0 } }).catch(() => null),
      db.collection<ExperienceContent>('experience').findOne({}, { projection: { _id: 0 } }).catch(() => null),
      db.collection<ProjectsContent>('projects').findOne({}, { projection: { _id: 0 } }).catch(() => null),
      db.collection<SkillsContent>('skills').findOne({}, { projection: { _id: 0 } }).catch(() => null),
      db.collection<ContactInfo>('contact').findOne({}, { projection: { _id: 0 } }).catch(() => null)
    ])

    // Process hero data (no need to remove _id, projection handles it)
    let hero = defaultHero
    if (heroResult) {
      hero = heroResult
    }

    // Process about data
    let about = defaultAbout
    if (aboutResult) {
      about = aboutResult
    }

    // Process experience data
    let experiences = defaultExperiences
    if (experienceResult?.experiences && experienceResult.experiences.length > 0) {
      experiences = experienceResult.experiences.sort((a, b) => a.order - b.order)
    }

    // Process projects data
    let projects = defaultProjects
    if (projectsResult?.projects && projectsResult.projects.length > 0) {
      projects = projectsResult.projects.sort((a, b) => a.order - b.order)
    }

    // Process skills data
    let skills = defaultSkills
    if (skillsResult?.skills && skillsResult.skills.length > 0) {
      skills = skillsResult.skills
        .sort((a, b) => a.order - b.order)
        .map((skill) => {
          // Fix local paths that don't exist - convert to CDN URLs
          if (skill.icon && skill.icon.startsWith('/skills/')) {
            // Map local paths to CDN URLs
            const iconMap: Record<string, string> = {
              '/skills/nextjs.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
              '/skills/react.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
              '/skills/javascript.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
              '/skills/typescript.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
              '/skills/nodejs.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
              '/skills/tailwind.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
              '/skills/git.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
              '/skills/mongodb.svg': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
            }
            skill.icon = iconMap[skill.icon] || skill.icon
          }
          return skill
        })
    }

    // Process contact data
    let contact = defaultContact
    if (contactResult) {
      contact = contactResult
    }

    return NextResponse.json({
      hero,
      about,
      experiences,
      projects,
      skills,
      contact
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching all content:', error)
    // Return default data on error
    return NextResponse.json({
      hero: defaultHero,
      about: defaultAbout,
      experiences: defaultExperiences,
      projects: defaultProjects,
      skills: defaultSkills,
      contact: defaultContact
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      },
      status: 200 // Return 200 even on error to show default content
    })
  }
}

