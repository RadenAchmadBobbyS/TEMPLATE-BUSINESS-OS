import { config } from 'dotenv';
config();
import { prisma } from '../src/shared/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

function generateId() {
  return uuidv4();
}

function buildRoot(children: any[]) {
  return {
    version: 1,
    root: {
      id: 'root',
      type: 'Container',
      props: { className: 'w-full min-h-screen p-0 m-0 max-w-full' },
      children,
    },
  };
}

async function main() {
  console.log('Seeding Categories, Industries, and Production-Ready Templates...');

  const catNames = [
    'Hotel / Travel',
    'Tour Package',
    'Corporate',
    'Workshop',
    'Automotive',
    'Fitness',
    'Restaurant',
    'Cafe',
    'Real Estate',
    'Agency',
    'SaaS',
    'Portfolio',
    'Education',
    'Clinic',
    'Beauty / Salon',
    'E-commerce',
    'Event',
    'Photography',
    'Construction',
    'Professional Services',
  ];

  const categories: Record<string, any> = {};
  for (const name of catNames) {
    categories[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const industryNames = [
    'Hospitality & Travel',
    'Business & Professional',
    'Retail & Commerce',
    'Health & Wellness',
    'Creative & Arts',
    'Automotive & Transport',
  ];
  const industries: Record<string, any> = {};
  for (const name of industryNames) {
    industries[name] = await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const templates = [
    // ==========================================
    // HOTEL / TRAVEL (STARTER TIER)
    // ==========================================
    {
      name: 'Boutique Hotel & Spa',
      categoryId: categories['Hotel / Travel'].id,
      industryId: industries['Hospitality & Travel'].id,
      requiredTier: 'STARTER',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail:
            'https://images.unsplash.com/photo-1542314831-c6a4d14db48f?q=80&w=600&auto=format&fit=crop',
          description:
            'A luxurious boutique hotel template with beautiful imagery and a booking CTA.',
        },
        pages: [
          {
            id: 'tpl-hotel-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { logoText: 'LUXE BOUTIQUE' },
                children: [],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-black text-white text-center py-32' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Experience True Luxury', level: 1, className: 'text-5xl mb-6' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Escape to a world of unparalleled comfort and elegance.',
                      className: 'mb-8',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Button',
                    props: { text: 'Book Your Stay', variant: 'default' },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16 bg-white' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'Our Amenities', level: 2, className: 'text-center mb-12' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Grid',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Feature',
                            props: {
                              title: 'Spa & Wellness',
                              description:
                                'Rejuvenate your body and mind in our award-winning spa.',
                              icon: '🌿',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Feature',
                            props: {
                              title: 'Fine Dining',
                              description:
                                'Experience culinary excellence crafted by master chefs.',
                              icon: '🍽️',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Feature',
                            props: {
                              title: 'Infinity Pool',
                              description: 'Relax by our rooftop pool with stunning city views.',
                              icon: '🏊',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Footer',
                props: { text: '© 2026 Luxe Boutique Hotel. All Rights Reserved.' },
                children: [],
              },
            ]),
          },
        ],
        theme: {
          colors: {
            primary: '0 0% 9%',
            background: '0 0% 100%',
            foreground: '0 0% 9%',
            card: '0 0% 100%',
            cardForeground: '0 0% 9%',
            border: '0 0% 89.8%',
          },
          typography: {
            fontFamily: 'Playfair Display, serif',
            headingFontFamily: 'Playfair Display, serif',
          },
          radius: '0rem',
        },
      },
    },
    // ==========================================
    // E-COMMERCE (PRO TIER)
    // ==========================================
    {
      name: 'Urban Fashion Store',
      categoryId: categories['E-commerce'].id,
      industryId: industries['Retail & Commerce'].id,
      requiredTier: 'PRO',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail:
            'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop',
          description: 'A modern e-commerce storefront with a dynamic CMS product list.',
        },
        cms: {
          models: [
            {
              id: 'cms-products',
              name: 'Products',
              schema: {
                fields: [
                  { name: 'title', type: 'string' },
                  { name: 'price', type: 'number' },
                  { name: 'image', type: 'string' },
                ],
              },
            },
          ],
          entries: [
            {
              modelId: 'cms-products',
              status: 'PUBLISHED',
              data: {
                title: 'Classic White Tee',
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400',
              },
            },
            {
              modelId: 'cms-products',
              status: 'PUBLISHED',
              data: {
                title: 'Denim Jacket',
                price: 89.99,
                image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400',
              },
            },
            {
              modelId: 'cms-products',
              status: 'PUBLISHED',
              data: {
                title: 'Leather Boots',
                price: 129.99,
                image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=400',
              },
            },
          ],
        },
        pages: [
          {
            id: 'tpl-store-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { logoText: 'URBAN OUTFITTERS' },
                children: [],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-zinc-100 py-24' },
                children: [
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'justify-center p-8' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { text: 'New Fall Collection', level: 1, className: 'text-5xl' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Discover the latest trends in urban fashion.' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Button',
                            props: { text: 'Shop Now' },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Image',
                        props: {
                          src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Featured Products', className: 'text-center mb-8' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'CmsList',
                    props: { modelId: 'cms-products', limit: 6 },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Footer',
                props: { text: '© 2026 Urban Fashion. All rights reserved.' },
                children: [],
              },
            ]),
          },
        ],
        theme: {
          colors: { primary: '222.2 47.4% 11.2%' },
          typography: { fontFamily: 'Inter, sans-serif' },
          radius: '0.5rem',
        },
      },
    },
    // ==========================================
    // CORPORATE (FREE TIER)
    // ==========================================
    {
      name: 'Apex Consulting Group',
      categoryId: categories['Corporate'].id,
      industryId: industries['Business & Professional'].id,
      requiredTier: 'FREE',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
          description:
            'A clean, professional corporate layout suitable for agencies and consulting firms.',
        },
        pages: [
          {
            id: 'tpl-corp-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { logoText: 'Apex Consulting' },
                children: [],
              },
              {
                id: generateId(),
                type: 'CTA',
                props: {
                  title: 'Accelerate Your Business Growth',
                  description:
                    'We provide strategic insights to help your company scale efficiently.',
                  buttonText: 'Contact Us',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Our Services', className: 'text-center mb-8' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { level: 3, text: 'Financial Advisory' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Expert financial planning and analysis.' },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { level: 3, text: 'Market Research' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'In-depth market trends and competitor analysis.' },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { level: 3, text: 'Operations Strategy' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Streamlining processes for maximum efficiency.' },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              { id: generateId(), type: 'Footer', props: {}, children: [] },
            ]),
          },
        ],
      },
    },
    // ==========================================
    // AUTOMOTIVE (BUSINESS TIER)
    // ==========================================
    {
      name: 'Velocity Motors',
      categoryId: categories['Automotive'].id,
      industryId: industries['Automotive & Transport'].id,
      requiredTier: 'BUSINESS',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail:
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop',
          description:
            'A high-performance template for car dealerships with dynamic inventory management.',
        },
        cms: {
          models: [
            {
              id: 'cms-vehicles',
              name: 'Vehicles',
              schema: {
                fields: [
                  { name: 'make', type: 'string' },
                  { name: 'model', type: 'string' },
                  { name: 'price', type: 'number' },
                  { name: 'image', type: 'string' },
                ],
              },
            },
          ],
          entries: [
            {
              modelId: 'cms-vehicles',
              status: 'PUBLISHED',
              data: {
                make: 'Porsche',
                model: '911 Carrera',
                price: 114000,
                image: 'https://images.unsplash.com/photo-1503376762364-53bede51221b?q=80&w=400',
              },
            },
            {
              modelId: 'cms-vehicles',
              status: 'PUBLISHED',
              data: {
                make: 'Audi',
                model: 'R8 V10',
                price: 158000,
                image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400',
              },
            },
            {
              modelId: 'cms-vehicles',
              status: 'PUBLISHED',
              data: {
                make: 'BMW',
                model: 'M4 Competition',
                price: 78000,
                image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=400',
              },
            },
          ],
        },
        pages: [
          {
            id: 'tpl-auto-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { logoText: 'Velocity Motors' },
                children: [],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-slate-900 text-white py-32 text-center' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Drive Your Dream',
                      level: 1,
                      className: 'text-6xl mb-4 text-white',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Explore our premium selection of luxury and performance vehicles.',
                      className: 'text-slate-300 mb-8',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Button',
                    props: { text: 'View Inventory', variant: 'outline' },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16 bg-slate-50' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Featured Inventory', className: 'text-center mb-8' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'CmsList',
                    props: { modelId: 'cms-vehicles', limit: 3 },
                    children: [],
                  },
                ],
              },
              { id: generateId(), type: 'Footer', props: {}, children: [] },
            ]),
          },
        ],
      },
    },
    // ==========================================
    // RESTAURANT (STARTER TIER)
    // ==========================================
    {
      name: 'Rustic Hearth Cafe',
      categoryId: categories['Restaurant'].id,
      industryId: industries['Hospitality & Travel'].id,
      requiredTier: 'STARTER',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail:
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
          description:
            'A cozy template for cafes and restaurants featuring a menu section and warm tones.',
        },
        pages: [
          {
            id: 'tpl-rest-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { logoText: 'Rustic Hearth' },
                children: [],
              },
              {
                id: generateId(),
                type: 'Section',
                props: {
                  className:
                    'bg-[url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200)] bg-cover bg-center py-40 text-center relative',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Farm to Table Excellence',
                      level: 1,
                      className: 'text-5xl text-white drop-shadow-md mb-4',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Button',
                    props: { text: 'View Menu', variant: 'default' },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Our Specialties', className: 'text-center mb-8' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Image',
                            props: {
                              src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { level: 3, text: 'Artisan Pasta', className: 'mt-4' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Handmade daily with local ingredients.' },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Image',
                            props: {
                              src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { level: 3, text: 'Wood-fired Pizza', className: 'mt-4' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Authentic Neapolitan style.' },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            id: generateId(),
                            type: 'Image',
                            props: {
                              src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=400',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: { level: 3, text: 'Seasonal Salad', className: 'mt-4' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Fresh greens from our own garden.' },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              { id: generateId(), type: 'Footer', props: {}, children: [] },
            ]),
          },
        ],
        theme: {
          colors: { primary: '24.6 95% 53.1%' },
          typography: { fontFamily: 'Lora, serif', headingFontFamily: 'Lora, serif' },
        },
      },
    },
    // ==========================================
    // AGENCY (PRO TIER)
    // ==========================================
    {
      name: 'Neon Creative Agency',
      categoryId: categories['Agency'].id,
      industryId: industries['Creative & Arts'].id,
      requiredTier: 'PRO',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail:
            'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=600&auto=format&fit=crop',
          description:
            'A vibrant, high-energy template for creative agencies showcasing portfolios.',
        },
        pages: [
          {
            id: 'tpl-agency-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { logoText: 'NEON CREATIVE' },
                children: [],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-black text-white py-32' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'We Build Digital Experiences',
                          level: 1,
                          className:
                            'text-6xl mb-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Award-winning design and development for forward-thinking brands.',
                          className: 'text-xl mb-8 text-gray-400',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: { text: 'View Our Work', variant: 'default' },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16 bg-gray-900' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Our Services', className: 'text-center mb-12 text-white' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Brand Identity',
                          description: 'Logos, guidelines, and visual systems.',
                          icon: '🎨',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Web Development',
                          description: 'Fast, responsive, and scalable applications.',
                          icon: '💻',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Marketing Strategy',
                          description: 'Data-driven campaigns that convert.',
                          icon: '📈',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              { id: generateId(), type: 'Footer', props: {}, children: [] },
            ]),
          },
        ],
        theme: {
          colors: {
            primary: '271.5 81.3% 55.9%',
            background: '0 0% 0%',
            foreground: '0 0% 100%',
            card: '240 10% 3.9%',
            cardForeground: '0 0% 98%',
            border: '240 3.7% 15.9%',
          },
          typography: { fontFamily: 'Inter, sans-serif' },
        },
      },
    },
  ];

  for (const tpl of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: tpl.name },
    });

    const slug = tpl.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!existing) {
      await prisma.template.create({
        data: {
          name: tpl.name,
          slug: slug,
          categoryId: tpl.categoryId,
          industryId: tpl.industryId,
          defaultTree: tpl.defaultTree,
          requiredTier: tpl.requiredTier as any,
        },
      });
      console.log(`Created template: ${tpl.name}`);
    } else {
      await prisma.template.update({
        where: { id: existing.id },
        data: {
          defaultTree: tpl.defaultTree,
          categoryId: tpl.categoryId,
          industryId: tpl.industryId,
          requiredTier: tpl.requiredTier as any,
          slug: slug,
        },
      });
      console.log(`Updated template: ${tpl.name}`);
    }
  }

  // Remove old test templates that don't match the new naming conventions if they exist, to clean up.
  await prisma.template.deleteMany({
    where: {
      name: {
        in: ['Modern Restaurant', 'Chic Coffee Shop'],
      },
    },
  });

  console.log('Templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
