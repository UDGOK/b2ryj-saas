import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
          Welcome to B2RYJ-SaaS
        </h1>
        <p className="text-lg text-muted-foreground max-w-prose mx-auto">
          Your complete property management solution for landlords and tenants.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </main>
  )
}

