'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Tenant {
  id: string
  name: string
  email: string
  propertyId: string
}

interface Payment {
  id: string
  amount: number
  status: string
  createdAt: string
}

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [newTenant, setNewTenant] = useState({ name: '', email: '' })
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants')
      if (!response.ok) {
        throw new Error('Failed to fetch tenants')
      }
      const data = await response.json()
      setTenants(data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPaymentHistory = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/payments/${tenantId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }
      const data = await response.json()
      setPaymentHistory(data)
    } catch (error) {
      console.error('Error fetching payment history:', error)
    }
  }

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId)
    fetchPaymentHistory(tenantId)
  }

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenant),
      })
      if (!response.ok) {
        throw new Error('Failed to add tenant')
      }
      setNewTenant({ name: '', email: '' })
      fetchTenants()
    } catch (error) {
      console.error('Error adding tenant:', error)
    }
  }

  const handleRemoveTenant = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to remove tenant')
      }
      fetchTenants()
      if (selectedTenant === tenantId) {
        setSelectedTenant(null)
        setPaymentHistory([])
      }
    } catch (error) {
      console.error('Error removing tenant:', error)
    }
  }

  if (isLoading) {
    return <div>Loading tenants...</div>
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tenant Management</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{tenant.name}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {tenant.email}
                <button
                  onClick={() => handleTenantSelect(tenant.id)}
                  className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Payments
                </button>
                <button
                  onClick={() => handleRemoveTenant(tenant.id)}
                  className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900">Add New Tenant</h4>
        <form onSubmit={handleAddTenant} className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Name"
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
            />
          </div>
          <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Email"
              value={newTenant.email}
              onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Add Tenant
          </button>
        </form>
      </div>
      {selectedTenant && (
        <div className="px-4 py-5 sm:px-6">
          <h4 className="text-lg leading-6 font-medium text-gray-900">Payment History</h4>
          <ul className="divide-y divide-gray-200">
            {paymentHistory.map((payment) => (
              <li key={payment.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">${payment.amount}</h3>
                      <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-500">Status: {payment.status}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

