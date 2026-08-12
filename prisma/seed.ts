import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  // 1. Create System Settings
  const settings = [
    { key: 'MAINTENANCE_MODE', value: 'false', description: 'Enable maintenance mode', isPublic: true },
    { key: 'ALLOW_REGISTRATION', value: 'true', description: 'Allow new user registration', isPublic: true },
    { key: 'MAX_FREE_SITES', value: '1', description: 'Max sites for free tier', isPublic: false }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ System Settings seeded')

  // 2. Create Base Industries
  const industries = ['SaaS', 'E-commerce', 'Portfolio', 'Agency', 'Restaurant']
  for (const name of industries) {
    await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('✅ Industries seeded')

  // 3. Create Base Categories
  const categories = ['Landing Page', 'Blog', 'Storefront', 'Dashboard']
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('✅ Categories seeded')

  console.log('🎉 Database seeding complete!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
