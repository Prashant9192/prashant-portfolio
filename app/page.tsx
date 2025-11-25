import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'

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
    </div>
  )
}
