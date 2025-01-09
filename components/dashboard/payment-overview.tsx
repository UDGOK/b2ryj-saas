'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function PaymentOverview() {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchTotalRevenue() {
      try {
        const response = await fetch('/api/payments/total-revenue')
        const data = await response.json()
        setTotalRevenue(data.totalRevenue)
      } catch (error) {
        console.error('Failed to fetch total revenue:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchTotalRevenue()
    }
  }, [session])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">
        +12% from last month
      </p>
    </>
  )
}

