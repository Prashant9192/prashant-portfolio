
'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Activity, TrendingUp, Code, MessageSquare, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DashboardOverview() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        messages: 0,
        projects: 0,
        skills: 0
    })

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            // Fetch Messages Count
            const msgRes = await fetch('/api/messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const msgData = await msgRes.json()
            const msgCount = Array.isArray(msgData.messages) ? msgData.messages.length : 0

            // Fetch Projects Count
            const projRes = await fetch('/api/content/projects')
            const projData = await projRes.json()
            const projCount = Array.isArray(projData.projects) ? projData.projects.length : 0

            // Fetch Skills Count
            const skillRes = await fetch('/api/content/skills')
            const skillData = await skillRes.json()
            const skillCount = Array.isArray(skillData.skills) ? skillData.skills.length : 0

            setStats({
                messages: msgCount,
                projects: projCount,
                skills: skillCount
            })
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error)
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const cards = [
        {
            title: 'Total Messages',
            value: loading ? '...' : stats.messages,
            label: 'Inquiries Received',
            icon: MessageSquare,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            title: 'Active Projects',
            value: loading ? '...' : stats.projects,
            label: 'Portfolio Items',
            icon: Briefcase,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10 border-purple-500/20'
        },
        {
            title: 'Listed Skills',
            value: loading ? '...' : stats.skills,
            label: 'Technologies',
            icon: Code,
            color: 'text-green-500',
            bg: 'bg-green-500/10 border-green-500/20'
        }
    ]

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your portfolio.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card, i) => (
                    <div key={i} className={`p-6 rounded-xl border ${card.bg}`}>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium">{card.title}</p>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                        <div className="flex flex-col mt-3">
                            <span className="text-2xl font-bold">{card.value}</span>
                            <span className="text-xs text-muted-foreground mt-1">{card.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <h3 className="font-semibold text-lg">Recent Activity</h3>
                        <div className="mt-4 flex flex-col gap-4 text-sm text-muted-foreground">
                            {/* Placeholder for now - could be real logs later */}
                            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                <Sparkles size={16} className="text-primary" />
                                <span>Portfolio dashboard accessed.</span>
                                <span className="text-xs ml-auto opacity-50">Just now</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                <Activity size={16} className="text-green-500" />
                                <span>System status: Online</span>
                                <span className="text-xs ml-auto opacity-50">Stable</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <h3 className="font-semibold text-lg">Quick Actions</h3>
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={() => router.push('/admin/projects')}
                                className="w-full text-left px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <Briefcase size={16} />
                                + Add New Project
                            </button>
                            <button
                                onClick={() => router.push('/admin/hero')}
                                className="w-full text-left px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <Sparkles size={16} />
                                ✎ Update Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
