import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
    </div>
  )
}
