import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default async function Dashboard() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to your Dashboard</h1>
      <p className="mb-8">You are signed in as {session.user?.email}</p>
      <div className="space-y-4">
        <Button asChild>
          <Link href="/maintenance">Maintenance Requests</Link>
        </Button>
        <Button asChild>
          <Link href="/payments">Payments</Link>
        </Button>
        <Button asChild>
          <Link href="/smart-home">Smart Home Controls</Link>
        </Button>
      </div>
      <Button asChild className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}

