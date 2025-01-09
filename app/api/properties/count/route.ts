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
    const count = await prisma.property.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to fetch property count:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

