import Link from 'next/link'

export default function Brand() {
  return (
    <Link href="/" aria-label="Go to homepage" className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-md font-semibold text-lg px-2 py-1"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          borderRadius: 8,
        }}
      >
        Prashant
      </div>
      <span className="sr-only">Prashant Basnet Portfolio</span>
    </Link>
  )
}
