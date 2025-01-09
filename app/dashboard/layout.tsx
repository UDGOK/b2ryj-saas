import { ReactNode } from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardNav />
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

