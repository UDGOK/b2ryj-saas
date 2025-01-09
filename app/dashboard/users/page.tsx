import { Suspense } from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { UsersTable } from "./users-table"
import { UsersTableSkeleton } from "./users-table-skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || !['ADMIN', 'PROPERTY_OWNER'].includes(session.user?.role || '')) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users, including tenants, staff, and administrators.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable />
      </Suspense>
    </div>
  )
}

