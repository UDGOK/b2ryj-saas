import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@b2ryj.com' },
      update: {},
      create: {
        email: 'admin@b2ryj.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    })
    console.log('Admin user created:', admin.email)

    // Create property owner user
    const ownerPassword = await hash('owner123', 10)
    const owner = await prisma.user.upsert({
      where: { email: 'owner@b2ryj.com' },
      update: {},
      create: {
        email: 'owner@b2ryj.com',
        name: 'Property Owner',
        password: ownerPassword,
        role: 'PROPERTY_OWNER',
      },
    })
    console.log('Property owner created:', owner.email)

    // Create maintenance user
    const maintenancePassword = await hash('maintenance123', 10)
    const maintenance = await prisma.user.upsert({
      where: { email: 'maintenance@b2ryj.com' },
      update: {},
      create: {
        email: 'maintenance@b2ryj.com',
        name: 'Maintenance Staff',
        password: maintenancePassword,
        role: 'MAINTENANCE',
      },
    })
    console.log('Maintenance user created:', maintenance.email)

    // Create tenant user
    const tenantPassword = await hash('tenant123', 10)
    const tenant = await prisma.user.upsert({
      where: { email: 'tenant@b2ryj.com' },
      update: {},
      create: {
        email: 'tenant@b2ryj.com',
        name: 'Test Tenant',
        password: tenantPassword,
        role: 'TENANT',
      },
    })
    console.log('Tenant user created:', tenant.email)

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

