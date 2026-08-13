import 'dotenv/config';
import { SubscriptionTier } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { prisma } from '../src/shared/lib/prisma';

type NodeType =
  | 'Container'
  | 'Section'
  | 'Stack'
  | 'Grid'
  | 'Columns'
  | 'Heading'
  | 'Text'
  | 'Button'
  | 'Image'
  | 'Divider'
  | 'Spacer'
  | 'Card'
  | 'Feature'
  | 'CTA'
  | 'Navbar'
  | 'Footer'
  | 'CmsList';

type BuilderNode = {
  id: string;
  type: NodeType;
  props: Record<string, unknown>;
  styles?: Record<string, unknown>;
  children: BuilderNode[];
};

type BuilderDocument = {
  version: number;
  root: BuilderNode;
};

type TemplateSeed = {
  name: string;
  industry: string;
  category: string;
  tier: SubscriptionTier;
  thumbnail: string;
  description: string;
  nav: string[];
  buildPage: () => BuilderDocument;
};

function node(
  type: NodeType,
  props: Record<string, unknown> = {},
  children: BuilderNode[] = [],
): BuilderNode {
  return {
    id: randomUUID(),
    type,
    props,
    children,
  };
}

function section(title: string, subtitle: string, children: BuilderNode[] = []): BuilderNode {
  return node(
    'Section',
    {
      className: 'py-14 border-b border-border/60',
      style: {
        background: 'rgba(255,255,255,0.9)',
      },
    },
    [
      node('Container', { className: 'max-w-6xl' }, [
        node('Stack', { className: 'gap-4 mb-8' }, [
          node('Heading', {
            level: 2,
            text: title,
            className: 'text-3xl md:text-4xl font-bold tracking-tight',
          }),
          node('Text', { text: subtitle, className: 'text-base text-muted-foreground max-w-3xl' }),
        ]),
        ...children,
      ]),
    ],
  );
}

function bulletCard(title: string, desc: string, icon: string): BuilderNode {
  return node('Feature', {
    title,
    description: desc,
    icon,
    className: 'rounded-xl border border-border bg-card p-4 shadow-sm',
  });
}

function statCard(title: string, desc: string): BuilderNode {
  return node('Card', { className: 'rounded-xl border border-border bg-card p-5 shadow-sm' }, [
    node('Heading', { level: 3, text: title, className: 'text-xl font-semibold mb-2' }),
    node('Text', { text: desc, className: 'text-sm text-muted-foreground' }),
  ]);
}

function heroBlock(input: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
  theme: 'light' | 'dark';
}): BuilderNode {
  const dark = input.theme === 'dark';
  return node(
    'Section',
    {
      className: 'pt-10 pb-16 md:pt-16 md:pb-20',
      style: {
        background: dark
          ? 'linear-gradient(135deg, #111827 0%, #0f172a 35%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #fef3c7 100%)',
        color: dark ? '#f8fafc' : '#0f172a',
      },
    },
    [
      node('Container', { className: 'max-w-6xl' }, [
        node('Columns', { className: 'items-center gap-10' }, [
          node('Stack', { className: 'gap-5' }, [
            node('Text', {
              text: input.eyebrow,
              className: dark
                ? 'inline-block text-xs font-semibold uppercase tracking-[0.18em] text-sky-300'
                : 'inline-block text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700',
            }),
            node('Heading', {
              level: 1,
              text: input.title,
              className: 'text-4xl md:text-6xl font-black tracking-tight leading-tight',
            }),
            node('Text', {
              text: input.subtitle,
              className: dark
                ? 'text-base md:text-lg text-slate-200/85'
                : 'text-base md:text-lg text-slate-700',
            }),
            node('Columns', { className: 'gap-3 items-center max-w-md' }, [
              node('Button', {
                text: input.ctaPrimary,
                href: '#contact',
                className: dark
                  ? 'w-full md:w-auto bg-sky-500 text-white hover:bg-sky-400'
                  : 'w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-500',
              }),
              node('Button', {
                text: input.ctaSecondary,
                href: '#programs',
                variant: 'outline',
                className: dark
                  ? 'w-full md:w-auto border-slate-500 text-slate-100 hover:bg-slate-800'
                  : 'w-full md:w-auto border-slate-300 text-slate-800 hover:bg-slate-100',
              }),
            ]),
          ]),
          node(
            'Card',
            { className: 'rounded-2xl p-0 overflow-hidden border border-border shadow-2xl' },
            [
              node('Image', {
                src: input.image,
                alt: input.title,
                className: 'w-full h-[300px] md:h-[420px] object-cover rounded-none',
              }),
            ],
          ),
        ]),
      ]),
    ],
  );
}

function navbar(brand: string, links: { label: string; href: string }[]): BuilderNode {
  return node('Navbar', {
    logoText: brand,
    links,
    className: 'bg-background/95 backdrop-blur border-b border-border/70',
  });
}

function footer(text: string): BuilderNode {
  return node('Footer', { text, className: 'bg-muted/30 border-t border-border/70' });
}

function buildTravelHotelPage(
  variant: 'resort' | 'city' | 'boutique',
  tier: SubscriptionTier,
): BuilderDocument {
  const titles = {
    resort: {
      brand: 'Aurelia Resort',
      title: 'Oceanfront Resort Experience Crafted for Slow Luxury',
      subtitle:
        'Private villas, curated island dining, and concierge-designed adventures for families and couples seeking restorative travel.',
      image:
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80',
    },
    city: {
      brand: 'Northline City Hotel',
      title: 'Business-Ready Stay in the Heart of the Financial District',
      subtitle:
        'Walk to major offices, host board meetings with AV-ready rooms, and recharge in contemporary suites designed for productive travel.',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
    },
    boutique: {
      brand: 'Nusa Atelier Hotel',
      title: 'Design-Forward Boutique Hotel with Local Character',
      subtitle:
        'Handcrafted interiors, neighborhood food curation, and thoughtful service turn each trip into a personalized city narrative.',
      image:
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80',
    },
  }[variant];

  const premium = tier === 'BUSINESS' || tier === 'ENTERPRISE' || tier === 'PRO';
  const enterprise = tier === 'ENTERPRISE';

  const children: BuilderNode[] = [
    navbar(titles.brand, [
      { label: 'Rooms', href: '#rooms' },
      { label: 'Amenities', href: '#amenities' },
      { label: 'Offers', href: '#offers' },
      { label: 'Location', href: '#location' },
      { label: 'Book', href: '#contact' },
    ]),
    heroBlock({
      eyebrow: 'Hotel & Travel',
      title: titles.title,
      subtitle: titles.subtitle,
      ctaPrimary: 'Check Availability',
      ctaSecondary: 'Explore Rooms',
      image: titles.image,
      theme: variant === 'city' ? 'dark' : 'light',
    }),
    section(
      'Room Types Designed for Different Journeys',
      'From executive stays to family escapes, every room category prioritizes comfort, acoustics, and practical luxury.',
      [
        node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-5', id: 'rooms' }, [
          statCard(
            'Deluxe King Suite',
            '48m2 with work lounge, blackout system, and premium bedding.',
          ),
          statCard(
            'Family Connecting Room',
            'Two connected rooms with kid-friendly pantry and dual smart TV.',
          ),
          statCard(
            'Ocean Villa',
            'Private plunge pool, butler call line, and sunrise deck for two.',
          ),
        ]),
      ],
    ),
    section(
      'Amenities That Support Relaxation and Productivity',
      'Wellness, culinary, and meeting amenities tailored for leisure and corporate travel.',
      [
        node(
          'Grid',
          { className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', id: 'amenities' },
          [
            bulletCard(
              '24/7 Concierge',
              'Multi-language guest support for transport, dining, and itinerary changes.',
              'CN',
            ),
            bulletCard(
              'Spa & Recovery',
              'Signature massage rituals and thermal recovery circuit.',
              'SPA',
            ),
            bulletCard('Meeting Rooms', 'Modular rooms with hybrid conference equipment.', 'MEET'),
            bulletCard(
              'Airport Transfer',
              'Scheduled premium shuttles and private car options.',
              'TRF',
            ),
          ],
        ),
      ],
    ),
    section(
      'Current Seasonal Offers',
      'Drive direct bookings with campaign-ready package highlights and limited slots.',
      [
        node('Columns', { className: 'gap-5', id: 'offers' }, [
          statCard(
            'Stay 4 Pay 3',
            'Valid Sun-Thu for direct bookings, includes breakfast and airport pickup.',
          ),
          statCard(
            'Workcation Package',
            'Suite upgrade, daily laundry, meeting credits, and late checkout.',
          ),
        ]),
      ],
    ),
    section(
      'Guest Reviews',
      'Verified post-stay reviews from recent guests who booked through direct and OTA channels.',
      [
        node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-4' }, [
          statCard(
            '4.8/5 Cleanliness',
            '"Rooms were spotless and housekeeping adjusted perfectly to our schedule."',
          ),
          statCard('4.9/5 Service', '"Front desk handled our itinerary changes in minutes."'),
          statCard('4.7/5 Location', '"Everything we needed was walkable from the hotel lobby."'),
        ]),
      ],
    ),
  ];

  if (premium) {
    children.push(
      section(
        'Destination Highlights Near the Property',
        'Recommended experiences within 30 minutes, curated by concierge specialists.',
        [
          node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-5' }, [
            statCard(
              'Sunset Bay Cruise',
              '2-hour guided coastal cruise with transfer and refreshments.',
            ),
            statCard(
              'Old Town Culinary Walk',
              'Chef-led food route with five local tasting stops.',
            ),
            statCard(
              'Mountain Sunrise Trek',
              'Small-group trek with equipment and breakfast picnic.',
            ),
          ]),
        ],
      ),
    );
  }

  if (enterprise) {
    children.push(
      section(
        'Corporate & Event Hosting',
        'Enterprise-ready events with production planning, room blocks, and dedicated account managers.',
        [
          node('Columns', { className: 'gap-6' }, [
            statCard(
              'Ballroom Capacity 500',
              'Integrated staging, synchronized lighting, and interpretation-ready setup.',
            ),
            statCard(
              'Incentive Retreat Programs',
              'Pre-built retreat formats for leadership, sales kickoff, and partner summits.',
            ),
          ]),
        ],
      ),
    );
  }

  children.push(
    section(
      'Find Us and Start Planning',
      'Located near key transport hubs with direct channels for reservations and group requests.',
      [
        node('Columns', { className: 'gap-6 items-start', id: 'location' }, [
          statCard(
            'Property Address',
            'Jl. Panorama Seaside 88, Badung, Bali. 20 min from airport.',
          ),
          node('Card', { className: 'p-5 border border-border rounded-xl' }, [
            node('Heading', {
              level: 3,
              text: 'Reservation Desk',
              className: 'text-xl font-semibold mb-3',
            }),
            node('Text', {
              text: 'Call +62 361 555 0099 or email reservations@aureliaresort.com',
              className: 'text-sm mb-4',
            }),
            node('Button', {
              text: 'Book Your Stay',
              href: '#contact',
              className: 'bg-emerald-600 text-white hover:bg-emerald-500',
            }),
          ]),
        ]),
      ],
    ),
    node('CTA', {
      title: 'Secure Your Preferred Dates Before Peak Season',
      description:
        'Our reservations team responds in under 15 minutes for direct booking requests and group quotes.',
      buttonText: 'Talk to Reservation Team',
      className: 'mx-4 md:mx-10 my-12',
      id: 'contact',
    }),
    footer('Aurelia Hospitality Group - Direct booking support: 24/7 reservation desk.'),
  );

  return {
    version: 1,
    root: node('Container', { className: 'min-h-screen bg-background text-foreground' }, children),
  };
}

function buildTourPage(
  variant: 'adventure' | 'luxury' | 'family' | 'agency',
  tier: SubscriptionTier,
): BuilderDocument {
  const profile = {
    adventure: {
      brand: 'Altura Adventure',
      title: 'Guided Adventure Tours with Safety-First Expedition Design',
      subtitle:
        'Multi-day mountain, waterfall, and off-road experiences led by certified guides and local route experts.',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
    },
    luxury: {
      brand: 'Meridian Luxe Travel',
      title: 'Private Luxury Journeys Built Around Your Pace',
      subtitle:
        'Bespoke itineraries, premium accommodations, and dedicated travel concierges for high-touch travel.',
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
    },
    family: {
      brand: 'Family Trails Co.',
      title: 'Family Holidays Planned for Comfort, Safety, and Shared Memories',
      subtitle:
        'Kid-friendly logistics, balanced itineraries, and trusted accommodations for multigenerational travel.',
      image:
        'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=1400&q=80',
    },
    agency: {
      brand: 'Archipelago Travel Desk',
      title: 'End-to-End Travel Agency Services for Domestic and International Trips',
      subtitle:
        'Flight support, accommodation planning, visa assistance, and itinerary management in one operating partner.',
      image:
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
    },
  }[variant];

  const richer = tier !== 'FREE';
  const highEnd = tier === 'BUSINESS' || tier === 'ENTERPRISE';

  const rootChildren: BuilderNode[] = [
    navbar(profile.brand, [
      { label: 'Packages', href: '#packages' },
      { label: 'Itinerary', href: '#itinerary' },
      { label: 'Inclusions', href: '#inclusions' },
      { label: 'Reviews', href: '#reviews' },
      { label: 'Book', href: '#contact' },
    ]),
    heroBlock({
      eyebrow: 'Tour Package',
      title: profile.title,
      subtitle: profile.subtitle,
      ctaPrimary: 'Book Consultation',
      ctaSecondary: 'See Package List',
      image: profile.image,
      theme: variant === 'adventure' ? 'dark' : 'light',
    }),
    section(
      'Featured Tour Packages',
      'Each package includes transparent pricing, route details, and departure certainty.',
      [
        node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-5', id: 'packages' }, [
          statCard(
            '3D2N Highland Escape',
            'From IDR 3.950.000/pax - Trekking, campsite upgrade, pro guide.',
          ),
          statCard(
            '5D4N Island Discovery',
            'From IDR 7.250.000/pax - Speedboat transfer, snorkeling set, local host.',
          ),
          statCard(
            '7D6N Cultural Circuit',
            'From IDR 10.500.000/pax - City-to-nature route with curated local experiences.',
          ),
        ]),
      ],
    ),
    section(
      'Sample Day-by-Day Itinerary',
      'Clear daily breakdown helps guests evaluate activity load, travel time, and pace.',
      [
        node('Stack', { className: 'gap-3', id: 'itinerary' }, [
          statCard(
            'Day 1 - Arrival & Briefing',
            'Airport pickup, accommodation check-in, and route orientation with your lead guide.',
          ),
          statCard(
            'Day 2 - Core Activity Day',
            'Primary destination exploration with segmented breaks, meals, and checkpoint updates.',
          ),
          statCard(
            'Day 3 - Flexible Exploration',
            'Optional add-ons, shopping route, and scheduled transfer to return point.',
          ),
        ]),
      ],
    ),
    section(
      'Inclusions and Exclusions',
      'What is covered and what guests should prepare before departure.',
      [
        node('Columns', { className: 'gap-6', id: 'inclusions' }, [
          node('Card', { className: 'p-5 border border-border rounded-xl' }, [
            node('Heading', {
              level: 3,
              text: 'Included',
              className: 'text-xl font-semibold mb-3',
            }),
            node('Text', {
              text: 'Licensed guide, transportation, accommodation, selected meals, permit handling.',
            }),
          ]),
          node('Card', { className: 'p-5 border border-border rounded-xl' }, [
            node('Heading', {
              level: 3,
              text: 'Not Included',
              className: 'text-xl font-semibold mb-3',
            }),
            node('Text', {
              text: 'Personal shopping, travel insurance upgrades, and optional private activities.',
            }),
          ]),
        ]),
      ],
    ),
  ];

  if (richer) {
    rootChildren.push(
      section(
        'Customer Stories',
        'Recent client highlights from family trips, executive retreats, and expedition teams.',
        [
          node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-4', id: 'reviews' }, [
            statCard(
              '4.9/5 Guide Expertise',
              '"Our guide adjusted route pacing perfectly for mixed fitness levels."',
            ),
            statCard(
              '4.8/5 Logistics',
              '"Transfers, rooms, and meal timing were exactly as promised."',
            ),
            statCard(
              '4.9/5 Value',
              '"Transparent pricing with no hidden add-ons during the tour."',
            ),
          ]),
        ],
      ),
    );
  }

  if (highEnd) {
    rootChildren.push(
      section(
        'Private and Corporate Programs',
        'Extended support for company offsites, incentive travel, and private charter groups.',
        [
          node('Columns', { className: 'gap-5' }, [
            statCard(
              'Corporate Offsite Planner',
              'Objective-based trip design with facilitator and event producer options.',
            ),
            statCard(
              'Private Group Charter',
              'Dedicated vehicles, private guide team, and fully adjustable itinerary.',
            ),
          ]),
        ],
      ),
    );
  }

  rootChildren.push(
    node('CTA', {
      title: 'Plan Your Next Journey with a Dedicated Travel Specialist',
      description:
        'Share your preferred destination, dates, and budget. We will return a detailed proposal within one business day.',
      buttonText: 'Get Custom Itinerary',
      className: 'mx-4 md:mx-10 my-12',
      id: 'contact',
    }),
    footer('Archipelago Travel Desk - Registered tour operator with insured travel operations.'),
  );

  return {
    version: 1,
    root: node(
      'Container',
      { className: 'min-h-screen bg-background text-foreground' },
      rootChildren,
    ),
  };
}

function buildAutomotivePage(
  variant: 'premium-dealer' | 'modern-bike' | 'used-bike' | 'sport-showroom',
  tier: SubscriptionTier,
): BuilderDocument {
  const meta = {
    'premium-dealer': {
      brand: 'Vertex Motors',
      title: 'Premium Dealership for Executive and Performance Vehicles',
      subtitle:
        'Certified inventory, financing consultation, and after-sales assurance in one integrated showroom experience.',
      image:
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1400&q=80',
    },
    'modern-bike': {
      brand: 'MotoCentral',
      title: 'Modern Motorcycle Store with Full-Line New Models',
      subtitle: 'Compare models, specs, and ownership costs before booking your test ride.',
      image:
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=80',
    },
    'used-bike': {
      brand: 'SecondGear Hub',
      title: 'Trusted Used Motorcycle Marketplace with Inspection Reports',
      subtitle:
        'Transparent condition grading, service history, and buyback support for confident purchases.',
      image:
        'https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d?auto=format&fit=crop&w=1400&q=80',
    },
    'sport-showroom': {
      brand: 'Apex Sport Bikes',
      title: 'Sport Bike Showroom Focused on Track-Ready Performance',
      subtitle:
        'High-performance lineup with spec-driven comparison tools and rider-fit consultation.',
      image:
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1400&q=80',
    },
  }[variant];

  const pro = tier === 'PRO' || tier === 'BUSINESS' || tier === 'ENTERPRISE';
  const enterprise = tier === 'ENTERPRISE';

  const nodes: BuilderNode[] = [
    navbar(meta.brand, [
      { label: 'Models', href: '#models' },
      { label: 'Specs', href: '#specs' },
      { label: 'Finance', href: '#finance' },
      { label: 'Showroom', href: '#showroom' },
      { label: 'Test Ride', href: '#contact' },
    ]),
    heroBlock({
      eyebrow: 'Automotive Storefront',
      title: meta.title,
      subtitle: meta.subtitle,
      ctaPrimary: 'Book Test Ride',
      ctaSecondary: 'Compare Models',
      image: meta.image,
      theme: 'dark',
    }),
    section(
      'Featured Models',
      'Model cards with key specs and pricing anchors for faster buyer decisions.',
      [
        node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-5', id: 'models' }, [
          statCard('VXR 900', 'From IDR 268.000.000 - 118 hp, ABS, quick shifter, ride modes.'),
          statCard(
            'CityCruise 350',
            'From IDR 89.000.000 - practical commuter with smart storage.',
          ),
          statCard('TrailX 500', 'From IDR 132.500.000 - dual-purpose adventure-ready setup.'),
        ]),
      ],
    ),
    section(
      'Specification and Comparison Snapshot',
      'Present technical differences clearly for serious shoppers.',
      [
        node('Columns', { className: 'gap-5', id: 'specs' }, [
          statCard(
            'Engine & Power',
            'Parallel twin and single-cylinder options from 25 hp to 118 hp range.',
          ),
          statCard(
            'Safety Suite',
            'ABS, traction control, braking assist, and rider mode customization.',
          ),
        ]),
      ],
    ),
    section('Promotions and Financing', 'Campaign offers and payment simulation-ready messaging.', [
      node('Grid', { className: 'grid-cols-1 md:grid-cols-2 gap-5', id: 'finance' }, [
        statCard(
          '0% Installment Program',
          'Up to 24 months for selected models with approved partner banks.',
        ),
        statCard('Trade-In Bonus', 'Additional valuation up to IDR 6.000.000 for accepted units.'),
      ]),
    ]),
  ];

  if (pro) {
    nodes.push(
      section(
        'After-Sales and Ownership Support',
        'Service intervals, warranty, and roadside support made explicit before purchase.',
        [
          node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-4' }, [
            bulletCard(
              'Authorized Service',
              'Factory-trained mechanics and OEM parts assurance.',
              'SRV',
            ),
            bulletCard('Warranty Program', 'Up to 3-year manufacturer warranty coverage.', 'WRN'),
            bulletCard(
              'Roadside Assistance',
              '24/7 emergency support in major operating areas.',
              'HELP',
            ),
          ]),
        ],
      ),
    );
  }

  if (enterprise) {
    nodes.push(
      section(
        'Fleet and Corporate Sales',
        'Dedicated account services for fleet procurement and maintenance contracts.',
        [
          node('Columns', { className: 'gap-5' }, [
            statCard(
              'Corporate Fleet Packages',
              'Bulk procurement plans with preventive maintenance bundles.',
            ),
            statCard(
              'Operational SLA',
              'Priority support lane and scheduled uptime reviews for fleet units.',
            ),
          ]),
        ],
      ),
    );
  }

  nodes.push(
    section('Visit Our Showroom', 'Physical showroom details and quick contact options.', [
      node('Columns', { className: 'gap-5', id: 'showroom' }, [
        statCard('Main Showroom', 'Jl. Otomotif Raya 17, Jakarta - Open daily 09:00 to 20:00.'),
        statCard(
          'Test Ride Track',
          'Pre-book slots available every weekend with certified instructors.',
        ),
      ]),
    ]),
    node('CTA', {
      title: 'Ready to Ride? Schedule Your Test Ride Session',
      description:
        'Get model recommendations, payment scenarios, and immediate stock confirmation from our advisors.',
      buttonText: 'Reserve Test Ride',
      className: 'mx-4 md:mx-10 my-12',
      id: 'contact',
    }),
    footer('Vertex Motors - Certified dealer network with nationwide support.'),
  );

  return {
    version: 1,
    root: node('Container', { className: 'min-h-screen bg-background text-foreground' }, nodes),
  };
}

function buildWorkshopPage(
  variant: 'executive' | 'creative' | 'corporate-learning' | 'certification',
  tier: SubscriptionTier,
): BuilderDocument {
  const data = {
    executive: {
      brand: 'ExecCatalyst Institute',
      title: 'Executive Training Programs for Decision-Making Under Pressure',
      subtitle:
        'Leadership workshops built for directors and senior managers in high-growth organizations.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    },
    creative: {
      brand: 'CreateLab Workshop',
      title: 'Creative Workshops that Turn Ideas into Practical Campaign Outputs',
      subtitle:
        'Hands-on facilitation across storytelling, design strategy, and collaborative ideation.',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    },
    'corporate-learning': {
      brand: 'NexLearn Corporate',
      title: 'Corporate Learning Tracks Aligned to Business KPIs',
      subtitle: 'Capability development programs co-designed with HR and business unit leaders.',
      image:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    },
    certification: {
      brand: 'ProCert Academy',
      title: 'Professional Certification Bootcamps with Exam-Ready Support',
      subtitle:
        'Structured preparation pathways for industry-recognized credentials and compliance requirements.',
      image:
        'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=80',
    },
  }[variant];

  const starterPlus = tier !== 'FREE';
  const premium = tier === 'PRO' || tier === 'BUSINESS' || tier === 'ENTERPRISE';

  const content: BuilderNode[] = [
    navbar(data.brand, [
      { label: 'Programs', href: '#programs' },
      { label: 'Instructors', href: '#instructors' },
      { label: 'Schedule', href: '#schedule' },
      { label: 'Clients', href: '#clients' },
      { label: 'Register', href: '#contact' },
    ]),
    heroBlock({
      eyebrow: 'Corporate Workshop',
      title: data.title,
      subtitle: data.subtitle,
      ctaPrimary: 'Request Proposal',
      ctaSecondary: 'Browse Programs',
      image: data.image,
      theme: 'light',
    }),
    section(
      'Training Programs by Outcome',
      'Programs grouped by business objectives to simplify enrollment decisions.',
      [
        node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-5', id: 'programs' }, [
          statCard(
            'Leadership Lab',
            'Influence, stakeholder management, and strategic communication modules.',
          ),
          statCard(
            'Operational Excellence',
            'Process mapping, problem-solving frameworks, and execution discipline.',
          ),
          statCard(
            'Innovation Sprint',
            'Rapid ideation, validation loops, and implementation planning.',
          ),
        ]),
      ],
    ),
    section(
      'Learning Outcomes and Deliverables',
      'Participants leave with practical assets they can implement immediately.',
      [
        node('Columns', { className: 'gap-5' }, [
          statCard(
            'Action Plan Deck',
            'Department-ready execution blueprint reviewed by facilitators.',
          ),
          statCard(
            'Capability Assessment',
            'Pre/post learning score and recommendation summary for each cohort.',
          ),
        ]),
      ],
    ),
    section(
      'Instructor Team',
      'Practitioners with operational leadership and facilitation track records.',
      [
        node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-4', id: 'instructors' }, [
          statCard(
            'Dina Prasetyo',
            'Former COO, specialization in cross-functional execution and team alignment.',
          ),
          statCard(
            'Arman Wibowo',
            'Enterprise transformation advisor with 15+ years consulting experience.',
          ),
          statCard(
            'Siti Rahma',
            'Learning architect focused on measurable behavior change design.',
          ),
        ]),
      ],
    ),
  ];

  if (starterPlus) {
    content.push(
      section(
        'Upcoming Cohort Schedule',
        'Open classes and private in-house options for next quarter.',
        [
          node('Stack', { className: 'gap-3', id: 'schedule' }, [
            statCard('Jakarta - Sep 12-13', 'Executive Decision Lab, 24 seats available.'),
            statCard('Bandung - Oct 03-04', 'Corporate Learning Sprint, 30 seats available.'),
            statCard('Surabaya - Nov 14-15', 'Leadership for Mid-Managers, 28 seats available.'),
          ]),
        ],
      ),
    );
  }

  if (premium) {
    content.push(
      section(
        'Corporate Clients and Testimonials',
        'Selected organizations that run recurring capability programs with us.',
        [
          node('Grid', { className: 'grid-cols-1 md:grid-cols-2 gap-5', id: 'clients' }, [
            statCard(
              'Regional Banking Group',
              '"Program outcomes improved manager execution consistency in two quarters."',
            ),
            statCard(
              'Manufacturing Conglomerate',
              '"Facilitators translated strategy into practical team-level workflows."',
            ),
          ]),
        ],
      ),
      section(
        'Frequently Asked Questions',
        'Addressing procurement, customization, and post-workshop support.',
        [
          node('Stack', { className: 'gap-3' }, [
            statCard(
              'Can programs be customized?',
              'Yes. We adapt cases, simulations, and output format to your business context.',
            ),
            statCard(
              'Do you offer virtual delivery?',
              'Hybrid and fully virtual formats are available with moderated breakout structures.',
            ),
            statCard(
              'Is post-training coaching included?',
              'For PRO and above packages, we include implementation follow-up sessions.',
            ),
          ]),
        ],
      ),
    );
  }

  content.push(
    node('CTA', {
      title: 'Build a Training Program That Delivers Measurable Business Outcomes',
      description:
        'Share your capability goals and participant profile. Our team will propose a tailored learning architecture.',
      buttonText: 'Register Interest',
      className: 'mx-4 md:mx-10 my-12',
      id: 'contact',
    }),
    footer(
      'ExecCatalyst Institute - Corporate learning partner for scale-stage and enterprise teams.',
    ),
  );

  return {
    version: 1,
    root: node('Container', { className: 'min-h-screen bg-background text-foreground' }, content),
  };
}

function buildGenericIndustryPage(
  industry: string,
  category: string,
  tier: SubscriptionTier,
): BuilderDocument {
  const premium = tier === 'PRO' || tier === 'BUSINESS' || tier === 'ENTERPRISE';
  const business = tier === 'BUSINESS' || tier === 'ENTERPRISE';

  const title = `${industry} Website Designed for ${category} Conversion`;
  const subtitle = `Production-ready architecture for ${industry.toLowerCase()} businesses. Built with practical content blocks, trust layers, and clear conversion paths.`;

  const items = [
    statCard(
      'Service Offering Overview',
      'Clarify core offers, pricing anchors, and value proposition by segment.',
    ),
    statCard(
      'Customer Trust Layer',
      'Testimonials, credentials, and proof points to reduce buying friction.',
    ),
    statCard(
      'Conversion CTA Flow',
      'Primary and secondary actions aligned with top customer intent.',
    ),
  ];

  const sections: BuilderNode[] = [
    navbar(`${industry} Studio`, [
      { label: 'Services', href: '#services' },
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ]),
    heroBlock({
      eyebrow: category,
      title,
      subtitle,
      ctaPrimary: 'Start Consultation',
      ctaSecondary: 'See Capabilities',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      theme: 'light',
    }),
    section(
      'Core Capabilities',
      'Business-critical content structure with service-first storytelling.',
      [node('Grid', { className: 'grid-cols-1 md:grid-cols-3 gap-5', id: 'services' }, items)],
    ),
    section('Implementation Approach', 'How we deliver from discovery to measurable outcomes.', [
      node('Columns', { className: 'gap-5', id: 'work' }, [
        statCard(
          'Phase 1 - Discovery',
          'Stakeholder interviews, positioning, and content strategy mapping.',
        ),
        statCard(
          'Phase 2 - Delivery',
          'Execution sprints with quality checkpoints and launch readiness.',
        ),
      ]),
    ]),
  ];

  if (premium) {
    sections.push(
      section(
        'Proof of Results',
        'Credibility blocks designed for B2B and high-ticket conversion.',
        [
          node('Grid', { className: 'grid-cols-1 md:grid-cols-2 gap-5' }, [
            statCard(
              'Client Success',
              '"We reduced lead response time by 35% in the first month."',
            ),
            statCard(
              'Operational Impact',
              '"The new structure improved qualified inquiry rate week over week."',
            ),
          ]),
        ],
      ),
    );
  }

  if (business) {
    sections.push(
      section('Enterprise Readiness', 'Governance and delivery depth for larger organizations.', [
        node('Columns', { className: 'gap-5', id: 'about' }, [
          statCard(
            'Dedicated Account Team',
            'Senior consultant, project lead, and quality assurance partner.',
          ),
          statCard(
            'SLA Commitments',
            'Response windows, milestone governance, and reporting cadence.',
          ),
        ]),
      ]),
    );
  }

  sections.push(
    node('CTA', {
      title: `Launch a ${industry} Website That Converts Better`,
      description:
        'Talk to our team to map structure, messaging, and launch milestones aligned with your business goals.',
      buttonText: 'Request Proposal',
      className: 'mx-4 md:mx-10 my-12',
      id: 'contact',
    }),
    footer(`${industry} Studio - Professional web presence framework for growing teams.`),
  );

  return {
    version: 1,
    root: node('Container', { className: 'min-h-screen bg-background text-foreground' }, sections),
  };
}

function templateSet(): TemplateSeed[] {
  return [
    {
      name: 'Luxury Resort Escape',
      industry: 'Travel',
      category: 'Landing Page',
      tier: 'ENTERPRISE',
      thumbnail:
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80',
      description:
        'High-end resort template with booking, rooms, amenities, destination highlights, and concierge CTA.',
      nav: ['Rooms', 'Amenities', 'Offers', 'Location', 'Book'],
      buildPage: () => buildTravelHotelPage('resort', 'ENTERPRISE'),
    },
    {
      name: 'Boutique City Hotel',
      industry: 'Travel',
      category: 'Corporate',
      tier: 'PRO',
      thumbnail:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      description:
        'Urban hotel website with room matrix, meeting features, corporate packages, and direct booking CTA.',
      nav: ['Rooms', 'Amenities', 'Offers', 'Location', 'Book'],
      buildPage: () => buildTravelHotelPage('city', 'PRO'),
    },
    {
      name: 'Design Boutique Stay',
      industry: 'Travel',
      category: 'Creative',
      tier: 'STARTER',
      thumbnail:
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80',
      description:
        'Boutique hotel template with local experience storytelling and conversion-focused reservation flow.',
      nav: ['Rooms', 'Amenities', 'Offers', 'Location', 'Book'],
      buildPage: () => buildTravelHotelPage('boutique', 'STARTER'),
    },
    {
      name: 'Adventure Tour Operator',
      industry: 'Travel',
      category: 'Storefront',
      tier: 'FREE',
      thumbnail:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      description:
        'Category-specific tour package template with itinerary, inclusions, pricing blocks, and booking CTA.',
      nav: ['Packages', 'Itinerary', 'Inclusions', 'Reviews', 'Book'],
      buildPage: () => buildTourPage('adventure', 'FREE'),
    },
    {
      name: 'Luxury Private Travel',
      industry: 'Travel',
      category: 'Corporate',
      tier: 'BUSINESS',
      thumbnail:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
      description:
        'Premium travel planner template for high-value clients, private journeys, and concierge planning.',
      nav: ['Packages', 'Itinerary', 'Inclusions', 'Reviews', 'Book'],
      buildPage: () => buildTourPage('luxury', 'BUSINESS'),
    },
    {
      name: 'Family Holiday Planner',
      industry: 'Travel',
      category: 'Landing Page',
      tier: 'STARTER',
      thumbnail:
        'https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=900&q=80',
      description:
        'Family-centric travel template with balanced itinerary and trust-first logistics communication.',
      nav: ['Packages', 'Itinerary', 'Inclusions', 'Reviews', 'Book'],
      buildPage: () => buildTourPage('family', 'STARTER'),
    },
    {
      name: 'Travel Agency Desk',
      industry: 'Travel',
      category: 'Corporate',
      tier: 'PRO',
      thumbnail:
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
      description:
        'Full-service travel agency template with package catalog, visa support narrative, and inquiry CTA.',
      nav: ['Packages', 'Itinerary', 'Inclusions', 'Reviews', 'Book'],
      buildPage: () => buildTourPage('agency', 'PRO'),
    },
    {
      name: 'Premium Dealership',
      industry: 'Automotive',
      category: 'Storefront',
      tier: 'BUSINESS',
      thumbnail:
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=900&q=80',
      description:
        'Automotive dealership template with model lineup, financing promo, and test-drive conversion flow.',
      nav: ['Models', 'Specs', 'Finance', 'Showroom', 'Test Ride'],
      buildPage: () => buildAutomotivePage('premium-dealer', 'BUSINESS'),
    },
    {
      name: 'Modern Motorcycle Store',
      industry: 'Automotive',
      category: 'Storefront',
      tier: 'PRO',
      thumbnail:
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
      description:
        'Motorcycle storefront template featuring model comparisons and ride-booking call-to-action.',
      nav: ['Models', 'Specs', 'Finance', 'Showroom', 'Test Ride'],
      buildPage: () => buildAutomotivePage('modern-bike', 'PRO'),
    },
    {
      name: 'Trusted Used Motorcycle',
      industry: 'Automotive',
      category: 'Storefront',
      tier: 'FREE',
      thumbnail:
        'https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d?auto=format&fit=crop&w=900&q=80',
      description:
        'Used-bike template with inspection confidence sections, financing prompt, and showroom CTA.',
      nav: ['Models', 'Specs', 'Finance', 'Showroom', 'Test Ride'],
      buildPage: () => buildAutomotivePage('used-bike', 'FREE'),
    },
    {
      name: 'Sport Bike Showroom',
      industry: 'Automotive',
      category: 'Creative',
      tier: 'ENTERPRISE',
      thumbnail:
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
      description:
        'High-energy sport bike layout for premium performance lineup and event-style lead capture.',
      nav: ['Models', 'Specs', 'Finance', 'Showroom', 'Test Ride'],
      buildPage: () => buildAutomotivePage('sport-showroom', 'ENTERPRISE'),
    },
    {
      name: 'Executive Training Institute',
      industry: 'Education',
      category: 'Corporate',
      tier: 'PRO',
      thumbnail:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
      description:
        'Corporate workshop template with outcome-driven program structure and proposal CTA.',
      nav: ['Programs', 'Instructors', 'Schedule', 'Clients', 'Register'],
      buildPage: () => buildWorkshopPage('executive', 'PRO'),
    },
    {
      name: 'Creative Workshop Studio',
      industry: 'Creative',
      category: 'Creative',
      tier: 'STARTER',
      thumbnail:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
      description:
        'Creative workshop website with curriculum blocks, facilitator profiles, and cohort registration CTA.',
      nav: ['Programs', 'Instructors', 'Schedule', 'Clients', 'Register'],
      buildPage: () => buildWorkshopPage('creative', 'STARTER'),
    },
    {
      name: 'Corporate Learning Hub',
      industry: 'Education',
      category: 'Corporate',
      tier: 'BUSINESS',
      thumbnail:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
      description:
        'Enterprise learning template for L&D teams with KPI-linked tracks and governance positioning.',
      nav: ['Programs', 'Instructors', 'Schedule', 'Clients', 'Register'],
      buildPage: () => buildWorkshopPage('corporate-learning', 'BUSINESS'),
    },
    {
      name: 'Professional Certification Bootcamp',
      industry: 'Education',
      category: 'Landing Page',
      tier: 'FREE',
      thumbnail:
        'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
      description:
        'Certification training template with program tracks, instructor proof, and conversion-ready enrollment CTA.',
      nav: ['Programs', 'Instructors', 'Schedule', 'Clients', 'Register'],
      buildPage: () => buildWorkshopPage('certification', 'FREE'),
    },

    // Additional category-specific, non-generic templates for existing industries.
    {
      name: 'Restaurant Signature Dining',
      industry: 'Restaurant',
      category: 'Storefront',
      tier: 'STARTER',
      thumbnail:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
      description:
        'Restaurant template with signature menu focus, reservation flow, and chef-led storytelling.',
      nav: ['Menu', 'Chef', 'Reservations', 'Events', 'Visit'],
      buildPage: () => buildGenericIndustryPage('Restaurant', 'Storefront', 'STARTER'),
    },
    {
      name: 'Coffee Roastery House',
      industry: 'Coffee Shop',
      category: 'Landing Page',
      tier: 'FREE',
      thumbnail:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
      description:
        'Coffee business template with roast profile storytelling, menu highlights, and visit CTA.',
      nav: ['Coffee', 'Menu', 'Roastery', 'Events', 'Visit'],
      buildPage: () => buildGenericIndustryPage('Coffee Shop', 'Landing Page', 'FREE'),
    },
    {
      name: 'Agency Conversion Studio',
      industry: 'Agency',
      category: 'Portfolio',
      tier: 'PRO',
      thumbnail:
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80',
      description:
        'Agency layout focused on case outcomes, service pillars, and proposal request conversion.',
      nav: ['Services', 'Cases', 'Process', 'Team', 'Contact'],
      buildPage: () => buildGenericIndustryPage('Agency', 'Portfolio', 'PRO'),
    },
    {
      name: 'Fashion Commerce House',
      industry: 'E-Commerce',
      category: 'Storefront',
      tier: 'BUSINESS',
      thumbnail:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
      description:
        'E-commerce template with collection spotlight, campaign rhythm, and checkout-intent CTA.',
      nav: ['Collections', 'New In', 'Lookbook', 'Offers', 'Shop'],
      buildPage: () => buildGenericIndustryPage('E-Commerce', 'Storefront', 'BUSINESS'),
    },
    {
      name: 'Wellness Beauty Studio',
      industry: 'Salon',
      category: 'Landing Page',
      tier: 'STARTER',
      thumbnail:
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
      description:
        'Beauty and salon template with treatment catalog, therapist trust signals, and booking CTA.',
      nav: ['Treatments', 'Team', 'Packages', 'Reviews', 'Book'],
      buildPage: () => buildGenericIndustryPage('Salon', 'Landing Page', 'STARTER'),
    },
    {
      name: 'Property Advisory Group',
      industry: 'Real Estate',
      category: 'Corporate',
      tier: 'PRO',
      thumbnail:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
      description:
        'Real estate template with listing confidence blocks and consultation booking strategy.',
      nav: ['Listings', 'Services', 'Market Insight', 'Team', 'Consult'],
      buildPage: () => buildGenericIndustryPage('Real Estate', 'Corporate', 'PRO'),
    },
    {
      name: 'Performance Fitness Center',
      industry: 'Fitness',
      category: 'Landing Page',
      tier: 'FREE',
      thumbnail:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
      description:
        'Fitness center template with class offer structure, trainer proof, and membership CTA.',
      nav: ['Programs', 'Trainers', 'Schedule', 'Plans', 'Join'],
      buildPage: () => buildGenericIndustryPage('Fitness', 'Landing Page', 'FREE'),
    },
    {
      name: 'Community Healthcare Clinic',
      industry: 'Healthcare',
      category: 'Corporate',
      tier: 'STARTER',
      thumbnail:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
      description:
        'Healthcare template with service map, doctor trust profile, and appointment CTA.',
      nav: ['Services', 'Doctors', 'Insurance', 'FAQ', 'Appointment'],
      buildPage: () => buildGenericIndustryPage('Healthcare', 'Corporate', 'STARTER'),
    },
    {
      name: 'Consulting Growth Partner',
      industry: 'Consulting',
      category: 'Corporate',
      tier: 'ENTERPRISE',
      thumbnail:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
      description:
        'Consulting website with enterprise positioning, methodology narrative, and deal-focused CTA.',
      nav: ['Advisory', 'Industries', 'Methodology', 'Insights', 'Contact'],
      buildPage: () => buildGenericIndustryPage('Consulting', 'Corporate', 'ENTERPRISE'),
    },
  ];
}

async function seedSystemSettings() {
  const settings = [
    {
      key: 'MAINTENANCE_MODE',
      value: 'false',
      description: 'Enable maintenance mode',
      isPublic: true,
    },
    {
      key: 'ALLOW_REGISTRATION',
      value: 'true',
      description: 'Allow new user registration',
      isPublic: true,
    },
    { key: 'MAX_FREE_SITES', value: '1', description: 'Max sites for free tier', isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
}

async function seedIndustries() {
  const names = [
    'Restaurant',
    'Coffee Shop',
    'Agency',
    'Consulting',
    'E-Commerce',
    'Salon',
    'Real Estate',
    'Fitness',
    'Healthcare',
    'Education',
    'Automotive',
    'Travel',
    'Creative',
  ];

  const map: Record<string, string> = {};
  for (const name of names) {
    const row = await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    map[name] = row.id;
  }
  return map;
}

async function seedCategories() {
  const names = ['Landing Page', 'Storefront', 'Portfolio', 'Corporate', 'Creative'];
  const map: Record<string, string> = {};

  for (const name of names) {
    const row = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    map[name] = row.id;
  }
  return map;
}

async function upsertTemplate(
  seed: TemplateSeed,
  industryMap: Record<string, string>,
  categoryMap: Record<string, string>,
) {
  const homePageId = randomUUID();
  const payload = {
    metadata: {
      version: '2.0',
      status: 'Published',
      thumbnail: seed.thumbnail,
      description: seed.description,
      categoryDesignIntent: seed.category,
      businessNav: seed.nav,
      seededAt: new Date().toISOString(),
    },
    pages: [
      {
        id: homePageId,
        slug: '/',
        title: 'Home',
        order: 0,
        nodeTree: seed.buildPage(),
      },
    ],
    theme: {
      colors: {
        primary: '221.2 83.2% 53.3%',
        background: '0 0% 100%',
        foreground: '222.2 84% 4.9%',
        card: '0 0% 100%',
        cardForeground: '222.2 84% 4.9%',
        border: '214.3 31.8% 91.4%',
        muted: '210 40% 96.1%',
        mutedForeground: '215.4 16.3% 46.9%',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingFontFamily: 'Inter, sans-serif',
      },
      radius: '0.75rem',
    },
    navigation: {
      navbar: [
        {
          id: randomUUID(),
          label: 'Home',
          type: 'page',
          pageId: homePageId,
        },
        ...seed.nav.map((label) => ({
          id: randomUUID(),
          label,
          type: 'anchor',
          target: `#${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        })),
      ],
      footer: [],
    },
  };

  const existing = await prisma.template.findFirst({ where: { name: seed.name } });

  const data = {
    name: seed.name,
    industryId: industryMap[seed.industry],
    categoryId: categoryMap[seed.category],
    requiredTier: seed.tier,
    defaultTree: payload as any,
  };

  if (existing) {
    await prisma.template.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.template.create({ data });
  }
}

function detectTemplateDocument(
  templateName: string,
  industryName: string,
  categoryName: string,
  tier: SubscriptionTier,
): BuilderDocument {
  const key = templateName.toLowerCase();
  const ind = industryName.toLowerCase();

  if (ind.includes('travel')) {
    if (key.includes('hotel') || key.includes('resort')) {
      if (key.includes('luxury') || key.includes('premium'))
        return buildTravelHotelPage('resort', tier);
      if (key.includes('city')) return buildTravelHotelPage('city', tier);
      return buildTravelHotelPage('boutique', tier);
    }
    if (key.includes('tour') || key.includes('adventure')) return buildTourPage('adventure', tier);
    if (key.includes('family')) return buildTourPage('family', tier);
    if (key.includes('agency')) return buildTourPage('agency', tier);
    return buildTourPage('luxury', tier);
  }

  if (ind.includes('automotive')) {
    if (key.includes('used')) return buildAutomotivePage('used-bike', tier);
    if (key.includes('sport')) return buildAutomotivePage('sport-showroom', tier);
    if (key.includes('motorcycle') || key.includes('bike'))
      return buildAutomotivePage('modern-bike', tier);
    return buildAutomotivePage('premium-dealer', tier);
  }

  if (key.includes('workshop') || key.includes('training') || key.includes('certification')) {
    if (key.includes('executive')) return buildWorkshopPage('executive', tier);
    if (key.includes('creative')) return buildWorkshopPage('creative', tier);
    if (key.includes('certification')) return buildWorkshopPage('certification', tier);
    return buildWorkshopPage('corporate-learning', tier);
  }

  return buildGenericIndustryPage(industryName, categoryName, tier);
}

async function refreshLegacyTemplates(curatedNames: string[]) {
  const templates = await prisma.template.findMany({
    include: {
      industry: true,
      category: true,
    },
  });

  const curated = new Set(curatedNames);

  for (const tpl of templates) {
    if (curated.has(tpl.name)) continue;

    const pageId = randomUUID();
    const document = detectTemplateDocument(
      tpl.name,
      tpl.industry.name,
      tpl.category.name,
      tpl.requiredTier,
    );

    const payload = {
      metadata: {
        version: '2.0',
        status: 'Published',
        thumbnail:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
        description: `${tpl.industry.name} template rebuilt with ${tpl.category.name} information architecture and ${tpl.requiredTier} sophistication.`,
        migratedFromLegacy: true,
      },
      pages: [
        {
          id: pageId,
          slug: '/',
          title: 'Home',
          order: 0,
          nodeTree: document,
        },
      ],
      theme: {
        colors: {
          primary: '221.2 83.2% 53.3%',
          background: '0 0% 100%',
          foreground: '222.2 84% 4.9%',
          card: '0 0% 100%',
          cardForeground: '222.2 84% 4.9%',
          border: '214.3 31.8% 91.4%',
          muted: '210 40% 96.1%',
          mutedForeground: '215.4 16.3% 46.9%',
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          headingFontFamily: 'Inter, sans-serif',
        },
        radius: '0.75rem',
      },
      navigation: {
        navbar: [
          {
            id: randomUUID(),
            label: 'Home',
            type: 'page',
            pageId,
          },
          {
            id: randomUUID(),
            label: 'Contact',
            type: 'anchor',
            target: '#contact',
          },
        ],
        footer: [],
      },
    };

    await prisma.template.update({
      where: { id: tpl.id },
      data: {
        defaultTree: payload as any,
      },
    });

    console.log(`Redesigned existing template: ${tpl.name}`);
  }
}

async function main() {
  console.log('Seeding database...');

  await seedSystemSettings();
  const industryMap = await seedIndustries();
  const categoryMap = await seedCategories();

  const templates = templateSet();

  for (const tpl of templates) {
    await upsertTemplate(tpl, industryMap, categoryMap);
    console.log(`Processed template: ${tpl.name}`);
  }

  await refreshLegacyTemplates(templates.map((t) => t.name));

  console.log(`Done. Processed ${templates.length} templates.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
