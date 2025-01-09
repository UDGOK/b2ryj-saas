import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '../../../lib/prisma'

export async function GET(req: Request, { params }: { params: { tenantId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'PROPERTY_OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { userId: params.tenantId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

