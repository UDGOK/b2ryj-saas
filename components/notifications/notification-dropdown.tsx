'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  title: string
  content: string
  createdAt: string
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      setUnreadCount((prev) => Math.max(prev - 1, 0))
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 py-0.5 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)}>
              <div className="flex flex-col">
                <span className="font-semibold">{notification.title}</span>
                <span className="text-sm text-gray-500">{notification.content}</span>
                <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

