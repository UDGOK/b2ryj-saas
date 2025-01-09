'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface MaintenanceRequest {
  id: string
  description: string
  priority: string
  status: string
  createdAt: string
}

export default function MaintenanceRequestList() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchMaintenanceRequests()
  }, [])

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await fetch('/api/maintenance-requests')
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests')
      }
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching maintenance requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

      fetchMaintenanceRequests()
    } catch (error) {
      console.error('Error updating maintenance request status:', error)
    }
  }

  if (isLoading) {
    return <div>Loading maintenance requests...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.description}</TableCell>
            <TableCell>
              <Badge variant={request.priority === 'high' ? 'destructive' : request.priority === 'medium' ? 'default' : 'secondary'}>
                {request.priority}
              </Badge>
            </TableCell>
            <TableCell>{request.status}</TableCell>
            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              {session?.user?.role === 'MAINTENANCE' && (
                <>
                  <Button onClick={() => handleStatusUpdate(request.id, 'in_progress')} variant="outline" size="sm" className="mr-2">
                    Start
                  </Button>
                  <Button onClick={() => handleStatusUpdate(request.id, 'completed')} variant="outline" size="sm">
                    Complete
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

