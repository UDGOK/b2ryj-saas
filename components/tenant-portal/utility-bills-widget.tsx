'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface UtilityBill {
  id: string
  type: string
  amount: number
  dueDate: string
  status: 'PENDING' | 'PAID'
}

export function UtilityBillsWidget() {
  const [bills, setBills] = useState<UtilityBill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUtilityBills()
  }, [])

  const fetchUtilityBills = async () => {
    try {
      const response = await fetch('/api/tenant-portal/utility-bills')
      if (!response.ok) throw new Error('Failed to fetch utility bills')
      const data = await response.json()
      setBills(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load utility bills",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayBill = async (billId: string) => {
    try {
      const response = await fetch(`/api/tenant-portal/utility-bills/${billId}/pay`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Payment failed')
      
      setBills(bills.map(bill => 
        bill.id === billId ? { ...bill, status: 'PAID' } : bill
      ))
      
      toast({
        title: "Success",
        description: "Utility bill paid successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pay utility bill",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <Card key={bill.id}>
          <CardHeader>
            <CardTitle>{bill.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-lg font-semibold">${bill.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-sm">{new Date(bill.dueDate).toLocaleDateString()}</p>
              </div>
              <Button
                onClick={() => handlePayBill(bill.id)}
                disabled={bill.status === 'PAID'}
              >
                {bill.status === 'PAID' ? 'Paid' : 'Pay Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

