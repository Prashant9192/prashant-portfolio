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
        // Add cache-busting timestamp to ensure fresh data
        const res = await fetch(`/api/content/all?t=${Date.now()}`, {
          cache: 'no-store'
        })
        
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

    // Listen for storage events to refresh content when updated from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contentUpdated') {
        fetchAllContent()
        localStorage.removeItem('contentUpdated')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also check for custom event for same-tab updates
    const handleContentUpdate = () => {
      fetchAllContent()
    }
    
    window.addEventListener('contentUpdated', handleContentUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contentUpdated', handleContentUpdate)
    }
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

