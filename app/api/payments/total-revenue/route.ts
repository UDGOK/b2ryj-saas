import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'COMPLETED',
      },
    })

    const totalRevenue = result._sum.amount || 0
    return NextResponse.json({ totalRevenue })
  } catch (error) {
    console.error('Failed to fetch total revenue:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

