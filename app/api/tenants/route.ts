import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'PROPERTY_OWNER'].includes(session.user?.role || '')) {
    console.log('Unauthorized access attempt:', session?.user?.role)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Fetching tenants...')
    const tenants = await prisma.user.findMany({
      where: { role: 'TENANT' },
      select: { id: true, name: true, email: true, propertyId: true },
    })
    console.log('Tenants fetched:', tenants.length)
    return NextResponse.json(tenants)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
const session = await getServerSession(authOptions)

if (!session || !['ADMIN', 'PROPERTY_OWNER'].includes(session.user?.role || '')) {
 return NextResponse.json({ error: 'Unauthorized. You must be an admin or property owner to add tenants.' }, { status: 401 })
}

try {
 const body = await req.json()
 const { firstName, lastName, email, phone } = body

 // Validate input
 if (!firstName || !lastName || !email || !phone) {
   return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
 }

 const newTenant = await prisma.user.create({
   data: {
     name: `${firstName} ${lastName}`,
     email,
     phone,
     role: 'TENANT',
     password: 'defaultPassword', // In production, use a secure method to generate and hash passwords
   },
 })
 return NextResponse.json(newTenant)
} catch (error) {
 console.error('Error adding tenant:', error)
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Prisma error code:', error.code)
    console.error('Prisma error message:', error.message)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 400 })
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma validation error:', error.message)
  }
  
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
  console.error('Detailed error:', errorMessage)
  return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 })
}
}

