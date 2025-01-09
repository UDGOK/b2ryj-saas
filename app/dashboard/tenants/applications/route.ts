import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'PROPERTY_OWNER'].includes(session.user?.role || '')) {
    return NextResponse.json({ error: 'Unauthorized. You must be an admin or property owner to process applications.' }, { status: 401 })
  }

  try {
    const applicationData = await req.json()
    
    // Create a new rental application
    const application = await prisma.rentalApplication.create({
      data: {
        applicant: {
          create: {
            name: `${applicationData.firstName} ${applicationData.lastName}`,
            email: applicationData.email,
            phone: applicationData.phone,
            role: 'APPLICANT',
            password: '', // This would be set when the applicant creates their account
          },
        },
        property: {
          connect: {
            id: applicationData.propertyUnit, // This would be the actual property ID
          },
        },
        status: 'PENDING',
        creditScore: parseInt(applicationData.creditScore),
        income: parseFloat(applicationData.monthlyIncome),
        employmentInfo: {
          status: applicationData.employmentStatus,
          currentAddress: applicationData.currentAddress,
        },
        references: applicationData.references,
      },
    })

    // Create a notification for the property owner
    await prisma.notification.create({
      data: {
        title: 'New Tenant Application',
        content: `New application received from ${applicationData.firstName} ${applicationData.lastName} for unit ${applicationData.propertyUnit}`,
        type: 'APPLICATION',
        userId: session.user.id,
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Failed to create tenant application:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

