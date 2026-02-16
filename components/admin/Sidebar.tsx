
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, User, Briefcase, Code, Award,
    Mail, Settings, LogOut, MessageSquare, ChevronRight, Menu, X, Home
} from 'lucide-react'

interface SidebarProps {
    onLogout: () => void
}

export default function AdminSidebar({ onLogout }: SidebarProps) {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
        { name: 'Hero Section', icon: Settings, href: '/admin/hero' },
        { name: 'About Me', icon: User, href: '/admin/about' },
        { name: 'Experience', icon: Award, href: '/admin/experience' },
        { name: 'Projects', icon: Briefcase, href: '/admin/projects' },
        { name: 'Skills', icon: Code, href: '/admin/skills' },
        { name: 'Contact Info', icon: Mail, href: '/admin/contact' },
    ]

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center px-4 justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 -ml-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-lg">Admin Panel</span>
                </div>
                {/* Could add user avatar or quick actions here */}
            </div>

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-[60] h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full bg-card">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foregroun transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-primary/10 text-primary shadow-sm'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} className={`transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight size={16} className="text-primary/50" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-border bg-card space-y-1">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors group"
                        >
                            <Home size={18} className="group-hover:text-primary transition-colors" />
                            <span>Back to Website</span>
                        </Link>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors group"
                        >
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for Mobile */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-50 bg-black/60 lg:hidden backdrop-blur-sm transition-opacity"
                />
            )}
        </>
    )
}
