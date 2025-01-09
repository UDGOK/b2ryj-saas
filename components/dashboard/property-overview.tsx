'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function PropertyOverview() {
  const [propertyCount, setPropertyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchPropertyCount() {
      try {
        const response = await fetch('/api/properties/count')
        const data = await response.json()
        setPropertyCount(data.count)
      } catch (error) {
        console.error('Failed to fetch property count:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchPropertyCount()
    }
  }, [session])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="text-2xl font-bold">{propertyCount}</div>
      <p className="text-xs text-muted-foreground">
        Managed properties
      </p>
    </>
  )
}

