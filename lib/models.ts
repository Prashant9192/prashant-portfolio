// Type definitions for all content models

export interface HeroContent {
  _id?: string
  name: string
  roles: string[]
  description: string
  avatar: string
  resumeUrl: string
  createdAt?: Date
  updatedAt?: Date
}

export interface AboutContent {
  _id?: string
  bio: string
  avatar: string
  status: {
    available: boolean
    company: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface ExperienceItem {
  _id?: string
  role: string
  company: string
  period: string
  logo: string
  logoBg: string
  order: number
}

export interface ExperienceContent {
  _id?: string
  experiences: ExperienceItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Project {
  _id?: string
  title: string
  description: string
  tags: string[]
  image: string
  liveUrl: string
  githubUrl: string
  order: number
}

export interface ProjectsContent {
  _id?: string
  projects: Project[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Skill {
  _id?: string
  name: string
  icon: string
  className?: string
  order: number
}

export interface SkillsContent {
  _id?: string
  skills: Skill[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ContactInfo {
  _id?: string
  email: string
  phone: string
  location: string
  createdAt?: Date
  updatedAt?: Date
}

export interface SiteMetadata {
  _id?: string
  // Basic SEO
  title: string
  description: string
  keywords?: string
  author?: string
  canonicalUrl?: string
  
  // Robots Meta
  robots?: string // e.g., "index, follow", "noindex, nofollow"
  
  // Open Graph
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string // e.g., "website", "profile"
  ogSiteName?: string
  
  // Twitter Card
  twitterCard?: string // e.g., "summary_large_image", "summary"
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterSite?: string // Twitter handle without @
  twitterCreator?: string // Twitter handle without @
  
  // Additional
  viewport?: string
  themeColor?: string
  language?: string
  favicon?: string
  
  createdAt?: Date
  updatedAt?: Date
}
