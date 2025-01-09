'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface InsuranceInfo {
  provider: string
  policyNumber: string
  coverageAmount: number
  expirationDate: string
  isActive: boolean
}

export function InsuranceWidget() {
  const [insurance, setInsurance] = useState<InsuranceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInsuranceInfo()
  }, [])

  const fetchInsuranceInfo = async () => {
    try {
      const response = await fetch('/api/tenant-portal/insurance')
      if (!response.ok) throw new Error('Failed to fetch insurance information')
      const data = await response.json()
      setInsurance(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load insurance information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!insurance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Renter's Insurance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p>No active insurance policy found</p>
          </div>
          <Button className="mt-4">Add Insurance Policy</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Renter's Insurance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {insurance.isActive ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <p className={insurance.isActive ? "text-green-500" : "text-yellow-500"}>
              {insurance.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Provider</p>
            <p className="font-medium">{insurance.provider}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Policy Number</p>
            <p className="font-medium">{insurance.policyNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Coverage Amount</p>
            <p className="font-medium">${insurance.coverageAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expiration Date</p>
            <p className="font-medium">{new Date(insurance.expirationDate).toLocaleDateString()}</p>
          </div>
          <Button variant="outline">Update Policy</Button>
        </div>
      </CardContent>
    </Card>
  )
}

