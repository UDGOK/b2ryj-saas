import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword',
        role: 'TENANT',
      },
    })
    return NextResponse.json({ success: true, user: testUser })
  } catch (error) {
    console.error('Error writing to database:', error)
    return NextResponse.json({ error: 'Failed to write to database', details: error }, { status: 500 })
  }
}

