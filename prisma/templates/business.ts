import { buildRoot, generateId } from './utils';

export const getBusinessTemplate = (categories: any, industries: any) => ({
  name: 'Solstice Auto Group',
  categoryId: categories['Automotive'].id,
  industryId: industries['Automotive & Transport'].id,
  requiredTier: 'BUSINESS',
  defaultTree: {
    metadata: {
      version: '1.2',
      status: 'PUBLISHED',
      thumbnail:
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop',
      description:
        'Template kelas enterprise untuk dealer besar — utility bar, inventaris dinamis via CMS, filter fungsional, logo mitra, dan footer multi-kolom. Estetika teknis yang presisi dan tenang, level paling atas dibanding Pro.',
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
              { name: 'specs', type: 'string' },
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
            model: '911 Carrera S',
            price: 134000,
            specs: '3.0L Twin-Turbo Flat-6 | 443 HP',
            image: 'https://images.unsplash.com/photo-1503376762364-53bede51221b?q=80&w=400',
          },
        },
        {
          modelId: 'cms-vehicles',
          status: 'PUBLISHED',
          data: {
            make: 'Audi',
            model: 'R8 V10 Performance',
            price: 208000,
            specs: '5.2L Naturally Aspirated V10 | 602 HP',
            image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400',
          },
        },
        {
          modelId: 'cms-vehicles',
          status: 'PUBLISHED',
          data: {
            make: 'BMW',
            model: 'M4 Competition xDrive',
            price: 88000,
            specs: '3.0L Twin-Turbo Inline-6 | 503 HP',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=400',
          },
        },
        {
          modelId: 'cms-vehicles',
          status: 'PUBLISHED',
          data: {
            make: 'Mercedes-Benz',
            model: 'AMG GT 63',
            price: 162000,
            specs: '4.0L Biturbo V8 | 577 HP',
            image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=400',
          },
        },
      ],
    },
    pages: [
      {
        id: 'tpl-business-home',
        slug: '/',
        title: 'Home',
        order: 0,
        nodeTree: buildRoot([
          // UTILITY BAR — fitur khas enterprise, tidak ada di tier lain
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'bg-foreground text-background py-2 px-4 md:px-8 text-xs tracking-widest uppercase',
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
                      text: 'Buka Senin–Sabtu, 09.00–19.00',
                      className: 'opacity-80',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: '1-800-SOLSTICE  •  Hubungi Penasihat Penjualan',
                      className: 'font-bold',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // NAVBAR
          {
            id: generateId(),
            type: 'Navbar',
            props: {
              logoText: 'SOLSTICE //',
              className:
                'py-5 bg-background border-b border-border tracking-widest font-bold text-foreground px-4 md:px-8',
              links: [
                { label: 'Inventaris', href: '#' },
                { label: 'Bersertifikat', href: '#' },
                { label: 'Leasing & Finansial', href: '#' },
                { label: 'Servis', href: '#' },
                { label: 'Tentang Kami', href: '#' },
              ],
            },
            children: [],
          },

          // HERO
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'bg-background text-foreground py-32 md:py-48 text-center bg-[url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200)] bg-cover bg-center bg-blend-overlay bg-black/80',
            },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'px-4' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'DEALER PREMIUM RESMI',
                      level: 6,
                      className:
                        'text-primary tracking-[0.2em] font-bold text-xs md:text-sm mb-6 uppercase border border-primary/30 inline-block px-4 py-2 bg-black/40 backdrop-blur-sm',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Direkayasa untuk Kesempurnaan.',
                      level: 1,
                      className:
                        'text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase text-white drop-shadow-2xl',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Jelajahi koleksi kendaraan performa tinggi dan mewah pilihan kami. Setiap unit dalam inventaris kami mewakili puncak rekayasa otomotif.',
                      className:
                        'text-white/90 mb-12 text-lg md:text-2xl max-w-4xl mx-auto font-light leading-relaxed drop-shadow-md',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: {
                      className: 'justify-center gap-4 flex-col sm:flex-row max-w-lg mx-auto',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Lihat Inventaris',
                          variant: 'default',
                          className:
                            'w-full bg-primary text-primary-foreground rounded-none px-10 py-6 text-sm tracking-widest uppercase font-bold hover:bg-primary/90',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Nilai Tukar Tambah',
                          variant: 'outline',
                          className:
                            'w-full bg-transparent border-2 border-white text-white rounded-none px-10 py-6 text-sm tracking-widest uppercase font-bold hover:bg-white hover:text-black',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // STAT BAR
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'py-0 bg-card text-card-foreground border-b border-border shadow-sm relative z-10',
            },
            children: [
              {
                id: generateId(),
                type: 'Columns',
                props: {
                  className:
                    'flex-col md:flex-row text-center divide-y md:divide-y-0 md:divide-x divide-border',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'w-full py-12 px-4' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: '500+',
                          className: 'text-4xl md:text-5xl font-light mb-2 text-primary',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Kendaraan Premium Terkirim',
                          className:
                            'text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-bold',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'w-full py-12 px-4 bg-muted/30' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: '150-Titik',
                          className: 'text-4xl md:text-5xl font-light mb-2 text-primary',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Standar Inspeksi Ketat',
                          className:
                            'text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-bold',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'w-full py-12 px-4' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: '24/7',
                          className: 'text-4xl md:text-5xl font-light mb-2 text-primary',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Dukungan Klien Concierge',
                          className:
                            'text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em] font-bold',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // KUALITAS
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border',
            },
            children: [
              {
                id: generateId(),
                type: 'Columns',
                props: {
                  className: 'flex-col md:flex-row items-center gap-12 md:gap-16 max-w-7xl mx-auto',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'flex-1 w-full md:w-1/2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'Standar Kualitas Tanpa Kompromi',
                          className:
                            'text-3xl md:text-5xl font-black mb-6 text-foreground tracking-tight uppercase',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Setiap kendaraan di showroom kami diperiksa dan disertifikasi secara teliti oleh teknisi ahli kami, menggunakan peralatan diagnostik mutakhir agar performa sesuai spesifikasi pabrik.',
                          className:
                            'text-base md:text-lg text-muted-foreground mb-8 leading-relaxed',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Grid',
                        props: { className: 'grid-cols-1 sm:grid-cols-2 gap-4 mb-10' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '✓ Inspeksi 150 Titik',
                              className: 'font-bold text-sm uppercase tracking-wider',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '✓ Teknisi Bersertifikat Pabrik',
                              className: 'font-bold text-sm uppercase tracking-wider',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '✓ Jaminan Riwayat Bersih',
                              className: 'font-bold text-sm uppercase tracking-wider',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '✓ Garansi Komprehensif 12 Bulan',
                              className: 'font-bold text-sm uppercase tracking-wider',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Baca Proses Sertifikasi Kami',
                          variant: 'outline',
                          className:
                            'self-start rounded-none border-2 border-foreground text-foreground font-bold uppercase tracking-wider text-xs px-8 py-5 hover:bg-foreground hover:text-background transition-colors',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=800',
                      className:
                        'flex-1 w-full md:w-1/2 rounded-none shadow-2xl border border-border',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // INVENTARIS LIVE — dengan filter fungsional
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
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Inventaris Real-Time',
                      className:
                        'text-3xl md:text-5xl font-black text-foreground tracking-tight uppercase mb-4',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Ketersediaan armada performa kami saat ini, tersinkronisasi langsung dengan sistem manajemen inventaris enterprise kami.',
                      className: 'text-muted-foreground text-lg leading-relaxed',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Container',
                props: {
                  className:
                    'max-w-7xl mx-auto mb-6 bg-card border border-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Filter:',
                      className:
                        'font-bold uppercase tracking-widest text-sm text-muted-foreground',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Columns',
                    props: { className: 'gap-2 flex-wrap justify-center' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Semua Model',
                          variant: 'default',
                          className: 'rounded-none text-xs uppercase',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Performa',
                          variant: 'outline',
                          className: 'rounded-none text-xs uppercase border-border',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'SUV',
                          variant: 'outline',
                          className: 'rounded-none text-xs uppercase border-border',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Sedan',
                          variant: 'outline',
                          className: 'rounded-none text-xs uppercase border-border',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'CmsList',
                props: {
                  modelId: 'cms-vehicles',
                  limit: 8,
                  className: 'max-w-7xl mx-auto border-0 bg-transparent p-0',
                },
                children: [],
              },
            ],
          },

          // MITRA — logo cloud, sinyal kepercayaan enterprise (baru, tak ada di tier lain)
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'py-16 bg-background border-b border-border px-4 md:px-8' },
            children: [
              {
                id: generateId(),
                type: 'Text',
                props: {
                  text: 'DIPERCAYA OLEH MITRA KORPORAT & KOLEKTOR TERKEMUKA',
                  className:
                    'text-center text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className:
                    'grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto items-center justify-items-center opacity-60',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'MERIDIAN CAPITAL',
                      className: 'font-black tracking-tight text-lg',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: { text: 'ATLAS GROUP', className: 'font-black tracking-tight text-lg' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: { text: 'NORTHPEAK', className: 'font-black tracking-tight text-lg' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: { text: 'IRONVALE', className: 'font-black tracking-tight text-lg' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'CASCADE HOLDINGS',
                      className: 'font-black tracking-tight text-lg',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // SERVIS
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border',
            },
            children: [
              {
                id: generateId(),
                type: 'Columns',
                props: {
                  className:
                    'flex-col md:flex-row-reverse items-center gap-12 md:gap-16 max-w-7xl mx-auto',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'flex-1 w-full md:w-1/2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'Pusat Servis Resmi',
                          className:
                            'text-3xl md:text-5xl font-black mb-6 text-foreground tracking-tight uppercase',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Fasilitas kami didukung teknisi bersertifikat pabrik dan suku cadang OEM asli. Dari perawatan rutin hingga overhaul mesin kompleks, kami menjaga nilai investasi Anda.',
                          className:
                            'text-base md:text-lg text-muted-foreground mb-8 leading-relaxed',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Grid',
                        props: {
                          className:
                            'grid-cols-2 gap-y-4 gap-x-8 mb-10 border-t border-b border-border py-6',
                        },
                        children: [
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '• Perawatan Terjadwal',
                              className: 'text-sm font-medium',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '• Mesin & Transmisi',
                              className: 'text-sm font-medium',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '• Performance Tuning',
                              className: 'text-sm font-medium',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '• Persiapan Track Day',
                              className: 'text-sm font-medium',
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Jadwalkan Servis',
                          variant: 'default',
                          className:
                            'self-start rounded-none px-10 py-5 font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-primary/90',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800',
                      className:
                        'flex-1 w-full md:w-1/2 rounded-none shadow-2xl border border-border',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // TESTIMONI — 3 kartu untuk kesan skala lebih besar dari Pro
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'py-24 md:py-32 bg-muted text-center px-4 md:px-8 border-b border-border',
            },
            children: [
              {
                id: generateId(),
                type: 'Heading',
                props: {
                  text: 'Testimoni Klien',
                  className: 'text-3xl md:text-4xl font-black uppercase mb-16 tracking-tight',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: { className: 'grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto' },
                children: [
                  {
                    id: generateId(),
                    type: 'Card',
                    props: {
                      className:
                        'bg-background text-foreground border border-border shadow-xl p-10 rounded-none flex flex-col justify-between',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Pengalaman membeli paling mulus yang pernah saya alami. Logistik pengiriman ditangani sempurna, unit tiba melebihi ekspektasi.',
                          className: 'italic mb-8 text-base text-muted-foreground',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          level: 4,
                          text: '- Marcus T. | Porsche 911 2023',
                          className: 'font-bold uppercase text-xs tracking-widest text-primary',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Card',
                    props: {
                      className:
                        'bg-background text-foreground border border-border shadow-xl p-10 rounded-none flex flex-col justify-between',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Detail inspeksi 150 titiknya luar biasa. Mobil datang mulus, didukung transparansi dan profesionalisme tanpa cela.',
                          className: 'italic mb-8 text-base text-muted-foreground',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          level: 4,
                          text: '- Elena R. | Audi R8 2022',
                          className: 'font-bold uppercase text-xs tracking-widest text-primary',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Card',
                    props: {
                      className:
                        'bg-background text-foreground border border-border shadow-xl p-10 rounded-none flex flex-col justify-between',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Sebagai pengelola armada korporat, tim finansial bespoke mereka menghemat waktu kami secara signifikan setiap kuartal.',
                          className: 'italic mb-8 text-base text-muted-foreground',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          level: 4,
                          text: '- Daniel K. | Armada Korporat',
                          className: 'font-bold uppercase text-xs tracking-widest text-primary',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // FITUR TAMBAHAN
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
                type: 'Grid',
                props: { className: 'grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto' },
                children: [
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Pengiriman White-Glove',
                      description:
                        'Transportasi tertutup ke seluruh negeri langsung ke halaman rumah Anda, sepenuhnya diasuransikan dan dilacak real-time lewat portal klien.',
                      icon: '01',
                      className:
                        'border border-border bg-card rounded-none p-10 shadow-md hover:border-primary/50 transition-colors',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Pembiayaan Bespoke',
                      description:
                        'Solusi finansial dan struktur leasing yang disesuaikan untuk individu high-net-worth dan armada korporat.',
                      icon: '02',
                      className:
                        'border border-border bg-card rounded-none p-10 shadow-md hover:border-primary/50 transition-colors',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Concierge Pasca-Penjualan',
                      description:
                        'Penjadwalan servis prioritas, persiapan track-day personal, dan dukungan khusus 24/7 untuk seluruh koleksi Anda.',
                      icon: '03',
                      className:
                        'border border-border bg-card rounded-none p-10 shadow-md hover:border-primary/50 transition-colors',
                    },
                    children: [],
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
              title: 'Jadwalkan Test Drive VIP',
              description:
                'Rasakan performanya secara langsung. Reservasi wajib. Spesialis kami tersedia 24/7.',
              buttonText: 'Buat Janji',
              className:
                'bg-primary text-primary-foreground rounded-none m-0 py-24 md:py-32 border-0 shadow-inner',
            },
            children: [],
          },

          // FOOTER — multi-kolom, lebih lengkap dari tier lain
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'bg-muted border-t border-border text-muted-foreground py-16 px-6 md:px-8',
            },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: { className: 'grid-cols-1 md:grid-cols-4 gap-10 max-w-7xl mx-auto mb-10' },
                children: [
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'SOLSTICE //',
                          className: 'font-bold tracking-widest text-foreground mb-3',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Solusi otomotif enterprise dengan standar dunia sejak 1998.',
                          className: 'text-sm leading-relaxed',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'JELAJAHI',
                          className:
                            'font-bold text-xs tracking-widest text-foreground mb-3 uppercase',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Inventaris\nBersertifikat\nLeasing & Finansial',
                          className: 'text-sm leading-loose whitespace-pre-line',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'PERUSAHAAN',
                          className:
                            'font-bold text-xs tracking-widest text-foreground mb-3 uppercase',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Tentang Kami\nKarier\nMitra Korporat',
                          className: 'text-sm leading-loose whitespace-pre-line',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: {},
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'KONTAK',
                          className:
                            'font-bold text-xs tracking-widest text-foreground mb-3 uppercase',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: '1234 Performance Blvd, Metro City\n1-800-SOLSTICE',
                          className: 'text-sm leading-loose whitespace-pre-line',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'Divider',
                props: { className: 'max-w-7xl mx-auto border-border mb-6' },
                children: [],
              },
              {
                id: generateId(),
                type: 'Text',
                props: {
                  text: '© 2026 Solstice Auto Group. Solusi Otomotif Enterprise. Seluruh spesifikasi tunduk pada verifikasi.',
                  className: 'text-xs max-w-7xl mx-auto',
                },
                children: [],
              },
            ],
          },
        ]),
      },
    ],
    theme: {
      colors: { primary: '221.2 83.2% 53.3%' },
      typography: { fontFamily: 'Inter, sans-serif', headingFontFamily: 'Inter, sans-serif' },
      radius: '0',
    },
  },
});
