'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

interface RentPayment {
  amount: number
  dueDate: string
  status: 'PENDING' | 'PAID' | 'LATE'
}

export function RentPaymentWidget() {
  const [payment, setPayment] = useState<RentPayment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchRentPayment()
  }, [])

  const fetchRentPayment = async () => {
    try {
      const response = await fetch('/api/tenant/rent-payment')
      if (!response.ok) throw new Error('Failed to fetch rent payment')
      const data = await response.json()
      setPayment(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rent payment information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/tenant/rent-payment/pay', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Payment failed')
      
      toast({
        title: "Success",
        description: "Rent payment processed successfully",
      })
      fetchRentPayment()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!payment) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Next Rent Payment</p>
          <p className="text-2xl font-bold">{formatCurrency(payment.amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {payment.status === 'LATE' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Payment is overdue</span>
        </div>
      )}

      <Button 
        className="w-full" 
        onClick={handlePayment}
        disabled={isProcessing || payment.status === 'PAID'}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : payment.status === 'PAID' ? (
          'Paid'
        ) : (
          'Pay Now'
        )}
      </Button>
    </div>
  )
}

