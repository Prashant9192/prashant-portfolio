import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'
import Contact from '@/components/Contact/Contact'
import { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const db = await getDb()
    if (db) {
      const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
      
      if (metadata?.canonicalUrl) {
        return {
          alternates: {
            canonical: metadata.canonicalUrl,
          },
        }
      }
    }
  } catch (error) {
    console.error('Error fetching canonical URL:', error)
  }
  
  return {}
}

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <About />
          <Experience />
        </div>
      </section>
      <Skills />
      <Projects />
      <Contact />
    </div>
  )
}
