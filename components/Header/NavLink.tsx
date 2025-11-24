import Link from 'next/link'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition"
    >
      {children}
    </Link>
  )
}
