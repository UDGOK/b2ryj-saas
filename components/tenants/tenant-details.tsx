import { User } from '@prisma/client'

interface TenantDetailsProps {
  tenant: User & {
    property: any
    payments: any[]
    maintenanceRequests: any[]
    leases: any[]
  }
}

export function TenantDetails({ tenant }: TenantDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {tenant.name}</p>
            <p><span className="font-medium">Email:</span> {tenant.email}</p>
            <p><span className="font-medium">Phone:</span> {tenant.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Property Information</h2>
          {tenant.property && (
            <div className="space-y-2">
              <p><span className="font-medium">Property:</span> {tenant.property.name}</p>
              <p><span className="font-medium">Address:</span> {tenant.property.address}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
        {tenant.leases.length > 0 ? (
          tenant.leases.map((lease) => (
            <div key={lease.id} className="space-y-2 mb-4">
              <p><span className="font-medium">Lease Period:</span> {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Monthly Rent:</span> ${lease.monthlyRent}</p>
            </div>
          ))
        ) : (
          <p>No active leases</p>
        )}
      </div>
    </div>
  )
}
