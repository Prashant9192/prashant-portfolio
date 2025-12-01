'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  HeroContent,
  AboutContent,
  ExperienceItem,
  Project,
  Skill,
  ContactInfo
} from '@/lib/models'

interface AllContent {
  hero: HeroContent | null
  about: AboutContent | null
  experiences: ExperienceItem[]
  projects: Project[]
  skills: Skill[]
  contact: ContactInfo | null
  loading: boolean
  error: string | null
}

const ContentContext = createContext<AllContent>({
  hero: null,
  about: null,
  experiences: [],
  projects: [],
  skills: [],
  contact: null,
  loading: true,
  error: null
})

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AllContent>({
    hero: null,
    about: null,
    experiences: [],
    projects: [],
    skills: [],
    contact: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    async function fetchAllContent() {
      try {
        setContent(prev => ({ ...prev, loading: true, error: null }))
        
        // Fetch all content in one request
        // The API route has cache headers, so browser will cache the response
        const res = await fetch('/api/content/all')
        
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        
        const data = await res.json()
        
        setContent({
          hero: data.hero || null,
          about: data.about || null,
          experiences: data.experiences || [],
          projects: data.projects || [],
          skills: data.skills || [],
          contact: data.contact || null,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Failed to fetch all content:', error)
        setContent(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load content'
        }))
      }
    }

    fetchAllContent()
  }, [])

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}

