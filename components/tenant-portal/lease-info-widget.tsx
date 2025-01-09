'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Download } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface LeaseInfo {
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  documents: Array<{
    id: string
    name: string
    url: string
  }>
}

export function LeaseInfoWidget() {
  const [leaseInfo, setLeaseInfo] = useState<LeaseInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaseInfo()
  }, [])

  const fetchLeaseInfo = async () => {
    try {
      const response = await fetch('/api/tenant/lease')
      if (!response.ok) throw new Error('Failed to fetch lease information')
      const data = await response.json()
      setLeaseInfo(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load lease information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading lease information...</div>
  if (!leaseInfo) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Lease Start</p>
          <p className="font-medium">{new Date(leaseInfo.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Lease End</p>
          <p className="font-medium">{new Date(leaseInfo.endDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Monthly Rent</p>
          <p className="font-medium">${leaseInfo.monthlyRent.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Security Deposit</p>
          <p className="font-medium">${leaseInfo.securityDeposit.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Documents</p>
        {leaseInfo.documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{doc.name}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={doc.url} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

