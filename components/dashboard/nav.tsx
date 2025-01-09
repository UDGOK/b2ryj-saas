'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Building2, FileText, UserPlus, MessageSquare, WrenchIcon, ClipboardList, DollarSign, BarChart, Settings, Users2, UserCircle } from 'lucide-react'

const routes = [
  {
    title: "Applicants & Tenants",
    icon: Users,
    items: [
      {
        title: "Tenant Screening",
        href: "/dashboard/tenant-screening",
        description: "Get a complete picture of your applicants.",
      },
      {
        title: "Rental Application",
        href: "/dashboard/rental-application",
        description: "Share a listing and receive applications.",
      },
      {
        title: "Online Leases",
        href: "/dashboard/leases",
        description: "Create a lease and invite tenants to e-sign.",
      },
      {
        title: "Roommates",
        href: "/dashboard/roommates",
        description: "Easily move-in multiple tenants.",
      },
    ],
  },
  {
    title: "Marketing",
    icon: Building2,
    items: [
      {
        title: "Listing Website",
        href: "/dashboard/listings",
        description: "Show off your properties and attract tenants.",
      },
      {
        title: "Automatic Listing Syndication",
        href: "/dashboard/syndication",
        description: "Post vacancies to numerous listing partners.",
      },
    ],
  },
  {
    title: "Leads",
    icon: UserPlus,
    items: [
      {
        title: "Premium Leads",
        href: "/dashboard/leads",
        description: "Get access to millions of potential tenants.",
      },
      {
        title: "Lead Tracking",
        href: "/dashboard/lead-tracking",
        description: "Don't miss any potential tenants.",
      },
    ],
  },
  {
    title: "Finances",
    icon: DollarSign,
    items: [
      {
        title: "Online Payments",
        href: "/dashboard/payments",
        description: "Receive and send payments online.",
      },
      {
        title: "Accounting",
        href: "/dashboard/accounting",
        description: "Store, sort, and summarize your finances.",
      },
      {
        title: "Reconciliation",
        href: "/dashboard/reconciliation",
        description: "Match transactions with your bank statement.",
      },
      {
        title: "Reports",
        href: "/dashboard/reports",
        description: "Customize and view the data you need.",
      },
      {
        title: "Rentability Report",
        href: "/dashboard/rentability",
        description: "Get the new prices for your rentals.",
      },
    ],
  },
  {
    title: "Maintenance",
    icon: WrenchIcon,
    items: [
      {
        title: "Maintenance Requests",
        href: "/dashboard/maintenance",
        description: "Assign visual work orders to Service Pros.",
      },
      {
        title: "Maintenance Bidding",
        href: "/dashboard/maintenance-bids",
        description: "Get bids from local service pros.",
      },
    ],
  },
  {
    title: "Team",
    icon: Users2,
    items: [
      {
        title: "Team Management",
        href: "/dashboard/team",
        description: "Manage rentals together with a team.",
      },
      {
        title: "Property Message Board",
        href: "/dashboard/messages",
        description: "Send notices to all or some of your tenants.",
      },
      {
        title: "Priority Support",
        href: "/dashboard/support",
        description: "Call, text, chat. We are here to assist.",
      },
    ],
  },
  {
    title: "Profile",
    icon: UserCircle,
    href: "/profile",
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
                <section.icon className="h-4 w-4" />
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

