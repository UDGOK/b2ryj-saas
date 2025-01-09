'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Building2, FileText, UserPlus, MessageSquare, WrenchIcon, ClipboardList, DollarSign, BarChart, Settings, Users2, UserCircle } from 'lucide-react'

const routes = [
  {
    title: "Dashboard",
    icon: BarChart,
    href: "/dashboard",
    items: [],
  },
  {
    title: "Maintenance",
    icon: WrenchIcon,
    items: [
      {
        title: "Maintenance Requests",
        href: "/maintenance",
        description: "View and manage maintenance requests.",
      },
      {
        title: "New Request",
        href: "/maintenance/new",
        description: "Submit a new maintenance request.",
      },
    ],
  },
  {
    title: "Profile",
    icon: UserCircle,
    href: "/dashboard/profile",
    items: [],
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-80 border-r bg-white">
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="space-y-6 p-4">
          {routes.map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center gap-2 px-3">
                {section.href ? (
                  <Link href={section.href}>
                    <section.icon className="h-4 w-4" />
                  </Link>
                ) : (
                  <section.icon className="h-4 w-4" />
                )}
                <h4 className="text-sm font-medium">{section.title}</h4>
              </div>
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Link href={item.href}>
                    <span>{item.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}

