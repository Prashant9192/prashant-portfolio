import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import LayoutClient from './layout-client'
import AdminButton from '@/components/AdminButton'
import { Metadata, Viewport } from 'next'
import { getDb } from '@/lib/db'
import { SiteMetadata } from '@/lib/models'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

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
    title: 'Prashant Basnet — Full-Stack Web Developer',
    description: 'Prashant Basnet is a Full-Stack Web Developer specializing in Next.js, React, and Node.js. Building modern, performant web applications. Available for freelance and full-time opportunities.',
    robots: 'index, follow',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    language: 'en',
    favicon: '',
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getMetadata()

  const title = metadata.title || 'Prashant Basnet — Full-Stack Web Developer'
  const description = metadata.description || 'Prashant Basnet is a Full-Stack Web Developer specializing in Next.js, React, and Node.js. Building modern, performant web applications. Available for freelance and full-time opportunities.'
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
    icons: metadata.favicon ? {
      icon: [
        {
          url: metadata.favicon,
          sizes: 'any',
          type: metadata.favicon.endsWith('.png') ? 'image/png' :
            metadata.favicon.endsWith('.svg') ? 'image/svg+xml' :
              metadata.favicon.endsWith('.ico') ? 'image/x-icon' : 'image/png'
        }
      ],
      shortcut: metadata.favicon,
      apple: metadata.favicon,
    } : undefined,
  }

  return metadataObject
}

export async function generateViewport(): Promise<Viewport> {
  const metadata = await getMetadata()

  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#050511' },
    ],
    width: 'device-width',
    initialScale: 1,
    // maximumScale removed — prevents pinch-zoom accessibility violation (WCAG 1.4.4)
  }
}

// JSON-LD structured data helper
function buildJsonLd(metadata: SiteMetadata) {
  const siteUrl = metadata.canonicalUrl || 'https://prashant.dev'
  const authorName = metadata.author || 'Prashant Basnet'
  const siteTitle = metadata.title || 'Prashant Basnet — Full-Stack Web Developer'

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    url: siteUrl,
    jobTitle: 'Full-Stack Web Developer',
    description: metadata.description || 'Full-Stack Web Developer specializing in Next.js, React, and Node.js.',
    image: metadata.ogImage ? (metadata.ogImage.startsWith('http') ? metadata.ogImage : `${siteUrl}${metadata.ogImage}`) : `${siteUrl}/MyAvatar.png`,
    sameAs: [],
    knowsAbout: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Web Development', 'Full-Stack Development'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: siteUrl,
    description: metadata.description || 'Portfolio of Prashant Basnet — Full-Stack Web Developer.',
    author: {
      '@type': 'Person',
      name: authorName,
    },
  }

  return [personSchema, websiteSchema]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const metadata = await getMetadata()
  const jsonLd = buildJsonLd(metadata)

  return (
    <html lang={metadata.language || 'en'} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to CDN for faster third-party resource loading */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

        {/* JSON-LD Structured Data — Person + WebSite schema for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <script dangerouslySetInnerHTML={{
          __html: `
            // Immediately add class to body when JS is enabled
            document.documentElement.classList.add('js-enabled');
          `
        }} />
        <noscript>
          <style dangerouslySetInnerHTML={{
            __html: `
              /* Hide JavaScript-dependent content when JS is disabled */
              .js-only {
                display: none !important;
              }
              /* Show noscript content when JS is disabled */
              noscript {
                display: block !important;
              }
            `
          }} />
        </noscript>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Hide noscript content when JS is enabled */
            .js-enabled noscript {
              display: none !important;
            }
          `
        }} />
      </head>
      <body className="cursor-none">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutClient>
            {children}
            <AdminButton />
          </LayoutClient>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
