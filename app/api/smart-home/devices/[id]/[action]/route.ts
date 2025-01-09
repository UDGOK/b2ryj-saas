import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../auth/[...nextauth]/route'
import { Seam } from 'seam' // Changed from default import to named import

const seam = new Seam(process.env.SEAM_API_KEY!)

export async function POST(req: Request, { params }: { params: { id: string, action: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'PROPERTY_OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, action } = params

    switch (action) {
      case 'lock':
        await seam.locks.lock(id)
        break
      case 'unlock':
        await seam.locks.unlock(id)
        break
      case 'increaseTemp':
        await seam.thermostats.setTemperature(id, { temperature_celsius: 25 })
        break
      case 'decreaseTemp':
        await seam.thermostats.setTemperature(id, { temperature_celsius: 20 })
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error performing device action:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

