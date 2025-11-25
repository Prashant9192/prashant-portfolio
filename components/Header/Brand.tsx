import Link from 'next/link'

export default function Brand() {
  return (
    <Link href="/" aria-label="Go to homepage" className="flex items-center gap-1">
      <span className="font-bold text-xl tracking-tight text-foreground">
        Prashant<span className="text-primary">.dev</span>
      </span>
    </Link>
  )
}
