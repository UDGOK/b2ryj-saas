import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">
          Logged in as: {session.user?.email}
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild>
            <Link href="/maintenance">Maintenance Requests</Link>
          </Button>
          <Button asChild>
            <Link href="/payments">Payment Management</Link>
          </Button>
          <Button asChild>
            <Link href="/smart-home">Smart Home Controls</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

