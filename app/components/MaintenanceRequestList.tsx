'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import io from 'socket.io-client'

interface MaintenanceRequest {
  id: string
  description: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  userId: string
}

export default function MaintenanceRequestList() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchMaintenanceRequests()

    const socket = io()

    socket.on('maintenanceUpdate', (updatedRequest) => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === updatedRequest.id ? updatedRequest : request
        )
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // ... (rest of the component remains the same)

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/maintenance-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update maintenance request status')
      }

      const updatedRequest = await response.json()
      
      // Emit the update through WebSocket
      const socket = io()
      socket.emit('maintenanceUpdate', updatedRequest)

    } catch (error) {
      console.error('Error updating maintenance request status:', error)
    }
  }

  // ... (rest of the component remains the same)
}

