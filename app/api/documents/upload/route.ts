import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // In a production environment, you would upload the file to a storage service
    // like AWS S3 or similar. For this example, we'll just simulate the upload.
    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: 'APPLICATION',
        url: `https://storage.example.com/${file.name}`, // This would be the actual URL
        applicationId: session.user.id, // This would be the actual application ID
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Failed to upload document:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

