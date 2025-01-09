import { notFound } from 'next/navigation'
import { getTenantById } from '../../../../app/api/tenants/[id]/route'
import { TenantDetails } from '../../../../components/tenants/tenant-details'

export default async function TenantPage({ params }: { params: { id: string } }) {
  const tenant = await getTenantById(params.id)
  
  if (!tenant) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Tenant Details</h1>
      <TenantDetails tenant={tenant} />
    </div>
  )
}
