import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { Seam } from 'seam' // Changed from default import to named import

const seam = new Seam(process.env.SEAM_API_KEY!)

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'PROPERTY_OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const devices = await seam.devices.list()
    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

