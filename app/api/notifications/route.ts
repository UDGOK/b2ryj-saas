import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

