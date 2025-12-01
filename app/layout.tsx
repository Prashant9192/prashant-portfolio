import './globals.css'
import { ThemeProvider } from 'next-themes'
// import { Analytics } from '@vercel/analytics/react'
import LayoutClient from './layout-client'
import { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

async function getMetadata(): Promise<SiteMetadata> {
  try {
    const db = await getDb()
    if (db) {
      const metadata = await db.collection<SiteMetadata>('metadata').findOne({})
      
      if (metadata) {
        return metadata
      }
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
  }
  
  // Return default metadata if fetch fails or DB unavailable
  return {
    title: 'Prashant Basnet — Web Developer',
    description: 'Portfolio',
    robots: 'index, follow',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    language: 'en',
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getMetadata()
  
  const title = metadata.title || 'Prashant Basnet — Web Developer'
  const description = metadata.description || 'Portfolio'
  const canonicalUrl = metadata.canonicalUrl
  const ogImage = metadata.ogImage || '/MyAvatar.png'
  const ogUrl = metadata.ogUrl || canonicalUrl
  
  const metadataObject: Metadata = {
    title,
    description,
    keywords: metadata.keywords ? metadata.keywords.split(',').map(k => k.trim()) : undefined,
    authors: metadata.author ? [{ name: metadata.author }] : undefined,
    creator: metadata.author,
    robots: metadata.robots || 'index, follow',
    openGraph: {
      title: metadata.ogTitle || title,
      description: metadata.ogDescription || description,
      url: ogUrl,
      siteName: metadata.ogSiteName || title,
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : (ogUrl ? new URL(ogImage, ogUrl).toString() : ogImage),
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
      type: (metadata.ogType as 'website' | 'profile' | 'article') || 'website',
      locale: metadata.language || 'en',
    },
    twitter: {
      card: (metadata.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      title: metadata.twitterTitle || title,
      description: metadata.twitterDescription || description,
      images: metadata.twitterImage ? [metadata.twitterImage] : ogImage ? [ogImage] : undefined,
      site: metadata.twitterSite ? `@${metadata.twitterSite.replace('@', '')}` : undefined,
      creator: metadata.twitterCreator ? `@${metadata.twitterCreator.replace('@', '')}` : undefined,
    },
    alternates: {
      canonical: canonicalUrl || undefined,
    },
    metadataBase: canonicalUrl ? new URL(canonicalUrl) : undefined,
    themeColor: metadata.themeColor || '#2563eb',
    viewport: metadata.viewport || 'width=device-width, initial-scale=1',
    icons: {
      icon: metadata.favicon || '/favicon.ico',
      shortcut: metadata.favicon || '/favicon.ico',
      apple: metadata.favicon || '/favicon.ico',
    },
  }
  
  return metadataObject
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const metadata = await getMetadata()
  
  return (
    <html lang={metadata.language || 'en'} suppressHydrationWarning>
      <body className="cursor-none">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutClient>
            {children}
          </LayoutClient>
          {/* <Analytics /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
