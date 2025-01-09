'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"

interface Device {
  id: string
  name: string
  type: string
  isOnline: boolean
}

export default function SmartHomeControls() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/smart-home/devices')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch devices')
      }
      
      const data = await response.json()
      setDevices(data)
    } catch (error) {
      console.error('Error fetching devices:', error)
      setError(error instanceof Error ? error.message : 'Failed to load devices')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeviceAction = async (deviceId: string, action: string) => {
    try {
      const response = await fetch(`/api/smart-home/devices/${deviceId}/${action}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to perform ${action}`)
      }

      await fetchDevices()
    } catch (error) {
      console.error(`Error performing action ${action}:`, error)
      setError(error instanceof Error ? error.message : 'Failed to perform action')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          <p>Loading smart home devices...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Home Controls</CardTitle>
        <CardDescription>Manage your connected devices</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {devices.length === 0 ? (
          <p className="text-center text-muted-foreground">No devices found.</p>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{device.name}</h3>
                  <Badge variant={device.isOnline ? "success" : "destructive"}>
                    {device.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Type: {device.type}
                </p>
                <div className="flex flex-wrap gap-2">
                  {device.type === 'lock' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeviceAction(device.id, 'lock')}
                      >
                        Lock
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeviceAction(device.id, 'unlock')}
                      >
                        Unlock
                      </Button>
                    </>
                  )}
                  {device.type === 'thermostat' && (
                    <>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeviceAction(device.id, 'increaseTemp')}
                      >
                        Increase Temp
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeviceAction(device.id, 'decreaseTemp')}
                      >
                        Decrease Temp
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

