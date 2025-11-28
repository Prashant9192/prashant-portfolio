import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = 'https://yourdomain.com' // Default fallback
  let lastModified = new Date()
  
  try {
    const db = await getDb()
    const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
    
    if (metadata) {
      if (metadata.canonicalUrl) {
        baseUrl = metadata.canonicalUrl
      }
      if (metadata.updatedAt) {
        lastModified = new Date(metadata.updatedAt)
      }
    }
  } catch (error) {
    // Silently fail and use defaults - sitemap will still work
    console.error('Error fetching metadata for sitemap:', error)
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

