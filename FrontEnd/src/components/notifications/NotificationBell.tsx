"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import apiClient from "@/services/apiClient"
import { Bell as BellIcon } from "lucide-react"

interface Notification {
    id: string
    type: string
    repo_id: string
    repo_name: string
    message: string
    read: boolean
    created_at: string
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const { data } = await apiClient.get("/notifications")
            setNotifications(data.notifications || [])
            setUnreadCount(data.unread_count || 0)
        } catch (err) {
            // Silently fail — don't crash the navbar
        }
    }

    // Poll every 10 seconds
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 10000)
        return () => clearInterval(interval)  // cleanup
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Handle notification click
    const handleNotificationClick = async (notif: Notification) => {
        try {
            // Mark as read
            await apiClient.post(`/notifications/${notif.id}/read`)
            // Update local state
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notif.id ? { ...n, read: true } : n
                )
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
            // Navigate to Code Lab with this repo
            router.push(`/repo-analysis?repo_id=${notif.repo_id}`)
            setIsOpen(false)
        } catch (err) {
            // Navigate anyway even if mark-read fails
            router.push(`/repo-analysis?repo_id=${notif.repo_id}`)
            setIsOpen(false)
        }
    }

    // Mark all as read
    const markAllRead = async () => {
        try {
            await apiClient.post("/notifications/read-all")
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            )
            setUnreadCount(0)
        } catch (err) { }
    }

    // Format time ago
    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)
        if (mins < 1) return "just now"
        if (mins < 60) return `${mins}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            >
                {/* Use existing bell icon from your project */}
                <BellIcon className="w-5 h-5 text-white/40 group-hover:text-white" />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 
                           bg-orange-500 text-white 
                           text-[9px] rounded-full 
                           min-w-[16px] h-[16px] px-1 flex items-center 
                           justify-center font-bold
                           animate-pulse shadow-sm shadow-orange-500/50">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 top-12 
                        w-80 sm:w-80 z-50
                        bg-[#0a0a0f] border border-white/10 
                        rounded-xl shadow-2xl 
                        shadow-black/80 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between 
                          px-4 py-3 
                          border-b border-white/10">
                        <span className="text-white font-bold 
                             text-xs tracking-wider 
                             uppercase flex items-center gap-2">
                            <BellIcon size={14} className="text-saffron" />
                            Notifications
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-saffron text-[10px] font-bold uppercase tracking-widest
                           hover:text-white 
                           transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                                    No notifications yet
                                </p>
                                <p className="text-white/20 text-[10px] mt-2">
                                    Repo analysis updates will appear here
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`w-full px-4 py-3 
                             flex items-start gap-4
                             hover:bg-white/[0.05] 
                             transition-colors text-left
                             border-b border-white/5
                             ${!notif.read ? "bg-saffron/5" : ""}`}
                                >
                                    {/* Status Icon */}
                                    <div className={`mt-1.5 w-2 h-2 
                                  rounded-full flex-shrink-0
                                  ${notif.type === "analysis_complete"
                                            ? "bg-green-400"
                                            : "bg-saffron"
                                        }`}
                                    />

                                    <div className="flex-1 min-w-0">
                                        {/* Repo name */}
                                        <p className="text-white text-xs 
                                  font-bold truncate group-hover:text-saffron transition-colors">
                                            {notif.repo_name.toUpperCase().replace(/-/g, " ")}
                                        </p>
                                        {/* Message */}
                                        <p className="text-white/60 text-[10px] 
                                  mt-0.5 leading-snug">
                                            {notif.message}
                                        </p>
                                        {/* Time */}
                                        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest
                                  mt-1">
                                            {timeAgo(notif.created_at)}
                                        </p>
                                    </div>

                                    {/* Unread dot */}
                                    {!notif.read && (
                                        <div className="w-2 h-2 rounded-full 
                                    bg-saffron 
                                    flex-shrink-0 mt-1 shadow-sm shadow-saffron/50"
                                        />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-white/5">
                            <p className="text-white/30 text-[9px] uppercase tracking-widest font-black text-center">
                                Click a notification to open in Code Lab
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
