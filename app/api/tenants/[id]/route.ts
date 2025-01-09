import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tenant = await prisma.user.findUnique({
    where: { id: params.id, role: 'TENANT' },
    include: {
      property: true,
      payments: true,
      maintenanceRequests: true,
      leases: {
        include: {
          property: true
        }
      }
    }
  })

  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  return NextResponse.json(tenant)
}

export async function getTenantById(id: string) {
  return await prisma.user.findUnique({
    where: { id, role: 'TENANT' },
    include: {
      property: true,
      payments: true,
      maintenanceRequests: true,
      leases: {
        include: {
          property: true
        }
      }
    }
  })
}
