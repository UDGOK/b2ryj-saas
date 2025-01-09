import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting database seed...')

    // Create a property
    console.log('Creating property...')
    const property = await prisma.property.create({
      data: {
        name: 'Sunset Apartments',
        address: '123 Main Street, Cityville, ST 12345',
      },
    })
    console.log('Property created:', property)

    // Create admin user
    console.log('Creating admin user...')
    const adminPassword = await hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@b2ryj.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        propertyId: property.id,
      },
    })
    console.log('Admin user created:', admin.email)

    // Create property owner user
    console.log('Creating property owner user...')
    const ownerPassword = await hash('owner123', 10)
    const owner = await prisma.user.create({
      data: {
        email: 'owner@b2ryj.com',
        name: 'Property Owner',
        password: ownerPassword,
        role: 'PROPERTY_OWNER',
        propertyId: property.id,
      },
    })
    console.log('Property owner created:', owner.email)

    // Create maintenance user
    console.log('Creating maintenance user...')
    const maintenancePassword = await hash('maintenance123', 10)
    const maintenance = await prisma.user.create({
      data: {
        email: 'maintenance@b2ryj.com',
        name: 'Maintenance Staff',
        password: maintenancePassword,
        role: 'MAINTENANCE',
        propertyId: property.id,
      },
    })
    console.log('Maintenance user created:', maintenance.email)

    // Create tenant user
    console.log('Creating tenant user...')
    const tenantPassword = await hash('tenant123', 10)
    const tenant = await prisma.user.create({
      data: {
        email: 'tenant@b2ryj.com',
        name: 'Test Tenant',
        password: tenantPassword,
        role: 'TENANT',
        propertyId: property.id,
      },
    })
    console.log('Tenant user created:', tenant.email)

    // Create some sample maintenance requests
    console.log('Creating sample maintenance requests...')
    await prisma.maintenanceRequest.createMany({
      data: [
        {
          description: 'Leaking faucet in kitchen',
          priority: 'medium',
          status: 'pending',
          userId: tenant.id,
        },
        {
          description: 'AC not working properly',
          priority: 'high',
          status: 'in_progress',
          userId: tenant.id,
        },
      ],
    })
    console.log('Sample maintenance requests created')

    // Create some sample payments
    console.log('Creating sample payments...')
    await prisma.payment.createMany({
      data: [
        {
          amount: 1200.00,
          status: 'completed',
          userId: tenant.id,
        },
        {
          amount: 1200.00,
          status: 'pending',
          userId: tenant.id,
        },
      ],
    })
    console.log('Sample payments created')

    console.log('Database seed completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

