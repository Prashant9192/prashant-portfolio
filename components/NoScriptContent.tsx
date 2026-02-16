
import { ServerContent } from '@/lib/getServerContent'
import Image from 'next/image'

export default function NoScriptContent({ serverContent }: { serverContent: ServerContent }) {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
            noscript {
              display: block !important;
              position: relative !important;
              z-index: 9999 !important;
            }
            .js-only {
              display: none !important;
            }
            /* Ensure noscript content is visible */
            body:not(.js-enabled) noscript {
              display: block !important;
            }
          `
            }} />
            <div style={{ display: 'block', minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)' }} className="space-y-0 min-h-screen bg-background text-foreground">
                {/* Header */}
                <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                    <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <h1 className="text-xl font-bold">{serverContent.hero.name}</h1>
                        <div className="flex gap-4">
                            <a href="#home" className="text-sm hover:text-primary transition-colors">Home</a>
                            <a href="#about" className="text-sm hover:text-primary transition-colors">About</a>
                            <a href="#experience" className="text-sm hover:text-primary transition-colors">Experience</a>
                            <a href="#skills" className="text-sm hover:text-primary transition-colors">Skills</a>
                            <a href="#projects" className="text-sm hover:text-primary transition-colors">Projects</a>
                            <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section id="home" className="container mx-auto px-4 py-20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold">
                                Hi, I'm <br />
                                <span>{serverContent.hero.name}</span>
                            </h1>
                            <div className="text-2xl md:text-3xl font-semibold text-primary">
                                {serverContent.hero.roles[0]}
                            </div>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                {serverContent.hero.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#projects" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                    View Projects
                                </a>
                                {serverContent.hero.resumeUrl && (
                                    <a href={serverContent.hero.resumeUrl} download className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors border border-border">
                                        Download Resume
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="relative flex justify-center md:justify-end">
                            <Image
                                src={serverContent.hero.avatar}
                                alt={`${serverContent.hero.name} Avatar`}
                                width={600}
                                height={600}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </section>

                {/* About & Experience Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* About */}
                        <section id="about" className="h-full">
                            <div className="relative h-full p-6 md:p-8 rounded-3xl bg-card border border-border shadow-md">
                                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-medium text-green-500">Available</span>
                                </div>
                                <div className="space-y-6 md:space-y-8">
                                    <h2 className="text-2xl md:text-4xl font-bold text-foreground">About Me</h2>
                                    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-full overflow-hidden border-2 border-border shadow-2xl mx-auto sm:mx-0">
                                            <Image
                                                src={serverContent.about.avatar}
                                                alt="Portfolio Avatar"
                                                width={128}
                                                height={128}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="space-y-4 md:space-y-6 text-center sm:text-left">
                                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                                {serverContent.about.bio}
                                            </p>
                                        </div>
                                    </div>
                                    {serverContent.about.status && (
                                        <div className="mt-6 md:mt-8 flex items-start gap-4 text-sm text-primary/80 p-5 rounded-2xl bg-secondary/50 border border-border shadow-inner">
                                            <span className="text-xl mt-0.5">🚀</span>
                                            <span className="leading-relaxed">
                                                Currently creating modern web solutions at <span className="font-semibold text-primary">{serverContent.about.status.company}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Experience */}
                        <section id="experience" className="h-full">
                            <div className="relative h-full p-6 md:p-8 rounded-3xl bg-card border border-border shadow-md flex flex-col">
                                <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-foreground">
                                    Experience
                                </h2>
                                {serverContent.experiences.length > 0 ? (
                                    <div className="space-y-4 md:space-y-6">
                                        {serverContent.experiences.map((exp, index) => (
                                            <article key={`noscript-exp-${exp.role}-${exp.company}-${index}`} className="relative">
                                                <div className="flex items-start gap-4 p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
                                                    <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg ${exp.logoBg} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md`}>
                                                        {exp.logo}
                                                    </div>
                                                    <div className="flex-1 min-w-0 pt-0.5">
                                                        <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                                                            {exp.role}
                                                        </h3>
                                                        <p className="text-sm md:text-base text-muted-foreground font-medium mb-1.5">
                                                            {exp.company}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <time dateTime={exp.period}>{exp.period}</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No experience data available.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Skills & <span className="text-primary">Technologies</span>
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                                Technologies and tools I use to bring ideas to life
                            </p>
                        </div>
                        {serverContent.skills.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                                {serverContent.skills.map((skill, index) => (
                                    <div key={`noscript-skill-${skill.name}-${index}`} className="rounded-xl border border-border bg-card flex flex-col items-center justify-center p-4 md:p-6 gap-3 min-h-[140px] md:min-h-[160px] shadow-sm hover:shadow-md transition-shadow">
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                                            {skill.icon ? (
                                                <img
                                                    src={skill.icon}
                                                    alt={skill.name}
                                                    className={`w-full h-full object-contain ${skill.className || ''}`}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center rounded-lg bg-primary/10">
                                                    <span className="text-2xl md:text-3xl font-bold text-primary">
                                                        {skill.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center w-full">
                                            <h3 className="text-sm md:text-base font-semibold text-foreground">
                                                {skill.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-20">No skills available.</p>
                        )}
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">
                            Featured <span className="text-primary">Projects</span>
                        </h2>
                        {serverContent.projects.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {serverContent.projects.map((project, index) => (
                                    <article key={`noscript-project-${project.title}-${index}`} className="rounded-2xl border border-border bg-card overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                            {project.image ? (
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                                    <span className="text-muted-foreground font-medium">Project Preview</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                                {project.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                {project.githubUrl !== '#' && (
                                                    <a href={project.githubUrl} className="p-2 rounded-full bg-secondary border border-border hover:bg-secondary/80 transition-colors" title="View Code">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {project.liveUrl !== '#' && (
                                                    <a href={project.liveUrl} className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors" title="Live Demo">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No projects available.</p>
                        )}
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
                                Get in <span className="text-primary">Touch</span>
                            </h2>
                            <p className="text-muted-foreground text-base lg:text-lg text-center mb-12">
                                Have a project in mind? Let's discuss how we can work together.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                {serverContent.contact.email && (
                                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border text-center">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Email</p>
                                            <a href={`mailto:${serverContent.contact.email}`} className="text-sm text-muted-foreground break-all hover:text-primary transition-colors">
                                                {serverContent.contact.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {serverContent.contact.phone && (
                                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border text-center">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Phone</p>
                                            <p className="text-sm text-muted-foreground">{serverContent.contact.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {serverContent.contact.location && (
                                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border text-center">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Location</p>
                                            <p className="text-sm text-muted-foreground">{serverContent.contact.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} {serverContent.hero.name}. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    )
}
