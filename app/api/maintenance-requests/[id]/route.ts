import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'MAINTENANCE') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { status } = await req.json()
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating maintenance request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

