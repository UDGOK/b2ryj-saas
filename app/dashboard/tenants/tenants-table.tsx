'use client'

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Home } from 'lucide-react'
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface Tenant {
  id: string
  name: string
  email: string
  unit: string
  status: string
  leaseEnd: string
  rentStatus: string
}

export function TenantsTable() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)
  const router = useRouter()

  const fetchTenants = async () => {
    try {
      console.log('Fetching tenants...')
      const response = await fetch('/api/tenants')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch tenants')
      }
      const data = await response.json()
      console.log('Tenants fetched:', data.length)
      setTenants(data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch tenants. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleDeleteTenant = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete tenant')
      
      setTenants(tenants.filter(tenant => tenant.id !== tenantId))
      toast({
        title: "Success",
        description: "Tenant has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tenant. Please try again.",
        variant: "destructive",
      })
    }
    setTenantToDelete(null)
  }

  if (isLoading) {
    return <div>Loading tenants...</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lease Ends</TableHead>
              <TableHead>Rent Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">{tenant.email}</p>
                  </div>
                </TableCell>
                <TableCell>{tenant.unit}</TableCell>
                <TableCell>
                  <Badge variant={tenant.status === 'active' ? 'success' : 'secondary'}>
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(tenant.leaseEnd).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={tenant.rentStatus === 'paid' ? 'success' : 'destructive'}>
                    {tenant.rentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/tenants/${tenant.id}/edit`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/tenants/${tenant.id}/unit`)}
                      >
                        <Home className="mr-2 h-4 w-4" />
                        View Unit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setTenantToDelete(tenant.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!tenantToDelete} onOpenChange={() => setTenantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the tenant
              and all associated data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => tenantToDelete && handleDeleteTenant(tenantToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

