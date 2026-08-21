import { buildRoot, generateId } from './utils';

export const getEnterpriseTemplate = (categories: any, industries: any) => ({
  name: 'Axiom Cloud Systems',
  categoryId: categories['SaaS'].id,
  industryId: industries['Business & Professional'].id,
  requiredTier: 'ENTERPRISE',
  defaultTree: {
    metadata: {
      version: '1.1',
      status: 'PUBLISHED',
      thumbnail:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
      description:
        'Layout paling padat dan terstruktur untuk SaaS enterprise global — status bar sistem, panel spesifikasi, tab navigasi internal, grid metrik monospace, dan badge kepatuhan. Level tertinggi, di atas Business.',
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
              { name: 'icon', type: 'string' },
            ],
          },
        },
      ],
      entries: [
        {
          modelId: 'cms-solutions',
          status: 'PUBLISHED',
          data: {
            name: 'Infrastruktur Cloud',
            description: 'Arsitektur komputasi terdistribusi berskala hiper.',
            icon: '☁️',
          },
        },
        {
          modelId: 'cms-solutions',
          status: 'PUBLISHED',
          data: {
            name: 'Data Intelligence',
            description: 'Analitik prediktif bertenaga model machine learning.',
            icon: '🧠',
          },
        },
        {
          modelId: 'cms-solutions',
          status: 'PUBLISHED',
          data: {
            name: 'Keamanan Zero-Trust',
            description: 'Kerangka kriptografi tingkat militer untuk proteksi data.',
            icon: '🔒',
          },
        },
        {
          modelId: 'cms-solutions',
          status: 'PUBLISHED',
          data: {
            name: 'Konektivitas Global',
            description: 'Routing latensi rendah di 150+ titik edge regional.',
            icon: '🌐',
          },
        },
      ],
    },
    pages: [
      {
        id: 'tpl-enterprise-home',
        slug: '/',
        title: 'Home',
        order: 0,
        nodeTree: buildRoot([
          // STATUS BAR — fitur baru, khas ops/SaaS enterprise, tak ada di tier manapun sebelumnya
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'bg-foreground text-background py-2 px-4 md:px-8 text-xs font-mono tracking-wide',
            },
            children: [
              {
                id: generateId(),
                type: 'Columns',
                props: {
                  className:
                    'justify-between items-center max-w-7xl mx-auto flex-col sm:flex-row gap-1 sm:gap-0',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: '● Semua Sistem Beroperasi Normal',
                      className: 'text-emerald-400 font-bold',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'status.axiomcloud.io  •  SLA 99.999%',
                      className: 'opacity-70',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // NAVBAR — dense mega-menu style
          {
            id: generateId(),
            type: 'Navbar',
            props: {
              logoText: 'AXIOM CLOUD SYSTEMS',
              className:
                'py-6 bg-background border-b border-border tracking-[0.2em] font-black text-foreground px-4 md:px-8 shadow-sm',
              links: [
                { label: 'Solusi ▼', href: '#' },
                { label: 'Platform ▼', href: '#' },
                { label: 'Industri', href: '#' },
                { label: 'Mitra', href: '#' },
                { label: 'Sumber Daya', href: '#' },
                { label: 'Perusahaan', href: '#' },
              ],
            },
            children: [],
          },

          // HERO — dengan panel spesifikasi mengambang (data-sheet look), bukan badge biasa
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'bg-background text-foreground py-32 md:py-48 text-center border-b border-border bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden',
            },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: {
                  className:
                    'hidden lg:block absolute top-16 right-12 border border-border bg-card/90 backdrop-blur px-5 py-4 font-mono text-xs text-left shadow-lg',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'v4.2.1-stable\nregion: global\nuptime: 99.999%',
                      className: 'text-muted-foreground whitespace-pre-line leading-relaxed',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'px-4 relative z-10 max-w-5xl mx-auto' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'ENTERPRISE OPERATING SYSTEM',
                      level: 6,
                      className:
                        'text-primary tracking-[0.3em] font-bold text-xs md:text-sm mb-8 uppercase border border-primary/20 inline-block px-6 py-2 bg-primary/5 rounded-full',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Merancang Masa Depan Perdagangan Global.',
                      level: 1,
                      className:
                        'text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-foreground',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Axiom Cloud Systems menghadirkan infrastruktur hiper-skalabel, kecerdasan berbasis AI, dan protokol keamanan tanpa kompromi untuk organisasi Fortune 500 paling menuntut di dunia.',
                      className:
                        'text-muted-foreground mb-12 text-lg md:text-2xl max-w-4xl mx-auto font-light leading-relaxed',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: {
                      className: 'justify-center gap-6 flex-col sm:flex-row max-w-xl mx-auto',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Minta Demo Enterprise',
                          variant: 'default',
                          className:
                            'w-full bg-primary text-primary-foreground rounded-none px-10 py-7 text-sm tracking-widest uppercase font-bold shadow-lg hover:shadow-primary/25 transition-all',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Hubungi Sales',
                          variant: 'outline',
                          className:
                            'w-full rounded-none px-10 py-7 text-sm tracking-widest uppercase font-bold border-2 border-foreground',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // TRUST BAR
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
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'DIPERCAYA OLEH 94% PERUSAHAAN FORTUNE 100',
                      className:
                        'text-xs uppercase tracking-[0.2em] font-bold mb-10 text-foreground/50',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: { className: 'justify-around items-center opacity-60 flex-wrap gap-8' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'ACME CORP',
                          level: 4,
                          className: 'text-xl font-black tracking-widest',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'GLOBAL BANK',
                          level: 4,
                          className: 'text-xl font-black tracking-widest',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'NEXUS',
                          level: 4,
                          className: 'text-xl font-black tracking-widest',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'VERTEX',
                          level: 4,
                          className: 'text-xl font-black tracking-widest',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'OMEGA',
                          level: 4,
                          className: 'text-xl font-black tracking-widest',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // KAPABILITAS — dense grid, satu kartu highlight primary
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border',
            },
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
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: 'Kapabilitas',
                              className:
                                'text-primary tracking-[0.2em] font-bold text-sm mb-4 uppercase',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: 'Skala Tanpa Batas. Kontrol Tanpa Kompromi.',
                              className:
                                'text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Arsitektur proprietary kami mendesentralisasi komputasi sambil mensentralisasi tata kelola, memungkinkan tim global beroperasi dengan kelincahan lokal dan kepatuhan setingkat enterprise.',
                          className:
                            'w-full lg:w-1/2 text-lg md:text-xl text-muted-foreground leading-relaxed pt-2',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Kepatuhan & Tata Kelola',
                          description:
                            'Penegakan kebijakan otomatis di semua zona yurisdiksi (GDPR, HIPAA, SOC2 Type II).',
                          icon: '01',
                          className: 'bg-card border border-border p-10 rounded-none shadow-sm',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Hybrid Deployment',
                          description:
                            'Orkestrasi mulus di lingkungan on-premise, private cloud, dan public cloud.',
                          icon: '02',
                          className: 'bg-card border border-border p-10 rounded-none shadow-sm',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Enkripsi Quantum-Safe',
                          description:
                            'Algoritma kriptografi generasi berikutnya melindungi data saat transit dan diam.',
                          icon: '03',
                          className: 'bg-card border border-border p-10 rounded-none shadow-sm',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Manajemen Identitas',
                          description:
                            'Federated SSO, MFA biometrik, dan role-based access control dengan izin granular.',
                          icon: '04',
                          className: 'bg-card border border-border p-10 rounded-none shadow-sm',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Analitik Prediktif',
                          description:
                            'Model machine learning proprietary memprediksi bottleneck operasional sebelum terjadi.',
                          icon: '05',
                          className: 'bg-card border border-border p-10 rounded-none shadow-sm',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Feature',
                        props: {
                          title: 'Dukungan NOC 24/7/365',
                          description:
                            'Site reliability engineer khusus memonitor infrastruktur Anda dengan SLA terjamin.',
                          icon: '06',
                          className:
                            'bg-primary text-primary-foreground border border-primary p-10 rounded-none shadow-sm',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // SOLUSI PLATFORM — dengan tab navigasi internal (fitur baru, khas Enterprise)
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'py-24 md:py-32 bg-muted px-4 md:px-8 border-b border-border relative',
            },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'max-w-7xl mx-auto' },
                children: [
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: {
                      className:
                        'flex-col md:flex-row justify-between items-end mb-10 gap-8 border-b border-border pb-8',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'max-w-2xl' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: 'Solusi Platform',
                              className:
                                'text-3xl md:text-5xl font-black text-foreground tracking-tight uppercase',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Lihat Arsitektur Platform',
                          variant: 'outline',
                          className:
                            'rounded-none border-foreground text-foreground px-8 py-5 uppercase text-xs tracking-widest font-bold',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: { className: 'gap-2 flex-wrap mb-10' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Semua',
                          variant: 'default',
                          className: 'rounded-none text-xs uppercase font-mono',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Infrastruktur',
                          variant: 'outline',
                          className: 'rounded-none text-xs uppercase font-mono border-border',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Keamanan',
                          variant: 'outline',
                          className: 'rounded-none text-xs uppercase font-mono border-border',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Data & AI',
                          variant: 'outline',
                          className: 'rounded-none text-xs uppercase font-mono border-border',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'CmsList',
                    props: {
                      modelId: 'cms-solutions',
                      limit: 4,
                      className: 'border-0 bg-transparent p-0',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // METRIK GLOBAL — grid bordered lebih rapat, angka monospace
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'py-24 md:py-32 bg-background text-foreground border-b border-border px-4 md:px-8',
            },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'max-w-7xl mx-auto' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Metrik Jaringan Global',
                      className:
                        'text-3xl md:text-4xl font-black uppercase mb-12 tracking-tight text-center',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-2 md:grid-cols-4 gap-0 border border-border' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-10 border-r border-b border-border' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: '99.999%',
                              className:
                                'text-4xl lg:text-5xl font-mono font-light text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Jaminan SLA Uptime',
                              className:
                                'text-xs uppercase tracking-widest font-bold text-muted-foreground',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-10 border-r border-b border-border' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: '150+',
                              className:
                                'text-4xl lg:text-5xl font-mono font-light text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Lokasi Edge Global',
                              className:
                                'text-xs uppercase tracking-widest font-bold text-muted-foreground',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-10 border-r border-b border-border' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: '<10ms',
                              className:
                                'text-4xl lg:text-5xl font-mono font-light text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Rata-rata Latensi Global',
                              className:
                                'text-xs uppercase tracking-widest font-bold text-muted-foreground',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-10 border-b border-border' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: '50PB+',
                              className:
                                'text-4xl lg:text-5xl font-mono font-light text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Data Diproses Harian',
                              className:
                                'text-xs uppercase tracking-widest font-bold text-muted-foreground',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // KEPATUHAN — baris badge sertifikasi, fitur baru unik Enterprise
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'py-16 bg-muted border-b border-border px-4 md:px-8' },
            children: [
              {
                id: generateId(),
                type: 'Text',
                props: {
                  text: 'SERTIFIKASI & KEPATUHAN',
                  className:
                    'text-center text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className: 'grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {
                      className:
                        'border border-border bg-background text-center py-4 font-mono text-xs font-bold tracking-widest',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'SOC 2 TYPE II', className: '' },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {
                      className:
                        'border border-border bg-background text-center py-4 font-mono text-xs font-bold tracking-widest',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'ISO 27001', className: '' },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {
                      className:
                        'border border-border bg-background text-center py-4 font-mono text-xs font-bold tracking-widest',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'GDPR', className: '' },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {
                      className:
                        'border border-border bg-background text-center py-4 font-mono text-xs font-bold tracking-widest',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'HIPAA', className: '' },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {
                      className:
                        'border border-border bg-background text-center py-4 font-mono text-xs font-bold tracking-widest col-span-2 md:col-span-1',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'FEDRAMP', className: '' },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // CTA
          {
            id: generateId(),
            type: 'CTA',
            props: {
              title: 'Transformasikan Enterprise Anda.',
              description:
                'Bergabunglah dengan organisasi terdepan dunia dalam mempercepat transformasi digital. Hubungi tim sales enterprise kami untuk peninjauan arsitektur khusus.',
              buttonText: 'Hubungi Sales',
              className: 'bg-foreground text-background rounded-none m-0 py-32 border-0',
            },
            children: [],
          },

          // FOOTER — mega footer, ditambah baris kantor regional & compliance
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
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              text: 'AXIOM CLOUD SYSTEMS',
                              level: 5,
                              className: 'font-black tracking-[0.2em] mb-4',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Enterprise Operating System.',
                              className: 'text-muted-foreground text-sm leading-relaxed mb-6',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '1-800-AXIOM-OPS\nsales@axiomcloud.io',
                              className:
                                'text-foreground font-bold text-sm leading-relaxed whitespace-pre-line',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Grid',
                        props: { className: 'grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Stack',
                            props: { className: 'gap-3' },
                            children: [
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Solusi',
                                  className:
                                    'font-bold uppercase tracking-wider text-xs mb-2 text-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Infrastruktur Cloud',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Data Intelligence',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Keamanan Zero-Trust',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            id: generateId(),
                            type: 'Stack',
                            props: { className: 'gap-3' },
                            children: [
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Platform',
                                  className:
                                    'font-bold uppercase tracking-wider text-xs mb-2 text-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Arsitektur',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Integrasi',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Dokumentasi',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            id: generateId(),
                            type: 'Stack',
                            props: { className: 'gap-3' },
                            children: [
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Perusahaan',
                                  className:
                                    'font-bold uppercase tracking-wider text-xs mb-2 text-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Tentang Kami',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Karier',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Investor',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                            ],
                          },
                          {
                            id: generateId(),
                            type: 'Stack',
                            props: { className: 'gap-3' },
                            children: [
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Legal',
                                  className:
                                    'font-bold uppercase tracking-wider text-xs mb-2 text-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Kebijakan Privasi',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Ketentuan Layanan',
                                  className: 'text-sm text-muted-foreground',
                                },
                                children: [],
                              },
                              {
                                id: generateId(),
                                type: 'Text',
                                props: {
                                  text: 'Security Trust Center',
                                  className: 'text-sm text-muted-foreground',
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
                    type: 'Text',
                    props: {
                      text: '© 2026 Axiom Cloud Systems, Inc. Seluruh hak dilindungi. Kantor Regional: San Francisco | London | Singapura | Tokyo',
                      className:
                        'text-xs text-muted-foreground border-t border-border pt-8 text-center md:text-left',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ]),
      },
    ],
    theme: {
      colors: { primary: '217.2 91.2% 59.8%' },
      typography: { fontFamily: 'Inter, sans-serif', headingFontFamily: 'Inter, sans-serif' },
      radius: '0',
    },
  },
});
