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
    const requests = await prisma.maintenanceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Failed to fetch maintenance requests:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, priority, propertyId } = await req.json()
    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        priority,
        status: 'PENDING',
        requesterId: session.user.id,
        propertyId,
      },
    })
    return NextResponse.json(newRequest)
  } catch (error) {
    console.error('Failed to create maintenance request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

