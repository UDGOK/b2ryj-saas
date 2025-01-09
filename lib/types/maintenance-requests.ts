export interface MaintenanceRequest {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  propertyId: string
  requesterId: string
  createdAt: Date
  updatedAt: Date
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  propertyId: string | null
  role: 'ADMIN' | 'PROPERTY_OWNER' | 'PROPERTY_MANAGER' | 'MAINTENANCE' | 'SERVICE_PROVIDER' | 'TENANT' | 'APPLICANT'
}

export type MaintenanceRequestInput = {
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}
