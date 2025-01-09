'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart2, WrenchIcon, UserCircle, Users } from 'lucide-react'

const routes = [
  {
    title: "Dashboard",
    icon: BarChart2,
    href: "/dashboard",
    description: "Overview of your properties and activities",
  },
  {
    title: "Tenants",
    icon: Users,
    items: [
      {
        title: "All Tenants",
        href: "/dashboard/tenants",
        description: "Manage your tenants",
      },
      {
        title: "Add Tenant",
        href: "/dashboard/tenants/new",
        description: "Add a new tenant",
      },
    ],
  },
  {
    title: "Maintenance",
    icon: WrenchIcon,
    items: [
      {
        title: "Maintenance Requests",
        href: "/maintenance",
        description: "View all maintenance requests",
      },
      {
        title: "New Request",
        href: "/maintenance/new",
        description: "Submit a new maintenance request",
      },
    ],
  },
  {
    title: "Profile",
    icon: UserCircle,
    href: "/dashboard/profile",
    description: "Manage your account settings",
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen flex-col border-r bg-white">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">B2RYJ-SaaS</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          {routes.map((section) => (
            <div key={section.title} className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items ? (
                  section.items.map((item) => (
                    <Button
                      key={item.href}
                      asChild
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Link href={item.href}>
                        <section.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  ))
                ) : (
                  <Button
                    asChild
                    variant={pathname === section.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link href={section.href}>
                      <section.icon className="mr-2 h-4 w-4" />
                      {section.title}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

