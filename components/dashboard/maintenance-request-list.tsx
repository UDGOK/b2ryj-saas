'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface MaintenanceRequest {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
}

export function MaintenanceRequestList() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchMaintenanceRequests() {
      try {
        const response = await fetch('/api/maintenance-requests')
        const data = await response.json()
        setRequests(data)
      } catch (error) {
        console.error('Failed to fetch maintenance requests:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchMaintenanceRequests()
    }
  }, [session])

  if (loading) {
    return <div>Loading maintenance requests...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Maintenance Requests</h2>
        <Button asChild>
          <Link href="/maintenance/new">New Request</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.title}</TableCell>
              <TableCell>
                <Badge variant={request.status === 'COMPLETED' ? 'success' : 'default'}>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={request.priority === 'HIGH' ? 'destructive' : 'default'}>
                  {request.priority}
                </Badge>
              </TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

