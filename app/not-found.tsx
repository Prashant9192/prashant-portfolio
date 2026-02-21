'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, Home, Mail, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />

      <div className="w-full max-w-2xl mx-auto space-y-12 text-center relative z-10">

        {/* Animated Glitch 404 */}
        <div className="relative inline-block group">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <span className="text-[100px] sm:text-[140px] md:text-[180px] font-black tracking-tighter leading-none select-none bg-clip-text text-transparent bg-gradient-to-b from-primary via-primary to-purple-600 block">
              404
            </span>

            {/* Glitch Overlay (only shows on hover/animation) */}
            <span className="absolute top-0 left-0 w-full h-full text-[100px] sm:text-[140px] md:text-[180px] font-black tracking-tighter leading-none select-none mix-blend-overlay opacity-50 animate-glitch-1 hidden group-hover:block text-blue-500">404</span>
            <span className="absolute top-0 left-0 w-full h-full text-[100px] sm:text-[140px] md:text-[180px] font-black tracking-tighter leading-none select-none mix-blend-overlay opacity-50 animate-glitch-2 hidden group-hover:block text-red-500">404</span>
          </motion.div>
        </div>

        {/* System Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm uppercase tracking-[0.2em]">
            <AlertTriangle size={16} />
            <span>System Error: Path_Not_Found</span>
          </div>
          <h1 className="font-bold tracking-tight text-foreground">
            Lost in the <span className="text-primary italic">Digital Void</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            The resource you requested has been unmapped or moved to a different sector. Let&#x27;s get you back to the main node.
          </p>
        </motion.div>

        {/* Code Block Error Simulation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-left shadow-2xl backdrop-blur-md max-w-md mx-auto w-full"
        >
          <div className="flex gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          <div className="space-y-1 text-zinc-500">
            <p><span className="text-purple-400">const</span> <span className="text-blue-400">status</span> = <span className="text-amber-400">&apos;404_NOT_FOUND&apos;</span>;</p>
            <p><span className="text-purple-400">if</span> (targetPath === <span className="text-zinc-400">undefined</span>) &#123;</p>
            <p className="pl-4 text-primary font-bold animate-pulse">throw new Error(&apos;Redirecting to safety...&apos;);</p>
            <p>&#125;</p>
          </div>
        </motion.div>

        {/* Navigation Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]"
          >
            <Home size={18} />
            Return to Core
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary/50 text-foreground rounded-2xl font-semibold hover:bg-secondary hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 border border-border/50 backdrop-blur-sm"
          >
            <Mail size={18} />
            Report Sector
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
