import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '../../lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: session.user.role === 'TENANT' ? { userId: session.user.id } : {},
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching maintenance requests:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'TENANT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { description, priority } = await req.json()
    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        description,
        priority,
        status: 'pending',
        userId: session.user.id,
      },
    })
    return NextResponse.json(newRequest)
  } catch (error) {
    console.error('Error creating maintenance request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

