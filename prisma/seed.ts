import { SubscriptionTier } from '@prisma/client'
import { prisma } from '../src/shared/lib/prisma'

const createNode = (type: string, props: any, children: any[] = []) => ({
  id: crypto.randomUUID(),
  type,
  props,
  children,
});

function createTemplateTree(name: string, style: string, thumbnail: string) {
  let bgColor = "var(--paper)";
  let textColor = "var(--ink)";
  if (style.includes("Dark")) {
    bgColor = "var(--ink)";
    textColor = "var(--paper)";
  }

  const nodeTree = createNode("Container", { className: "min-h-screen", style: { backgroundColor: bgColor, color: textColor } }, [
    createNode("Section", { className: "py-20 text-center" }, [
      createNode("Heading", { level: 1, text: name, className: "text-5xl font-bold mb-6 font-display" }),
      createNode("Text", { text: `Welcome to the ${name} template. This is designed with a ${style} aesthetic.`, className: "text-xl mb-8 opacity-80 max-w-2xl mx-auto" }),
      createNode("Button", { text: "Get Started", className: "px-8 py-4 bg-[var(--signal)] text-white rounded-none" })
    ]),
    createNode("Section", { className: "py-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-8" }, [
      createNode("Container", { className: "p-6 border-2 border-[var(--line)] shadow-[4px_4px_0px_var(--line)]" }, [
        createNode("Heading", { level: 3, text: "Feature One", className: "text-xl font-bold mb-3" }),
        createNode("Text", { text: "Discover our amazing services tailored just for you." })
      ]),
      createNode("Container", { className: "p-6 border-2 border-[var(--line)] shadow-[4px_4px_0px_var(--line)]" }, [
        createNode("Heading", { level: 3, text: "Feature Two", className: "text-xl font-bold mb-3" }),
        createNode("Text", { text: "High quality and performance out of the box." })
      ]),
      createNode("Container", { className: "p-6 border-2 border-[var(--line)] shadow-[4px_4px_0px_var(--line)]" }, [
        createNode("Heading", { level: 3, text: "Feature Three", className: "text-xl font-bold mb-3" }),
        createNode("Text", { text: "Designed to help you grow your business rapidly." })
      ])
    ])
  ]);

  return {
    metadata: {
      version: 'v1.0.0',
      status: 'Published',
      thumbnail,
      description: `A beautifully crafted ${style} template for ${name}.`
    },
    pages: [
      {
        id: crypto.randomUUID(),
        slug: "/",
        title: "Home",
        order: 0,
        nodeTree
      }
    ],
    theme: {
      colors: {
        primary: "var(--signal)",
        background: bgColor,
        text: textColor,
      }
    }
  };
}

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

  // 2. Base Industries
  const industryNames = [
    'Restaurant', 'Coffee Shop', 'Agency', 'Consulting', 
    'E-Commerce', 'Salon', 'Real Estate', 'Fitness',
    'Healthcare', 'Education', 'Automotive', 'Travel', 'Creative'
  ]
  const industryMap: Record<string, string> = {}
  for (const name of industryNames) {
    const ind = await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    industryMap[name] = ind.id
  }
  console.log('✅ Industries seeded')

  // 3. Base Categories
  const categoryNames = ['Landing Page', 'Storefront', 'Portfolio', 'Corporate', 'Creative']
  const categoryMap: Record<string, string> = {}
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    categoryMap[name] = cat.id
  }
  console.log('✅ Categories seeded')

  // 4. Create Templates
  const templatesToCreate: Array<{name: string, industry: string, category: string, style: string, thumb: string, tier: SubscriptionTier}> = [
    // Restaurant
    { name: "Restaurant - Modern", industry: "Restaurant", category: "Landing Page", style: "Minimal", thumb: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Restaurant - Luxury", industry: "Restaurant", category: "Corporate", style: "Premium", thumb: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Restaurant - Dark", industry: "Restaurant", category: "Creative", style: "Dark", thumb: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Restaurant - Food Delivery", industry: "Restaurant", category: "Storefront", style: "Playful", thumb: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },
    { name: "Restaurant - Japanese", industry: "Restaurant", category: "Landing Page", style: "Zen", thumb: "https://images.unsplash.com/photo-1580828369668-450f61dcb241?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    
    // Coffee Shop
    { name: "Coffee Shop - Modern", industry: "Coffee Shop", category: "Landing Page", style: "Minimal", thumb: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Coffee Shop - Premium", industry: "Coffee Shop", category: "Storefront", style: "Premium", thumb: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Coffee Shop - Industrial", industry: "Coffee Shop", category: "Corporate", style: "Industrial", thumb: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Coffee Shop - Warm", industry: "Coffee Shop", category: "Creative", style: "Warm", thumb: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80", tier: "FREE" },

    // Agency
    { name: "Agency - Creative", industry: "Agency", category: "Creative", style: "Bold", thumb: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Agency - Dark", industry: "Agency", category: "Portfolio", style: "Dark", thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Agency - Corporate", industry: "Agency", category: "Corporate", style: "Minimal", thumb: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Agency - Minimal", industry: "Agency", category: "Landing Page", style: "Clean", thumb: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Agency - Editorial", industry: "Agency", category: "Portfolio", style: "Editorial", thumb: "https://images.unsplash.com/photo-1506784951209-42f299c50280?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // E-Commerce
    { name: "Store - Fashion", industry: "E-Commerce", category: "Storefront", style: "Editorial", thumb: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Store - Electronics", industry: "E-Commerce", category: "Storefront", style: "Tech", thumb: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },
    { name: "Store - Furniture", industry: "E-Commerce", category: "Storefront", style: "Minimal", thumb: "https://images.unsplash.com/photo-1505691938895-1758d7def515?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Store - Beauty", industry: "E-Commerce", category: "Storefront", style: "Soft", thumb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Store - Lifestyle", industry: "E-Commerce", category: "Storefront", style: "Vibrant", thumb: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80", tier: "FREE" },

    // Salon
    { name: "Beauty Studio", industry: "Salon", category: "Landing Page", style: "Elegant", thumb: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Hair Salon", industry: "Salon", category: "Corporate", style: "Modern", thumb: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Barber", industry: "Salon", category: "Creative", style: "Dark", thumb: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Spa", industry: "Salon", category: "Landing Page", style: "Zen", thumb: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Beauty Clinic", industry: "Salon", category: "Corporate", style: "Clean", thumb: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // Real Estate
    { name: "Property Agency", industry: "Real Estate", category: "Corporate", style: "Trust", thumb: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Luxury Property", industry: "Real Estate", category: "Landing Page", style: "Premium", thumb: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Apartment", industry: "Real Estate", category: "Landing Page", style: "Modern", thumb: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Real Estate Landing", industry: "Real Estate", category: "Landing Page", style: "Conversion", thumb: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // Fitness
    { name: "Gym Center", industry: "Fitness", category: "Landing Page", style: "Bold", thumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Personal Trainer", industry: "Fitness", category: "Portfolio", style: "Dynamic", thumb: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Fitness Studio", industry: "Fitness", category: "Corporate", style: "Modern", thumb: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Yoga", industry: "Fitness", category: "Landing Page", style: "Calm", thumb: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Sports Club", industry: "Fitness", category: "Corporate", style: "Energetic", thumb: "https://images.unsplash.com/photo-1526506114642-45e5d3156950?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // Healthcare
    { name: "General Clinic", industry: "Healthcare", category: "Corporate", style: "Clean", thumb: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Dental Clinic", industry: "Healthcare", category: "Landing Page", style: "Friendly", thumb: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Medical Center", industry: "Healthcare", category: "Corporate", style: "Trust", thumb: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Pharmacy", industry: "Healthcare", category: "Storefront", style: "Modern", thumb: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // Education
    { name: "Modern School", industry: "Education", category: "Corporate", style: "Academic", thumb: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Course Platform", industry: "Education", category: "Storefront", style: "Tech", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Training Center", industry: "Education", category: "Landing Page", style: "Dynamic", thumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "University", industry: "Education", category: "Corporate", style: "Traditional", thumb: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // Automotive
    { name: "Car Dealer", industry: "Automotive", category: "Storefront", style: "Premium", thumb: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Motorcycle Dealer", industry: "Automotive", category: "Storefront", style: "Dark", thumb: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Workshop", industry: "Automotive", category: "Corporate", style: "Industrial", thumb: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Car Rental", industry: "Automotive", category: "Landing Page", style: "Modern", thumb: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },

    // Travel
    { name: "Travel Agency", industry: "Travel", category: "Landing Page", style: "Vibrant", thumb: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Paradise Hotel", industry: "Travel", category: "Landing Page", style: "Premium", thumb: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Beach Resort", industry: "Travel", category: "Landing Page", style: "Relaxing", thumb: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80", tier: "ENTERPRISE" },
    { name: "Tour Package", industry: "Travel", category: "Storefront", style: "Adventure", thumb: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },

    // Creative
    { name: "Photographer", industry: "Creative", category: "Portfolio", style: "Minimal", thumb: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    { name: "Videographer", industry: "Creative", category: "Portfolio", style: "Dark", thumb: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Creative Studio", industry: "Creative", category: "Corporate", style: "Bold", thumb: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Artist Portfolio", industry: "Creative", category: "Portfolio", style: "Eclectic", thumb: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80", tier: "FREE" },
    
    // Additional Professional Services
    { name: "Law Firm", industry: "Consulting", category: "Corporate", style: "Trust", thumb: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80", tier: "PRO" },
    { name: "Accounting", industry: "Consulting", category: "Corporate", style: "Professional", thumb: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80", tier: "STARTER" },
    { name: "Software Company", industry: "Consulting", category: "Landing Page", style: "Tech", thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", tier: "BUSINESS" },
    { name: "Architecture", industry: "Consulting", category: "Portfolio", style: "Minimal", thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80", tier: "ENTERPRISE" },
  ]

  for (const t of templatesToCreate) {
    const defaultTree = createTemplateTree(t.name, t.style, t.thumb)
    
    await prisma.template.upsert({
      where: {
        // Find by name (upsert requires unique identifier, so we can use a combo or name if it was unique, but we don't have unique on name)
        // Wait, name is not unique in prisma schema for Template. 
        // We'll use findFirst to check if it exists, then update or create.
        id: 'dummy' // won't work if not unique
      } as any,
      update: {},
      create: {
        name: t.name,
        categoryId: categoryMap[t.category],
        industryId: industryMap[t.industry],
        requiredTier: t.tier,
        defaultTree: defaultTree as any
      },
    }).catch(async (e) => {
      // Manual fallback since name isn't @unique
      const existing = await prisma.template.findFirst({ where: { name: t.name } })
      if (existing) {
        await prisma.template.update({
          where: { id: existing.id },
          data: {
            requiredTier: t.tier,
            defaultTree: defaultTree as any,
            categoryId: categoryMap[t.category],
            industryId: industryMap[t.industry],
          }
        })
      } else {
        await prisma.template.create({
          data: {
            name: t.name,
            categoryId: categoryMap[t.category],
            industryId: industryMap[t.industry],
            requiredTier: t.tier,
            defaultTree: defaultTree as any
          }
        })
      }
    });
    
    console.log(`Processed template: ${t.name}`)
  }

  console.log(`🎉 Database seeding complete! Generated ${templatesToCreate.length} templates.`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
