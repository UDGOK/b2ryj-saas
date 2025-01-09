import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { TenantsTable } from "./tenants-table"
import { TenantsTableSkeleton } from "./tenants-table-skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"

export default async function TenantsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'PROPERTY_OWNER'].includes(session.user?.role || '')) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">
            Manage your property tenants and their information.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tenants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<TenantsTableSkeleton />}>
        <TenantsTable />
      </Suspense>
    </div>
  )
}

