import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import MaintenanceRequestForm from "@/app/components/MaintenanceRequestForm"
import MaintenanceRequestList from "@/app/components/MaintenanceRequestList"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default async function MaintenancePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Access Denied</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Maintenance Requests</h1>
      {session.user.role === 'TENANT' && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Submit a New Request</h2>
          <MaintenanceRequestForm />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Maintenance Request List</h2>
        <MaintenanceRequestList />
      </div>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  )
}

