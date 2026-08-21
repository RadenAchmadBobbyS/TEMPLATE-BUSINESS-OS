import { config } from 'dotenv';
config();
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
      props: { className: 'w-full min-h-screen p-0 m-0 max-w-full font-sans' },
      children,
    },
  };
}

async function main() {
  const { prisma } = await import('../src/shared/lib/prisma');
  console.log('Seeding Categories, Industries, and Differentiated Templates...');

  const catNames = [
    'Hotel / Travel', 'Tour Package', 'Corporate', 'Workshop',
    'Automotive', 'Fitness', 'Restaurant', 'Cafe', 'Real Estate',
    'Agency', 'SaaS', 'Portfolio', 'Education', 'Clinic',
    'Beauty / Salon', 'E-commerce', 'Event', 'Photography',
    'Construction', 'Professional Services'
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
    'Hospitality & Travel', 'Business & Professional',
    'Retail & Commerce', 'Health & Wellness',
    'Creative & Arts', 'Automotive & Transport'
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
    // 1. FREE TIER - "Apex Consulting Group"
    // Visual Direction: Clean, minimal, trustworthy, editorial.
    // Component Polish: Standard semantic tokens, grid-cols-1 md:grid-cols-3
    // ==========================================
    {
      name: 'Apex Consulting Group',
      categoryId: categories['Corporate'].id,
      industryId: industries['Business & Professional'].id,
      requiredTier: 'FREE',
      defaultTree: {
        metadata: {
          version: '1.1',
          status: 'PUBLISHED',
          thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
          description: 'A clean, professional corporate layout suitable for agencies and consulting firms. Minimalistic and highly trustworthy.',
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
                props: { logoText: 'Apex Consulting', className: 'py-4 border-b border-border bg-background text-foreground' },
                children: []
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-muted py-24 md:py-32' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'text-center max-w-3xl mx-auto px-6 md:px-8' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'Strategic Insights for Modern Enterprises', level: 1, className: 'text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'We deliver comprehensive financial strategies and operational frameworks designed to optimize liquidity, drive sustainable growth, and mitigate risk for mid-market organizations.', className: 'text-base md:text-xl text-muted-foreground mb-8 md:mb-10 leading-relaxed' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: { text: 'Schedule a Consultation', variant: 'default', className: 'bg-primary text-primary-foreground rounded-md px-8 py-4 font-medium hover:opacity-90' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 bg-background' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Core Capabilities', className: 'text-center mb-12 md:mb-16 text-3xl md:text-4xl font-semibold text-foreground' },
                    children: []
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 max-w-7xl mx-auto' },
                    children: [
                      {
                        id: generateId(), type: 'Card', props: { className: 'border border-border shadow-sm rounded-lg p-6 md:p-8 bg-card text-card-foreground flex flex-col items-start' }, children: [
                          { id: generateId(), type: 'Heading', props: { level: 3, text: 'Financial Restructuring', className: 'text-lg md:text-xl mb-3 font-medium text-foreground' }, children: [] },
                          { id: generateId(), type: 'Text', props: { text: 'In-depth capital structure analysis and debt realignment to improve cash flow and organizational resilience.', className: 'text-muted-foreground leading-relaxed text-sm md:text-base' }, children: [] }
                        ]
                      },
                      {
                        id: generateId(), type: 'Card', props: { className: 'border border-border shadow-sm rounded-lg p-6 md:p-8 bg-card text-card-foreground flex flex-col items-start' }, children: [
                          { id: generateId(), type: 'Heading', props: { level: 3, text: 'Market Expansion', className: 'text-lg md:text-xl mb-3 font-medium text-foreground' }, children: [] },
                          { id: generateId(), type: 'Text', props: { text: 'Data-driven competitor analysis and go-to-market strategies tailored for aggressive international growth.', className: 'text-muted-foreground leading-relaxed text-sm md:text-base' }, children: [] }
                        ]
                      },
                      {
                        id: generateId(), type: 'Card', props: { className: 'border border-border shadow-sm rounded-lg p-6 md:p-8 bg-card text-card-foreground flex flex-col items-start' }, children: [
                          { id: generateId(), type: 'Heading', props: { level: 3, text: 'M&A Advisory', className: 'text-lg md:text-xl mb-3 font-medium text-foreground' }, children: [] },
                          { id: generateId(), type: 'Text', props: { text: 'End-to-end support for mergers and acquisitions, from initial due diligence to post-merger integration planning.', className: 'text-muted-foreground leading-relaxed text-sm md:text-base' }, children: [] }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'CTA',
                props: { title: 'Ready to Transform Your Business?', description: 'Schedule a free consultation with our strategy team today.', buttonText: 'Get Started', className: 'py-20 md:py-24 m-0 rounded-none border-t border-border bg-background' },
                children: []
              },
              { id: generateId(), type: 'Footer', props: { text: '© 2026 Apex Consulting Group. All rights reserved.', className: 'bg-muted border-t border-border text-muted-foreground py-12 text-sm px-6 md:px-8' }, children: [] }
            ])
          }
        ],
        theme: {
          typography: { fontFamily: 'Inter, sans-serif' },
          radius: '0.25rem'
        }
      }
    },

    // ==========================================
    // 2. STARTER TIER - "Rustic Hearth Cafe"
    // Visual Direction: Warm, photographic, hospitality-focused.
    // Component Polish: Standard semantic tokens configured for a warm look.
    // ==========================================
    {
      name: 'Rustic Hearth Cafe',
      categoryId: categories['Restaurant'].id,
      industryId: industries['Hospitality & Travel'].id,
      requiredTier: 'STARTER',
      defaultTree: {
        metadata: {
          version: '1.1',
          status: 'PUBLISHED',
          thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
          description: 'A cozy template for cafes and restaurants featuring a warm color palette, soft styling, and photographic focus.',
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
                props: { 
                  logoText: 'Rustic Hearth', 
                  className: 'py-4 bg-background text-foreground border-b border-border',
                  links: [
                    { label: 'Menu', href: '#' },
                    { label: 'Reservations', href: '#' },
                    { label: 'Our Story', href: '#' },
                    { label: 'Contact', href: '#' }
                  ]
                },
                children: []
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-[url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200)] bg-cover bg-center py-32 md:py-48 relative before:content-[""] before:absolute before:inset-0 before:bg-black/60' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'text-center relative z-10 px-6 md:px-8' },
                    children: [
                       {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'Farm to Table Excellence', level: 1, className: 'text-4xl md:text-6xl text-white mb-6 font-serif tracking-wide drop-shadow-lg' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'Locally sourced ingredients, prepared with love and served in a warm, inviting atmosphere.', className: 'text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: { text: 'Reserve Your Table', variant: 'default', className: 'bg-primary text-primary-foreground rounded-full px-8 py-4 text-lg font-medium border-0 hover:opacity-90' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-background py-16 border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 max-w-7xl mx-auto text-center' },
                    children: [
                      { id: generateId(), type: 'Feature', props: { title: 'Farm Fresh', description: 'Partnering exclusively with sustainable farms within a 50-mile radius.', icon: '🌿', className: 'p-6 items-center flex flex-col text-center' }, children: [] },
                      { id: generateId(), type: 'Feature', props: { title: 'Wood Fired', description: 'Artisan baking and roasting using oak and hickory for authentic flavor.', icon: '🔥', className: 'p-6 items-center flex flex-col text-center' }, children: [] },
                      { id: generateId(), type: 'Feature', props: { title: 'Award Winning', description: 'Recognized by Culinary Digest for our innovative seasonal menus.', icon: '⭐', className: 'p-6 items-center flex flex-col text-center' }, children: [] }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-muted' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Our Culinary Signatures', className: 'text-center mb-16 text-3xl md:text-4xl font-serif text-foreground' },
                    children: []
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 max-w-7xl mx-auto mb-12' },
                    children: [
                      {
                        id: generateId(), type: 'Card', props: { className: 'border border-border shadow-md bg-card rounded-2xl overflow-hidden p-0 flex flex-col transition-transform hover:-translate-y-1' }, children: [
                          { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400', className: 'w-full h-56 object-cover rounded-none' }, children: [] },
                          { id: generateId(), type: 'Stack', props: { className: 'p-6 md:p-8 flex-1' }, children: [
                            { id: generateId(), type: 'Heading', props: { level: 3, text: 'Artisan Truffle Pasta', className: 'text-xl font-serif text-primary mb-2' }, children: [] },
                            { id: generateId(), type: 'Text', props: { text: 'Handcrafted linguine tossed in a rich black truffle cream sauce, finished with aged Parmigiano-Reggiano and fresh parsley.', className: 'text-muted-foreground text-sm leading-relaxed' }, children: [] }
                          ]}
                        ]
                      },
                      {
                        id: generateId(), type: 'Card', props: { className: 'border border-border shadow-md bg-card rounded-2xl overflow-hidden p-0 flex flex-col transition-transform hover:-translate-y-1' }, children: [
                          { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400', className: 'w-full h-56 object-cover rounded-none' }, children: [] },
                          { id: generateId(), type: 'Stack', props: { className: 'p-6 md:p-8 flex-1' }, children: [
                            { id: generateId(), type: 'Heading', props: { level: 3, text: 'Wood-fired Margherita', className: 'text-xl font-serif text-primary mb-2' }, children: [] },
                            { id: generateId(), type: 'Text', props: { text: 'Authentic Neapolitan style pizza with San Marzano tomatoes, fresh buffalo mozzarella, and aromatic basil leaves.', className: 'text-muted-foreground text-sm leading-relaxed' }, children: [] }
                          ]}
                        ]
                      },
                      {
                        id: generateId(), type: 'Card', props: { className: 'border border-border shadow-md bg-card rounded-2xl overflow-hidden p-0 flex flex-col transition-transform hover:-translate-y-1' }, children: [
                          { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=400', className: 'w-full h-56 object-cover rounded-none' }, children: [] },
                          { id: generateId(), type: 'Stack', props: { className: 'p-6 md:p-8 flex-1' }, children: [
                            { id: generateId(), type: 'Heading', props: { level: 3, text: 'Burrata & Fig Salad', className: 'text-xl font-serif text-primary mb-2' }, children: [] },
                            { id: generateId(), type: 'Text', props: { text: 'Creamy local burrata with organic figs, baby arugula, candied walnuts, and a balsamic glaze reduction.', className: 'text-muted-foreground text-sm leading-relaxed' }, children: [] }
                          ]}
                        ]
                      }
                    ]
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'text-center' },
                    children: [
                      { id: generateId(), type: 'Button', props: { text: 'View Full Menu', variant: 'outline', className: 'border-primary text-primary rounded-full px-8 py-3 font-medium hover:bg-primary hover:text-primary-foreground' }, children: [] }
                    ]
                  }
                ]
              },
              {
                 id: generateId(),
                 type: 'Section',
                 props: { className: 'py-24 md:py-32 bg-background px-6 md:px-8' },
                 children: [
                   {
                     id: generateId(),
                     type: 'Columns',
                     props: { className: 'flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto' },
                     children: [
                       {
                         id: generateId(),
                         type: 'Image',
                         props: { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600', className: 'rounded-2xl shadow-xl w-full md:w-1/2 object-cover aspect-square' },
                         children: []
                       },
                       {
                         id: generateId(),
                         type: 'Stack',
                         props: { className: 'p-4 md:p-8 w-full md:w-1/2' },
                         children: [
                           { id: generateId(), type: 'Heading', props: { text: 'Our Philosophy', level: 2, className: 'font-serif text-3xl md:text-5xl text-foreground mb-6' }, children: [] },
                           { id: generateId(), type: 'Divider', props: { className: 'w-16 border-primary border-t-2 mb-6 ml-0' }, children: [] },
                           { id: generateId(), type: 'Text', props: { text: 'Since 1992, Rustic Hearth has been committed to bringing the community together around the dining table. We believe that good food starts with great ingredients, which is why we partner exclusively with sustainable farms within a 50-mile radius.', className: 'text-muted-foreground text-lg leading-relaxed mb-6' }, children: [] },
                           { id: generateId(), type: 'Button', props: { text: 'Discover Our Story', variant: 'outline', className: 'rounded-full border-foreground text-foreground self-start px-6' }, children: [] }
                         ]
                       }
                     ]
                   }
                 ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 bg-muted border-y border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'The Ambiance', className: 'text-center mb-12 text-3xl md:text-4xl font-serif text-foreground' },
                    children: []
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 max-w-7xl mx-auto' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400', className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm' }, children: [] },
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1466978913421-bac2e5e42729?q=80&w=400', className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm' }, children: [] },
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400', className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm' }, children: [] },
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=400', className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm' }, children: [] }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'CTA',
                props: { title: 'Join Us for Dinner', description: 'Experience the warmth of Rustic Hearth tonight. Walk-ins welcome, reservations recommended.', buttonText: 'Find a Table', className: 'bg-primary text-primary-foreground rounded-none py-20 md:py-24 m-0' },
                children: []
              },
              { id: generateId(), type: 'Footer', props: { text: '© 2026 Rustic Hearth Cafe. 123 Main St. | (555) 123-4567', className: 'bg-background border-t border-border text-muted-foreground py-12 px-6 md:px-8' }, children: [] }
            ])
          }
        ],
        theme: {
          colors: { primary: '32 80% 50%' },
          typography: { fontFamily: 'Lora, serif', headingFontFamily: 'Lora, serif' },
          radius: '1rem'
        }
      }
    },

    // ==========================================
    // 3. PRO TIER - "Neon Creative Agency"
    // Visual Direction: Bold, expressive, creative, dark mode.
    // Component Polish: Relies on semantic tokens. We'll set the primary to a vibrant color. 
    // Uses dark mode gracefully without hardcoding `bg-black`.
    // ==========================================
    {
      name: 'Neon Creative Agency',
      categoryId: categories['Agency'].id,
      industryId: industries['Creative & Arts'].id,
      requiredTier: 'PRO',
      defaultTree: {
        metadata: {
          version: '1.1',
          status: 'PUBLISHED',
          thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=600&auto=format&fit=crop',
          description: 'A vibrant, high-energy template for creative agencies showcasing portfolios using CMS with premium styling.',
        },
        cms: {
          models: [
            {
              id: 'cms-projects',
              name: 'Projects',
              schema: {
                fields: [
                  { name: 'title', type: 'string' },
                  { name: 'category', type: 'string' },
                  { name: 'image', type: 'string' }
                ]
              }
            }
          ],
          entries: [
            { modelId: 'cms-projects', status: 'PUBLISHED', data: { title: 'Fintech Mobile Redesign', category: 'UX/UI Design', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400' } },
            { modelId: 'cms-projects', status: 'PUBLISHED', data: { title: 'Synthwave Branding', category: 'Visual Identity', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400' } },
            { modelId: 'cms-projects', status: 'PUBLISHED', data: { title: 'Echo E-commerce Platform', category: 'Web Development', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400' } },
          ]
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
                props: { 
                  logoText: 'NEON', 
                  className: 'bg-background text-foreground border-b border-border font-bold tracking-widest py-6',
                  links: [
                    { label: 'Work', href: '#' },
                    { label: 'Agency', href: '#' },
                    { label: 'Services', href: '#' },
                    { label: 'Contact', href: '#' }
                  ]
                },
                children: []
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-background text-foreground py-24 md:py-40 border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'text-center px-4 max-w-6xl mx-auto' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'DIGITAL STRATEGY & BRANDING', level: 6, className: 'text-primary tracking-[0.2em] font-bold text-sm md:text-base mb-6 uppercase' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'We Engineer Digital Experiences That Disrupt Markets.',
                          level: 1,
                          className: 'text-5xl md:text-8xl mb-8 font-black leading-[1.1] md:leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500'
                        },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'Neon is a multi-disciplinary creative agency focused on branding, immersive web development, and digital strategy for forward-thinking brands.', className: 'text-lg md:text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: { text: 'View Selected Work', variant: 'default', className: 'bg-foreground text-background hover:scale-105 border-0 py-6 px-10 text-lg rounded-none font-bold shadow-[0_10px_40px_rgba(217,70,239,0.2)] transition-all' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-muted text-foreground border-b border-border px-4 md:px-8' },
                children: [
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: { className: 'flex-col lg:flex-row gap-12 lg:gap-16 max-w-7xl mx-auto' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'w-full lg:w-1/3' },
                        children: [
                          { id: generateId(), type: 'Heading', props: { text: 'Our Capabilities', className: 'text-4xl md:text-5xl font-bold mb-4 text-foreground' }, children: [] },
                          { id: generateId(), type: 'Text', props: { text: 'We combine bold creative direction with robust technical execution to deliver measurable impact.', className: 'text-muted-foreground text-lg leading-relaxed' }, children: [] }
                        ]
                      },
                      {
                        id: generateId(),
                        type: 'Grid',
                        props: { className: 'w-full lg:w-2/3 grid-cols-1 md:grid-cols-2 gap-6 md:gap-8' },
                        children: [
                          { id: generateId(), type: 'Feature', props: { title: 'Brand Identity', description: 'Comprehensive visual systems, voice definition, and market positioning that cuts through the noise.', icon: '✧', className: 'bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'Web Development', description: 'High-performance React/Next.js architectures paired with award-winning animations.', icon: '✦', className: 'bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'UX/UI Design', description: 'User-centric interfaces optimized for conversion and frictionless journeys across all devices.', icon: '✺', className: 'bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'Performance Marketing', description: 'Data-driven campaigns integrating SEO, paid media, and highly targeted creative assets.', icon: '✹', className: 'bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors' }, children: [] }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'The Process', className: 'text-center mb-20 text-4xl md:text-5xl font-bold text-foreground' },
                    children: []
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto' },
                    children: [
                      { id: generateId(), type: 'Stack', props: { className: 'text-left border-t border-border pt-8' }, children: [ { id: generateId(), type: 'Heading', props: { text: '01', className: 'text-4xl font-black text-primary mb-4 opacity-70' }, children: [] }, { id: generateId(), type: 'Heading', props: { level: 3, text: 'Discovery', className: 'text-2xl font-bold mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Deep dive into market positioning', className: 'text-muted-foreground' }, children: [] } ] },
                      { id: generateId(), type: 'Stack', props: { className: 'text-left border-t border-border pt-8' }, children: [ { id: generateId(), type: 'Heading', props: { text: '02', className: 'text-4xl font-black text-primary mb-4 opacity-70' }, children: [] }, { id: generateId(), type: 'Heading', props: { level: 3, text: 'Strategy', className: 'text-2xl font-bold mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Defining the creative roadmap', className: 'text-muted-foreground' }, children: [] } ] },
                      { id: generateId(), type: 'Stack', props: { className: 'text-left border-t border-border pt-8' }, children: [ { id: generateId(), type: 'Heading', props: { text: '03', className: 'text-4xl font-black text-primary mb-4 opacity-70' }, children: [] }, { id: generateId(), type: 'Heading', props: { level: 3, text: 'Execution', className: 'text-2xl font-bold mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Pixel-perfect development', className: 'text-muted-foreground' }, children: [] } ] },
                      { id: generateId(), type: 'Stack', props: { className: 'text-left border-t border-border pt-8' }, children: [ { id: generateId(), type: 'Heading', props: { text: '04', className: 'text-4xl font-black text-primary mb-4 opacity-70' }, children: [] }, { id: generateId(), type: 'Heading', props: { level: 3, text: 'Launch', className: 'text-2xl font-bold mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Deployment & optimization', className: 'text-muted-foreground' }, children: [] } ] }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-muted px-4 md:px-8 border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { text: 'Selected Works', className: 'text-center mb-16 text-4xl md:text-5xl text-foreground font-bold tracking-tight' },
                    children: []
                  },
                  {
                    id: generateId(),
                    type: 'CmsList',
                    props: { modelId: 'cms-projects', limit: 6, className: 'max-w-7xl mx-auto border-0 bg-transparent p-0' },
                    children: []
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'text-center mt-12' },
                    children: [
                      { id: generateId(), type: 'Button', props: { text: 'View All Projects', variant: 'outline', className: 'rounded-none border-foreground text-foreground px-8 py-6' }, children: [] }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'max-w-4xl mx-auto text-center' },
                    children: [
                      { id: generateId(), type: 'Heading', props: { text: 'Client Testimonial', className: 'text-primary mb-8 text-sm tracking-widest font-bold uppercase' }, children: [] },
                      { id: generateId(), type: 'Heading', props: { text: '"Neon completely revolutionized our digital presence. Our conversion rate doubled within the first month of launch. Absolutely phenomenal work."', className: 'text-3xl md:text-5xl text-foreground font-light leading-tight mb-12 italic' }, children: [] },
                      { id: generateId(), type: 'Divider', props: { className: 'w-24 border-primary border-t-2 mx-auto mb-8' }, children: [] },
                      { id: generateId(), type: 'Stack', props: { className: 'items-center gap-4' }, children: [
                        { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', className: 'w-16 h-16 rounded-full object-cover' }, children: [] },
                        { id: generateId(), type: 'Text', props: { text: 'Sarah Jenkins, CMO at FintechGlobal', className: 'text-muted-foreground font-medium uppercase tracking-widest text-sm' }, children: [] }
                      ]}
                    ]
                  }
                ]
              },
              {
                 id: generateId(),
                 type: 'CTA',
                 props: { title: 'Ready to disrupt your industry?', description: 'Let\'s talk about your next big idea. Our strategy team is ready to analyze your market position.', buttonText: 'Start a Project', className: 'bg-foreground text-background py-24 md:py-32 m-0 rounded-none border-none' },
                 children: []
              },
              { id: generateId(), type: 'Footer', props: { text: '© 2026 Neon Creative Agency. Tokyo | Los Angeles | London', className: 'bg-background border-t border-border text-muted-foreground py-16 px-6 md:px-8' }, children: [] }
            ])
          }
        ],
        theme: {
          colors: {
            primary: '300 70% 50%'
          },
          typography: { fontFamily: 'Inter, sans-serif' },
          radius: '0'
        }
      }
    },

    // ==========================================
    // 4. BUSINESS TIER - "Velocity Motors"
    // Visual Direction: Technical, premium, highly structured, enterprise-grade.
    // Component Polish: Bento box layouts, dense but organized, semantic classes, sharp borders.
    // Sections: 9-12 (Navbar, Hero, Stats, Inspection, Showroom, Service, Features, Testimonials, CTA, Footer)
    // ==========================================
    {
      name: 'Velocity Motors',
      categoryId: categories['Automotive'].id,
      industryId: industries['Automotive & Transport'].id,
      requiredTier: 'BUSINESS',
      defaultTree: {
        metadata: {
          version: '1.1',
          status: 'PUBLISHED',
          thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop',
          description: 'An enterprise-grade, structured template for large dealerships with dynamic inventory, advanced metrics, and a highly polished technical aesthetic.',
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
                  { name: 'specs', type: 'string' }
                ]
              }
            }
          ],
          entries: [
            { modelId: 'cms-vehicles', status: 'PUBLISHED', data: { make: 'Porsche', model: '911 Carrera S', price: 134000, specs: '3.0L Twin-Turbo Flat-6 | 443 HP', image: 'https://images.unsplash.com/photo-1503376762364-53bede51221b?q=80&w=400' } },
            { modelId: 'cms-vehicles', status: 'PUBLISHED', data: { make: 'Audi', model: 'R8 V10 Performance', price: 208000, specs: '5.2L Naturally Aspirated V10 | 602 HP', image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400' } },
            { modelId: 'cms-vehicles', status: 'PUBLISHED', data: { make: 'BMW', model: 'M4 Competition xDrive', price: 88000, specs: '3.0L Twin-Turbo Inline-6 | 503 HP', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=400' } },
            { modelId: 'cms-vehicles', status: 'PUBLISHED', data: { make: 'Mercedes-Benz', model: 'AMG GT 63', price: 162000, specs: '4.0L Biturbo V8 | 577 HP', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=400' } }
          ]
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
                props: { 
                  logoText: 'VELOCITY MOTORS //', 
                  className: 'py-5 bg-background border-b border-border tracking-widest font-bold text-foreground px-4 md:px-8',
                  links: [
                    { label: 'Inventory', href: '#' },
                    { label: 'Certified Pre-Owned', href: '#' },
                    { label: 'Leasing & Finance', href: '#' },
                    { label: 'Service Center', href: '#' },
                    { label: 'About Us', href: '#' }
                  ]
                },
                children: []
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-background text-foreground py-32 md:py-48 text-center bg-[url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200)] bg-cover bg-center bg-blend-overlay bg-black/80' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'px-4' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'AUTHORIZED PREMIUM DEALERSHIP', level: 6, className: 'text-primary tracking-[0.2em] font-bold text-xs md:text-sm mb-6 uppercase border border-primary/30 inline-block px-4 py-2 bg-black/40 backdrop-blur-sm' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'Engineered for Perfection.', level: 1, className: 'text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase text-white drop-shadow-2xl' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'Explore our curated selection of high-performance and luxury vehicles. Every model in our inventory represents the pinnacle of automotive engineering.', className: 'text-white/90 mb-12 text-lg md:text-2xl max-w-4xl mx-auto font-light leading-relaxed drop-shadow-md' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Columns',
                        props: { className: 'justify-center gap-4 flex-col sm:flex-row max-w-lg mx-auto' },
                        children: [
                          { id: generateId(), type: 'Button', props: { text: 'Browse Inventory', variant: 'default', className: 'w-full bg-primary text-primary-foreground rounded-none px-10 py-6 text-sm tracking-widest uppercase font-bold hover:bg-primary/90' }, children: [] },
                          { id: generateId(), type: 'Button', props: { text: 'Value Your Trade', variant: 'outline', className: 'w-full bg-transparent border-2 border-white text-white rounded-none px-10 py-6 text-sm tracking-widest uppercase font-bold hover:bg-white hover:text-black' }, children: [] }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-0 bg-card text-card-foreground border-b border-border shadow-sm relative z-10' },
                children: [
                   {
                     id: generateId(),
                     type: 'Columns',
                     props: { className: 'flex-col md:flex-row text-center divide-y md:divide-y-0 md:divide-x divide-border' },
                     children: [
                       { id: generateId(), type: 'Stack', props: { className: 'w-full py-12 px-4' }, children: [ { id: generateId(), type: 'Heading', props: { text: '500+', className: 'text-4xl md:text-5xl font-light mb-2 text-primary' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Premium Vehicles Delivered', className: 'text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-bold' }, children: [] } ] },
                       { id: generateId(), type: 'Stack', props: { className: 'w-full py-12 px-4 bg-muted/30' }, children: [ { id: generateId(), type: 'Heading', props: { text: '150-Pt', className: 'text-4xl md:text-5xl font-light mb-2 text-primary' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Rigorous Inspection Standard', className: 'text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-bold' }, children: [] } ] },
                       { id: generateId(), type: 'Stack', props: { className: 'w-full py-12 px-4' }, children: [ { id: generateId(), type: 'Heading', props: { text: '24/7', className: 'text-4xl md:text-5xl font-light mb-2 text-primary' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Concierge Client Support', className: 'text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-bold' }, children: [] } ] }
                     ]
                   }
                ]
              },
              {
                 id: generateId(),
                 type: 'Section',
                 props: { className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border' },
                 children: [
                   {
                     id: generateId(),
                     type: 'Columns',
                     props: { className: 'flex-col md:flex-row items-center gap-12 md:gap-16 max-w-7xl mx-auto' },
                     children: [
                       {
                         id: generateId(),
                         type: 'Stack',
                         props: { className: 'flex-1 w-full md:w-1/2' },
                         children: [
                           { id: generateId(), type: 'Heading', props: { text: 'Uncompromising Quality Standards', className: 'text-3xl md:text-5xl font-black mb-6 text-foreground tracking-tight uppercase' }, children: [] },
                           { id: generateId(), type: 'Text', props: { text: 'Every vehicle in our showroom is meticulously inspected and certified by our master technicians. We utilize state-of-the-art diagnostic equipment to ensure that performance meets factory specifications.', className: 'text-base md:text-lg text-muted-foreground mb-8 leading-relaxed' }, children: [] },
                           { id: generateId(), type: 'Grid', props: { className: 'grid-cols-1 sm:grid-cols-2 gap-4 mb-10' }, children: [
                             { id: generateId(), type: 'Text', props: { text: '✓ 150-Point Inspection', className: 'font-bold text-sm uppercase tracking-wider' }, children: [] },
                             { id: generateId(), type: 'Text', props: { text: '✓ Factory Certified Technicians', className: 'font-bold text-sm uppercase tracking-wider' }, children: [] },
                             { id: generateId(), type: 'Text', props: { text: '✓ Clean CARFAX Guarantee', className: 'font-bold text-sm uppercase tracking-wider' }, children: [] },
                             { id: generateId(), type: 'Text', props: { text: '✓ 12-Month Comprehensive Warranty', className: 'font-bold text-sm uppercase tracking-wider' }, children: [] }
                           ]},
                           { id: generateId(), type: 'Button', props: { text: 'Read Our Certification Process', variant: 'outline', className: 'self-start rounded-none border-2 border-foreground text-foreground font-bold uppercase tracking-wider text-xs px-8 py-5 hover:bg-foreground hover:text-background transition-colors' }, children: [] }
                         ]
                       },
                       {
                         id: generateId(),
                         type: 'Image',
                         props: { src: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=800', className: 'flex-1 w-full md:w-1/2 rounded-none shadow-2xl border border-border' },
                         children: []
                       }
                     ]
                   }
                 ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-muted px-4 md:px-8 border-b border-border' },
                children: [
                  {
                     id: generateId(),
                     type: 'Stack',
                     props: { className: 'mb-12 text-center max-w-4xl mx-auto' },
                     children: [
                       { id: generateId(), type: 'Heading', props: { text: 'Live Inventory Showcase', className: 'text-3xl md:text-5xl font-black text-foreground tracking-tight uppercase mb-4' }, children: [] },
                       { id: generateId(), type: 'Text', props: { text: 'Real-time availability of our current performance fleet. Data is synchronized directly with our enterprise inventory management system.', className: 'text-muted-foreground text-lg leading-relaxed' }, children: [] }
                     ]
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'max-w-7xl mx-auto mb-6 bg-card border border-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: 'Filter By:', className: 'font-bold uppercase tracking-widest text-sm text-muted-foreground' }, children: [] },
                      { id: generateId(), type: 'Columns', props: { className: 'gap-2 flex-wrap justify-center' }, children: [
                        { id: generateId(), type: 'Button', props: { text: 'All Models', variant: 'default', className: 'rounded-none text-xs uppercase' }, children: [] },
                        { id: generateId(), type: 'Button', props: { text: 'Performance', variant: 'outline', className: 'rounded-none text-xs uppercase border-border' }, children: [] },
                        { id: generateId(), type: 'Button', props: { text: 'SUVs', variant: 'outline', className: 'rounded-none text-xs uppercase border-border' }, children: [] },
                        { id: generateId(), type: 'Button', props: { text: 'Sedans', variant: 'outline', className: 'rounded-none text-xs uppercase border-border' }, children: [] }
                      ]}
                    ]
                  },
                  {
                    id: generateId(),
                    type: 'CmsList',
                    props: { modelId: 'cms-vehicles', limit: 8, className: 'max-w-7xl mx-auto border-0 bg-transparent p-0' },
                    children: []
                  }
                ]
              },
              {
                 id: generateId(),
                 type: 'Section',
                 props: { className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border' },
                 children: [
                   {
                     id: generateId(),
                     type: 'Columns',
                     props: { className: 'flex-col md:flex-row-reverse items-center gap-12 md:gap-16 max-w-7xl mx-auto' },
                     children: [
                       {
                         id: generateId(),
                         type: 'Stack',
                         props: { className: 'flex-1 w-full md:w-1/2' },
                         children: [
                           { id: generateId(), type: 'Heading', props: { text: 'Authorized Service Center', className: 'text-3xl md:text-5xl font-black mb-6 text-foreground tracking-tight uppercase' }, children: [] },
                           { id: generateId(), type: 'Text', props: { text: 'Our facility features factory-trained technicians and genuine OEM parts. From routine maintenance to complex engine rebuilds, we maintain the integrity of your investment.', className: 'text-base md:text-lg text-muted-foreground mb-8 leading-relaxed' }, children: [] },
                           { id: generateId(), type: 'Grid', props: { className: 'grid-cols-2 gap-y-4 gap-x-8 mb-10 border-t border-b border-border py-6' }, children: [
                             { id: generateId(), type: 'Text', props: { text: '• Scheduled Maintenance', className: 'text-sm font-medium' }, children: [] },
                             { id: generateId(), type: 'Text', props: { text: '• Engine & Transmission', className: 'text-sm font-medium' }, children: [] },
                             { id: generateId(), type: 'Text', props: { text: '• Performance Tuning', className: 'text-sm font-medium' }, children: [] },
                             { id: generateId(), type: 'Text', props: { text: '• Track Day Prep', className: 'text-sm font-medium' }, children: [] }
                           ]},
                           { id: generateId(), type: 'Button', props: { text: 'Schedule Service', variant: 'default', className: 'self-start rounded-none px-10 py-5 font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-primary/90' }, children: [] }
                         ]
                       },
                       {
                         id: generateId(),
                         type: 'Image',
                         props: { src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800', className: 'flex-1 w-full md:w-1/2 rounded-none shadow-2xl border border-border' },
                         children: []
                       }
                     ]
                   }
                 ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-muted text-center px-4 md:px-8 border-b border-border' },
                children: [
                   { id: generateId(), type: 'Heading', props: { text: 'Client Testimonials', className: 'text-3xl md:text-4xl font-black uppercase mb-16 tracking-tight' }, children: [] },
                   {
                     id: generateId(),
                     type: 'Grid',
                     props: { className: 'grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto' },
                     children: [
                        { id: generateId(), type: 'Card', props: { className: 'bg-background text-foreground border border-border shadow-xl p-10 md:p-12 rounded-none flex flex-col justify-between' }, children: [ { id: generateId(), type: 'Text', props: { text: '"The most seamless buying experience I have ever had. The transport logistics were handled flawlessly, and the vehicle exceeded all expectations upon delivery."', className: 'italic mb-8 text-lg text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Heading', props: { level: 4, text: '- Marcus T. | 2023 Porsche 911', className: 'font-bold uppercase text-sm tracking-widest text-primary' }, children: [] } ] },
                        { id: generateId(), type: 'Card', props: { className: 'bg-background text-foreground border border-border shadow-xl p-10 md:p-12 rounded-none flex flex-col justify-between' }, children: [ { id: generateId(), type: 'Text', props: { text: '"Incredible attention to detail on their 150-point inspection. The car arrived in pristine condition, backed by an unparalleled level of transparency and professionalism."', className: 'italic mb-8 text-lg text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Heading', props: { level: 4, text: '- Elena R. | 2022 Audi R8', className: 'font-bold uppercase text-sm tracking-widest text-primary' }, children: [] } ] }
                     ]
                   }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-background text-foreground border-b border-border px-4 md:px-8' },
                children: [
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto' },
                    children: [
                       { id: generateId(), type: 'Feature', props: { title: 'White-Glove Delivery', description: 'Nationwide enclosed transport directly to your driveway, fully insured and tracked in real-time through our client portal.', icon: '01', className: 'border border-border bg-card rounded-none p-10 shadow-md hover:border-primary/50 transition-colors' }, children: [] },
                       { id: generateId(), type: 'Feature', props: { title: 'Bespoke Financing', description: 'Tailored financial solutions and leasing structures optimized for high-net-worth individuals and corporate fleets.', icon: '02', className: 'border border-border bg-card rounded-none p-10 shadow-md hover:border-primary/50 transition-colors' }, children: [] },
                       { id: generateId(), type: 'Feature', props: { title: 'Post-Sale Concierge', description: 'Priority service scheduling, personalized track-day prep, and 24/7 dedicated support for your entire collection.', icon: '03', className: 'border border-border bg-card rounded-none p-10 shadow-md hover:border-primary/50 transition-colors' }, children: [] }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'CTA',
                props: { title: 'Schedule a VIP Test Drive', description: 'Experience the performance firsthand. Appointments required. Our specialists are available 24/7.', buttonText: 'Book Appointment', className: 'bg-primary text-primary-foreground rounded-none m-0 py-24 md:py-32 border-0 shadow-inner' },
                children: []
              },
              { id: generateId(), type: 'Footer', props: { text: '© 2026 Velocity Motors. Enterprise Automotive Solutions. All specifications subject to verification. \n1234 Performance Blvd, Metro City | 1-800-VELOCITY', className: 'bg-muted border-t border-border text-muted-foreground py-16 px-6 md:px-8 font-medium text-sm' }, children: [] }
            ])
          }
        ],
        theme: {
          colors: { primary: '221.2 83.2% 53.3%' },
          typography: { fontFamily: 'Inter, sans-serif', headingFontFamily: 'Inter, sans-serif' },
          radius: '0'
        }
      }
    },
    // ==========================================
    // 5. ENTERPRISE TIER - "GlobalTech Dynamics"
    // Visual Direction: Massive scale, ultra-dense information architecture, rigid structural grid.
    // Component Polish: High-contrast, sharp edges, heavily structured data presentation.
    // ==========================================
    {
      name: 'GlobalTech Dynamics',
      categoryId: categories['SaaS'].id,
      industryId: industries['Business & Professional'].id,
      requiredTier: 'ENTERPRISE',
      defaultTree: {
        metadata: {
          version: '1.0',
          status: 'PUBLISHED',
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
          description: 'A massive, highly structured layout designed for global enterprise SaaS. Features extreme density, advanced CMS models, and a rigid corporate aesthetic.',
        },
        cms: {
          models: [
            {
              id: 'cms-solutions',
              name: 'Enterprise Solutions',
              schema: {
                fields: [
                  { name: 'name', type: 'string' },
                  { name: 'description', type: 'string' },
                  { name: 'icon', type: 'string' }
                ]
              }
            }
          ],
          entries: [
            { modelId: 'cms-solutions', status: 'PUBLISHED', data: { name: 'Cloud Infrastructure', description: 'Hyper-scale distributed computing architecture.', icon: '☁️' } },
            { modelId: 'cms-solutions', status: 'PUBLISHED', data: { name: 'Data Intelligence', description: 'Predictive analytics powered by machine learning models.', icon: '🧠' } },
            { modelId: 'cms-solutions', status: 'PUBLISHED', data: { name: 'Zero-Trust Security', description: 'Military-grade cryptographic frameworks for data protection.', icon: '🔒' } },
            { modelId: 'cms-solutions', status: 'PUBLISHED', data: { name: 'Global Connectivity', description: 'Low-latency routing across 150+ regional edge points.', icon: '🌐' } }
          ]
        },
        pages: [
          {
            id: 'tpl-ent-home',
            slug: '/',
            title: 'Home',
            order: 0,
            nodeTree: buildRoot([
              {
                id: generateId(),
                type: 'Navbar',
                props: { 
                  logoText: 'GLOBALTECH DYNAMICS', 
                  className: 'py-6 bg-background border-b border-border tracking-[0.2em] font-black text-foreground px-4 md:px-8 shadow-sm',
                  links: [
                    { label: 'Solutions ▼', href: '#' },
                    { label: 'Platform ▼', href: '#' },
                    { label: 'Industries', href: '#' },
                    { label: 'Partners', href: '#' },
                    { label: 'Resources', href: '#' },
                    { label: 'Company', href: '#' }
                  ]
                },
                children: []
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'bg-background text-foreground py-32 md:py-48 text-center border-b border-border bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'px-4 relative z-10 max-w-5xl mx-auto' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'ENTERPRISE OPERATING SYSTEM', level: 6, className: 'text-primary tracking-[0.3em] font-bold text-xs md:text-sm mb-8 uppercase border border-primary/20 inline-block px-6 py-2 bg-primary/5 rounded-full' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { text: 'Architecting the Future of Global Commerce.', level: 1, className: 'text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-foreground' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'GlobalTech Dynamics delivers hyper-scalable infrastructure, AI-driven intelligence, and uncompromising security protocols for the world\'s most demanding Fortune 500 organizations.', className: 'text-muted-foreground mb-12 text-lg md:text-2xl max-w-4xl mx-auto font-light leading-relaxed' },
                        children: []
                      },
                      {
                        id: generateId(),
                        type: 'Columns',
                        props: { className: 'justify-center gap-6 flex-col sm:flex-row max-w-xl mx-auto' },
                        children: [
                          { id: generateId(), type: 'Button', props: { text: 'Request Enterprise Demo', variant: 'default', className: 'w-full bg-primary text-primary-foreground rounded-none px-10 py-7 text-sm tracking-widest uppercase font-bold shadow-lg hover:shadow-primary/25 transition-all' }, children: [] },
                          { id: generateId(), type: 'Button', props: { text: 'Contact Sales', variant: 'outline', className: 'w-full rounded-none px-10 py-7 text-sm tracking-widest uppercase font-bold border-2 border-foreground' }, children: [] }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-16 bg-muted text-muted-foreground border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'text-center px-4 max-w-7xl mx-auto' },
                    children: [
                       { id: generateId(), type: 'Text', props: { text: 'TRUSTED BY 94% OF THE FORTUNE 100', className: 'text-xs uppercase tracking-[0.2em] font-bold mb-10 text-foreground/50' }, children: [] },
                       {
                         id: generateId(),
                         type: 'Columns',
                         props: { className: 'justify-around items-center opacity-60 flex-wrap gap-8' },
                         children: [
                           { id: generateId(), type: 'Heading', props: { text: 'ACME CORP', level: 4, className: 'text-xl font-black tracking-widest' }, children: [] },
                           { id: generateId(), type: 'Heading', props: { text: 'GLOBAL BANK', level: 4, className: 'text-xl font-black tracking-widest' }, children: [] },
                           { id: generateId(), type: 'Heading', props: { text: 'NEXUS', level: 4, className: 'text-xl font-black tracking-widest' }, children: [] },
                           { id: generateId(), type: 'Heading', props: { text: 'VERTEX', level: 4, className: 'text-xl font-black tracking-widest' }, children: [] },
                           { id: generateId(), type: 'Heading', props: { text: 'OMEGA', level: 4, className: 'text-xl font-black tracking-widest' }, children: [] }
                         ]
                       }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'max-w-7xl mx-auto' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Columns',
                        props: { className: 'flex-col lg:flex-row gap-12 lg:gap-16 items-start mb-16' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Stack',
                            props: { className: 'w-full lg:w-1/2' },
                            children: [
                              { id: generateId(), type: 'Heading', props: { text: 'Capabilities', className: 'text-primary tracking-[0.2em] font-bold text-sm mb-4 uppercase' }, children: [] },
                              { id: generateId(), type: 'Heading', props: { text: 'Unprecedented Scale. Uncompromising Control.', className: 'text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]' }, children: [] }
                            ]
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: { text: 'Our proprietary architecture decentralizes computing while centralizing governance, allowing global teams to operate with localized agility and enterprise-grade compliance.', className: 'w-full lg:w-1/2 text-lg md:text-xl text-muted-foreground leading-relaxed pt-2' },
                            children: []
                          }
                        ]
                      },
                      {
                        id: generateId(),
                        type: 'Grid',
                        props: { className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
                        children: [
                          { id: generateId(), type: 'Feature', props: { title: 'Compliance & Governance', description: 'Automated policy enforcement across all jurisdictional zones (GDPR, HIPAA, SOC2 Type II).', icon: '01', className: 'bg-card border border-border p-10 rounded-none shadow-sm' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'Hybrid Deployment', description: 'Seamless orchestration across on-premise, private cloud, and public cloud environments.', icon: '02', className: 'bg-card border border-border p-10 rounded-none shadow-sm' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'Quantum-Safe Encryption', description: 'Next-generation cryptographic algorithms protecting data in transit and at rest.', icon: '03', className: 'bg-card border border-border p-10 rounded-none shadow-sm' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'Identity Management', description: 'Federated SSO, biometric MFA, and role-based access control with granular permissions.', icon: '04', className: 'bg-card border border-border p-10 rounded-none shadow-sm' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: 'Predictive Analytics', description: 'Proprietary machine learning models forecasting operational bottlenecks before they occur.', icon: '05', className: 'bg-card border border-border p-10 rounded-none shadow-sm' }, children: [] },
                          { id: generateId(), type: 'Feature', props: { title: '24/7/365 NOC Support', description: 'Dedicated site reliability engineers monitoring your infrastructure with guaranteed SLAs.', icon: '06', className: 'bg-primary text-primary-foreground border border-primary p-10 rounded-none shadow-sm' }, children: [] }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-muted px-4 md:px-8 border-b border-border relative' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'max-w-7xl mx-auto' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Columns',
                        props: { className: 'flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-border pb-8' },
                        children: [
                           {
                             id: generateId(),
                             type: 'Stack',
                             props: { className: 'max-w-2xl' },
                             children: [
                               { id: generateId(), type: 'Heading', props: { text: 'Platform Solutions', className: 'text-3xl md:text-5xl font-black text-foreground tracking-tight uppercase' }, children: [] },
                             ]
                           },
                           { id: generateId(), type: 'Button', props: { text: 'View Platform Architecture', variant: 'outline', className: 'rounded-none border-foreground text-foreground px-8 py-5 uppercase text-xs tracking-widest font-bold' }, children: [] }
                        ]
                      },
                      {
                        id: generateId(),
                        type: 'CmsList',
                        props: { modelId: 'cms-solutions', limit: 4, className: 'border-0 bg-transparent p-0' },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: generateId(),
                type: 'Section',
                props: { className: 'py-24 md:py-32 bg-background text-foreground border-b border-border px-4 md:px-8' },
                children: [
                   {
                     id: generateId(),
                     type: 'Container',
                     props: { className: 'max-w-7xl mx-auto' },
                     children: [
                       { id: generateId(), type: 'Heading', props: { text: 'Global Network Metrics', className: 'text-3xl md:text-4xl font-black uppercase mb-12 tracking-tight text-center' }, children: [] },
                       {
                         id: generateId(),
                         type: 'Grid',
                         props: { className: 'grid-cols-2 md:grid-cols-4 gap-0 border border-border' },
                         children: [
                           { id: generateId(), type: 'Stack', props: { className: 'p-10 border-r border-b border-border' }, children: [ { id: generateId(), type: 'Heading', props: { text: '99.999%', className: 'text-4xl lg:text-5xl font-light text-primary mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Uptime SLA Guarantee', className: 'text-xs uppercase tracking-widest font-bold text-muted-foreground' }, children: [] } ] },
                           { id: generateId(), type: 'Stack', props: { className: 'p-10 border-r border-b border-border' }, children: [ { id: generateId(), type: 'Heading', props: { text: '150+', className: 'text-4xl lg:text-5xl font-light text-primary mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Global Edge Locations', className: 'text-xs uppercase tracking-widest font-bold text-muted-foreground' }, children: [] } ] },
                           { id: generateId(), type: 'Stack', props: { className: 'p-10 border-r border-b border-border' }, children: [ { id: generateId(), type: 'Heading', props: { text: '<10ms', className: 'text-4xl lg:text-5xl font-light text-primary mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Average Global Latency', className: 'text-xs uppercase tracking-widest font-bold text-muted-foreground' }, children: [] } ] },
                           { id: generateId(), type: 'Stack', props: { className: 'p-10 border-b border-border' }, children: [ { id: generateId(), type: 'Heading', props: { text: '50PB+', className: 'text-4xl lg:text-5xl font-light text-primary mb-2' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Data Processed Daily', className: 'text-xs uppercase tracking-widest font-bold text-muted-foreground' }, children: [] } ] }
                         ]
                       }
                     ]
                   }
                ]
              },
              {
                id: generateId(),
                type: 'CTA',
                props: { title: 'Transform Your Enterprise.', description: 'Join the world\'s leading organizations in accelerating digital transformation. Contact our enterprise sales team for a custom architectural review.', buttonText: 'Contact Sales', className: 'bg-foreground text-background rounded-none m-0 py-32 border-0' },
                children: []
              },
              { 
                id: generateId(), 
                type: 'Section', 
                props: { className: 'py-20 bg-muted border-t border-border px-4 md:px-8' }, 
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: { className: 'max-w-7xl mx-auto' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Columns',
                        props: { className: 'flex-col lg:flex-row justify-between gap-16 mb-16' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Stack',
                            props: { className: 'max-w-xs' },
                            children: [
                              { id: generateId(), type: 'Heading', props: { text: 'GLOBALTECH DYNAMICS', level: 5, className: 'font-black tracking-[0.2em] mb-4' }, children: [] },
                              { id: generateId(), type: 'Text', props: { text: 'Enterprise Operating System.', className: 'text-muted-foreground text-sm leading-relaxed mb-6' }, children: [] },
                              { id: generateId(), type: 'Text', props: { text: '1-800-GLOBAL-TECH\nsales@globaltech.inc', className: 'text-foreground font-bold text-sm leading-relaxed whitespace-pre-line' }, children: [] }
                            ]
                          },
                          {
                            id: generateId(),
                            type: 'Grid',
                            props: { className: 'grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3' },
                            children: [
                              { id: generateId(), type: 'Stack', props: { className: 'gap-3' }, children: [ { id: generateId(), type: 'Text', props: { text: 'Solutions', className: 'font-bold uppercase tracking-wider text-xs mb-2 text-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Cloud Infrastructure', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Data Intelligence', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Zero-Trust Security', className: 'text-sm text-muted-foreground' }, children: [] } ] },
                              { id: generateId(), type: 'Stack', props: { className: 'gap-3' }, children: [ { id: generateId(), type: 'Text', props: { text: 'Platform', className: 'font-bold uppercase tracking-wider text-xs mb-2 text-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Architecture', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Integrations', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Documentation', className: 'text-sm text-muted-foreground' }, children: [] } ] },
                              { id: generateId(), type: 'Stack', props: { className: 'gap-3' }, children: [ { id: generateId(), type: 'Text', props: { text: 'Company', className: 'font-bold uppercase tracking-wider text-xs mb-2 text-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'About Us', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Careers', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Investors', className: 'text-sm text-muted-foreground' }, children: [] } ] },
                              { id: generateId(), type: 'Stack', props: { className: 'gap-3' }, children: [ { id: generateId(), type: 'Text', props: { text: 'Legal', className: 'font-bold uppercase tracking-wider text-xs mb-2 text-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Privacy Policy', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Terms of Service', className: 'text-sm text-muted-foreground' }, children: [] }, { id: generateId(), type: 'Text', props: { text: 'Security Trust Center', className: 'text-sm text-muted-foreground' }, children: [] } ] }
                            ]
                          }
                        ]
                      },
                      { id: generateId(), type: 'Text', props: { text: '© 2026 GlobalTech Dynamics, Inc. All rights reserved. Regional Headquarters: San Francisco | London | Singapore | Tokyo', className: 'text-xs text-muted-foreground border-t border-border pt-8 text-center md:text-left' }, children: [] }
                    ]
                  }
                ] 
              }
            ])
          }
        ],
        theme: {
          colors: { primary: '217.2 91.2% 59.8%' },
          typography: { fontFamily: 'Inter, sans-serif', headingFontFamily: 'Inter, sans-serif' },
          radius: '0'
        }
      }
    }
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
        in: ['Modern Restaurant', 'Chic Coffee Shop', 'Boutique Hotel & Spa', 'Urban Fashion Store'],
      },
    },
  });

  console.log('Templates seeded successfully!');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
