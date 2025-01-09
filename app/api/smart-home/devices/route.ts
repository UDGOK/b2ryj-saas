import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Mock data for development since Seam might not be properly initialized
const mockDevices = [
  {
    id: 'device_1',
    name: 'Front Door Lock',
    type: 'lock',
    isOnline: true,
  },
  {
    id: 'device_2',
    name: 'Living Room Thermostat',
    type: 'thermostat',
    isOnline: true,
  }
]

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'PROPERTY_OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For development, return mock data
    // In production, you would integrate with Seam here
    return NextResponse.json(mockDevices)
  } catch (error) {
    console.error('Error in smart home devices route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

