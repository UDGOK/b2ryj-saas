import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { z } from 'zod'
import prisma from '../../lib/prisma'
import { ROLES, hasRequiredRole, getRolePermissions, type Role } from '../../../lib/utils/roles'
import { ApiError, ERRORS } from '../../../lib/utils/errors'

function getAuthenticatedUser(session: any): SessionUser | null {
  if (!session?.user) return null
  
  const user = session.user as SessionUser
  if (!user.id || !user.email || !user.propertyId || !user.role) {
    return null
  }
  
  return user
}

import { SessionUser, MaintenanceRequestInput } from '../../../lib/types/maintenance-requests'

const MaintenanceRequestSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  photos: z.array(z.string().url()).optional(),
  category: z.enum(['PLUMBING', 'ELECTRICAL', 'STRUCTURAL', 'APPLIANCE', 'OTHER'])
    .default('OTHER'),
  urgency: z.enum(['NORMAL', 'URGENT'])
    .default('NORMAL')
}).refine(data => {
  // Validate that urgent requests must be high priority
  if (data.urgency === 'URGENT' && data.priority !== 'HIGH') {
    return false
  }
  return true
}, {
  message: 'Urgent requests must be high priority',
  path: ['priority']
})

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = getAuthenticatedUser(session)

    if (!user) {
      return new ApiError(
        ERRORS.UNAUTHORIZED.message,
        ERRORS.UNAUTHORIZED.code,
        ERRORS.UNAUTHORIZED.status
      ).toResponse()
    }

    // Check if user has required role
    const allowedRoles: Role[] = [ROLES.ADMIN, ROLES.PROPERTY_MANAGER, ROLES.TENANT]
    if (!hasRequiredRole(user.role, allowedRoles)) {
      return new ApiError(
        `Only ${allowedRoles.join(', ')} can access this resource`,
        ERRORS.FORBIDDEN.code,
        ERRORS.FORBIDDEN.status,
        { requiredPermissions: getRolePermissions(user.role) }
      ).toResponse()
    }

  try {
    const requests = await prisma.maintenanceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Failed to fetch maintenance requests:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch maintenance requests',
        code: 'FETCH_REQUESTS_FAILED'
      }, 
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = getAuthenticatedUser(session)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = MaintenanceRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { title, description, priority, photos, category, urgency } = parsed.data
    if (!user.propertyId) {
      return new ApiError(
        'User must be associated with a property',
        'MISSING_PROPERTY',
        400
      ).toResponse()
    }

    // Verify the property exists and user has access
    const property = await prisma.property.findUnique({
      where: { id: user.propertyId },
      select: { id: true }
    })

    if (!property) {
      return new ApiError(
        'Property not found or access denied',
        'PROPERTY_NOT_FOUND',
        404
      ).toResponse()
    }

    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        priority,
        status: 'PENDING',
        requesterId: user.id,
        propertyId: property.id,
        category,
        urgency,
        photos: photos ? { set: photos } : undefined,
      },
    })

    return NextResponse.json(newRequest)
  } catch (error) {
    console.error('Failed to create maintenance request:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId: user.id
    })
    return NextResponse.json(
      { 
        error: 'Failed to create maintenance request',
        code: 'CREATE_REQUEST_FAILED'
      }, 
      { status: 500 }
    )
  }
}
