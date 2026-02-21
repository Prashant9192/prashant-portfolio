import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Prashant.dev',
  description: 'The page you are looking for could not be found.',
  robots: 'noindex, follow',
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md mx-auto">

        {/* Glowing 404 number */}
        <div className="relative inline-block">
          <span
            className="text-[120px] md:text-[160px] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, var(--primary), #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>
          {/* Glow behind the text */}
          <div className="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full -z-10" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Looks like this page went on vacation. Let&apos;s get you back to somewhere familiar.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
          >
            ← Back to Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-border"
          >
            Contact Me
          </Link>
        </div>

      </div>
    </div>
  )
}
