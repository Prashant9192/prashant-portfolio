
'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Message } from '@/lib/models'

export default function MessagesList() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages')
            const data = await res.json()
            if (data.messages) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const token = localStorage.getItem('adminToken')
            const res = await fetch(`/api/messages?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                toast.success('Message deleted')
                setMessages(prev => prev.filter(m => m._id !== id))
            } else {
                toast.error('Failed to delete message')
            }
        } catch (error) {
            toast.error('Error deleting message')
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                    <p className="text-muted-foreground mt-2">Manage inquiries from your contact form.</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    {messages.length} Messages
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No messages yet</h3>
                    <p className="text-muted-foreground">When people contact you, messages will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <div key={msg._id} className="group relative p-6 rounded-xl border bg-card hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        {msg.name}
                                        {!msg.read && <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail size={14} /> {msg.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(msg._id!)}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 p-4 rounded-lg bg-secondary/30 text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
