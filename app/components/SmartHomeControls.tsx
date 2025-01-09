'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Seam from 'seam'

interface Device {
  id: string
  name: string
  type: string
  isOnline: boolean
}

export default function SmartHomeControls() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/smart-home/devices')
      if (!response.ok) {
        throw new Error('Failed to fetch devices')
      }
      const data = await response.json()
      setDevices(data)
    } catch (error) {
      console.error('Error fetching devices:', error)
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
        throw new Error(`Failed to perform action ${action} on device`)
      }

      // Refresh the devices list after action
      fetchDevices()
    } catch (error) {
      console.error(`Error performing action ${action} on device:`, error)
    }
  }

  if (isLoading) {
    return <div>Loading smart home devices...</div>
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Smart Home Controls</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {devices.map((device) => (
          <li key={device.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600 truncate">{device.name}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  device.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {device.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  Type: {device.type}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                {device.type === 'lock' && (
                  <>
                    <button
                      onClick={() => handleDeviceAction(device.id, 'lock')}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Lock
                    </button>
                    <button
                      onClick={() => handleDeviceAction(device.id, 'unlock')}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Unlock
                    </button>
                  </>
                )}
                {device.type === 'thermostat' && (
                  <>
                    <button
                      onClick={() => handleDeviceAction(device.id, 'increaseTemp')}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Increase Temp
                    </button>
                    <button
                      onClick={() => handleDeviceAction(device.id, 'decreaseTemp')}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Decrease Temp
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

