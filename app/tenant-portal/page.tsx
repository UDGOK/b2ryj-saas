import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RentPaymentWidget } from "@/components/tenant-portal/rent-payment-widget"
import { MaintenanceRequestWidget } from "@/components/tenant-portal/maintenance-request-widget"
import { LeaseInfoWidget } from "@/components/tenant-portal/lease-info-widget"
import { UtilityBillsWidget } from "@/components/tenant-portal/utility-bills-widget"
import { InsuranceWidget } from "@/components/tenant-portal/insurance-widget"
import { TenantMessagesWidget } from "@/components/tenant-portal/messages-widget"

export default async function TenantDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'TENANT') {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Tenant Portal</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <RentPaymentWidget />
            <MaintenanceRequestWidget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lease Information</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaseInfoWidget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utility Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <UtilityBillsWidget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
          </CardHeader>
          <CardContent>
            <InsuranceWidget />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <TenantMessagesWidget />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

