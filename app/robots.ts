import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

export default async function robots(): Promise<MetadataRoute.Robots> {
  let baseUrl = 'https://yourdomain.com' // Default fallback
  
  try {
    const db = await getDb()
    const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
    
    if (metadata?.canonicalUrl) {
      baseUrl = metadata.canonicalUrl
    }
  } catch (error) {
    console.error('Error fetching canonical URL for robots:', error)
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

