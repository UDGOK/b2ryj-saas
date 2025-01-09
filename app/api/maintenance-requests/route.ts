import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

interface SessionUser {
  id: string
  email: string
  name?: string
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
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
  const user = session?.user as SessionUser | undefined

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { description, priority } = await req.json()
    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        title: 'Maintenance Request',
        description,
        priority,
        status: 'PENDING',
        requesterId: user.id,
        propertyId: 'default-property-id', // TODO: Replace with actual property ID
      },
    })
    return NextResponse.json(newRequest)
  } catch (error) {
    console.error('Failed to create maintenance request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
