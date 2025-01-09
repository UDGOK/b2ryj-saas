export const ROLES = {
  ADMIN: 'ADMIN',
  PROPERTY_OWNER: 'PROPERTY_OWNER',
  PROPERTY_MANAGER: 'PROPERTY_MANAGER',
  MAINTENANCE: 'MAINTENANCE',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  TENANT: 'TENANT',
  APPLICANT: 'APPLICANT'
} as const

export type Role = keyof typeof ROLES

export function hasRequiredRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole)
}

export function getRolePermissions(role: Role): string[] {
  const permissions: Record<Role, string[]> = {
    ADMIN: ['*'],
    PROPERTY_OWNER: ['read:properties', 'write:properties', 'read:tenants'],
    PROPERTY_MANAGER: ['read:properties', 'write:properties', 'read:tenants'],
    MAINTENANCE: ['read:requests', 'write:requests'],
    SERVICE_PROVIDER: ['read:requests', 'write:bids'],
    TENANT: ['read:requests', 'write:requests'],
    APPLICANT: ['read:applications']
  }

  return permissions[role] || []
}
