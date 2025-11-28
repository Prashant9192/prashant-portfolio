import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = 'https://yourdomain.com' // Default fallback
  
  try {
    const db = await getDb()
    const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
    
    if (metadata?.canonicalUrl) {
      baseUrl = metadata.canonicalUrl
    }
  } catch (error) {
    console.error('Error fetching canonical URL for sitemap:', error)
  }

  // Get last modified date from metadata
  let lastModified = new Date()
  
  try {
    const db = await getDb()
    const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
    
    if (metadata?.updatedAt) {
      lastModified = new Date(metadata.updatedAt)
    }
  } catch (error) {
    console.error('Error fetching last modified date:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

