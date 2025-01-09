import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '../../lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount } = await req.json()

    const payment = await prisma.payment.create({
      data: {
        amount,
        userId: session.user.id,
        status: 'COMPLETED',
      },
    })

    return NextResponse.json({ success: true, payment })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

