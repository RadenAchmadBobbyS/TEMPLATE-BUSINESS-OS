import { buildRoot, generateId } from './utils';

export const getProTemplate = (categories: any, industries: any) => ({
  name: 'Volta Studio',
  categoryId: categories['Agency'].id,
  industryId: industries['Creative & Arts'].id,
  requiredTier: 'PRO',
  defaultTree: {
    metadata: {
      version: '1.2',
      status: 'PUBLISHED',
      thumbnail:
        'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=600&auto=format&fit=crop',
      description:
        'Template energik untuk agensi kreatif — layout bento asimetris, elemen mengambang, tipografi gradient besar, dan CMS untuk showcase portofolio. Mendorong batas visual lebih jauh dari paket Starter.',
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
              { name: 'image', type: 'string' },
            ],
          },
        },
      ],
      entries: [
        {
          modelId: 'cms-projects',
          status: 'PUBLISHED',
          data: {
            title: 'Redesain Aplikasi Fintech',
            category: 'UX/UI Design',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
          },
        },
        {
          modelId: 'cms-projects',
          status: 'PUBLISHED',
          data: {
            title: 'Identitas Visual Synthwave',
            category: 'Brand Identity',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400',
          },
        },
        {
          modelId: 'cms-projects',
          status: 'PUBLISHED',
          data: {
            title: 'Platform E-commerce Echo',
            category: 'Web Development',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400',
          },
        },
      ],
    },
    pages: [
      {
        id: 'tpl-pro-home',
        slug: '/',
        title: 'Home',
        order: 0,
        nodeTree: buildRoot([
          // NAVBAR
          {
            id: generateId(),
            type: 'Navbar',
            props: {
              logoText: 'VOLTA',
              className:
                'bg-background text-foreground border-b border-border font-bold tracking-widest py-6',
              links: [
                { label: 'Karya', href: '#' },
                { label: 'Agensi', href: '#' },
                { label: 'Layanan', href: '#' },
                { label: 'Kontak', href: '#' },
              ],
            },
            children: [],
          },

          // HERO — asimetris, dengan blob gradient blur + 2 badge mengambang overlap
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'bg-background text-foreground py-24 md:py-40 border-b border-border relative overflow-hidden',
            },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: {
                  className:
                    'absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500 blur-3xl opacity-20 pointer-events-none',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'relative max-w-6xl mx-auto px-4' },
                children: [
                  {
                    id: generateId(),
                    type: 'Container',
                    props: {
                      className:
                        'hidden md:flex absolute top-4 right-4 items-center gap-2 border border-border bg-muted/60 backdrop-blur px-4 py-2 rotate-3',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: '● 50+ Proyek Rampung',
                          className: 'text-xs font-bold tracking-widest uppercase',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'STRATEGI DIGITAL & BRANDING',
                      level: 6,
                      className:
                        'text-primary tracking-[0.2em] font-bold text-sm md:text-base mb-6 uppercase',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Kami Merancang Pengalaman Digital yang Mengguncang Pasar.',
                      level: 1,
                      className:
                        'text-5xl md:text-8xl mb-8 font-black leading-[1.1] md:leading-[0.9] max-w-5xl text-transparent bg-clip-text bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Volta adalah agensi kreatif multidisiplin yang fokus pada branding, pengembangan web imersif, dan strategi digital untuk brand yang berani tampil beda.',
                      className:
                        'text-lg md:text-2xl mb-12 text-muted-foreground max-w-2xl font-light leading-relaxed',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Button',
                    props: {
                      text: 'Lihat Karya Pilihan',
                      variant: 'default',
                      className:
                        'bg-foreground text-background hover:scale-105 border-0 py-6 px-10 text-lg rounded-none font-bold shadow-[0_10px_40px_rgba(217,70,239,0.2)] transition-all',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // KAPABILITAS — bento grid tidak simetris (beda ukuran tiap card)
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'py-24 md:py-32 bg-muted text-foreground border-b border-border px-4 md:px-8',
            },
            children: [
              {
                id: generateId(),
                type: 'Heading',
                props: {
                  text: 'Kapabilitas Kami',
                  className:
                    'text-4xl md:text-5xl font-bold mb-4 text-foreground max-w-2xl mx-auto text-center',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Text',
                props: {
                  text: 'Memadukan arahan kreatif yang berani dengan eksekusi teknis yang kokoh untuk dampak yang terukur.',
                  className:
                    'text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto text-center mb-12',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className: 'grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 max-w-6xl mx-auto',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Identitas Merek',
                      description:
                        'Sistem visual menyeluruh, definisi tone of voice, dan positioning yang tajam di tengah keramaian pasar.',
                      icon: '✧',
                      className:
                        'md:col-span-2 md:row-span-2 bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors flex flex-col justify-end',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Pengembangan Web',
                      description:
                        'Arsitektur React/Next.js berperforma tinggi dipadu animasi kelas juara.',
                      icon: '✦',
                      className:
                        'md:col-span-2 bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'UX/UI Design',
                      description:
                        'Antarmuka yang berpusat pada pengguna, dioptimalkan untuk konversi di semua perangkat.',
                      icon: '✺',
                      className:
                        'bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Performance Marketing',
                      description:
                        'Kampanye berbasis data yang memadukan SEO, paid media, dan aset kreatif bersasaran.',
                      icon: '✹',
                      className:
                        'bg-background text-foreground border border-border shadow-xl rounded-none p-8 hover:border-primary/50 transition-colors',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // PROSES — timeline horizontal dengan node bulat mengambang di garis
          {
            id: generateId(),
            type: 'Section',
            props: {
              className: 'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border',
            },
            children: [
              {
                id: generateId(),
                type: 'Heading',
                props: {
                  text: 'Proses Kerja',
                  className: 'text-center mb-20 text-4xl md:text-5xl font-bold text-foreground',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className:
                    'grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto relative md:before:content-[""] md:before:absolute md:before:top-6 md:before:left-0 md:before:right-0 md:before:h-px md:before:bg-border',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'text-left relative pt-2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: '01',
                          className:
                            'inline-flex w-12 h-12 items-center justify-center rounded-full bg-foreground text-background font-black text-lg mb-4 relative z-10',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          level: 3,
                          text: 'Discovery',
                          className: 'text-2xl font-bold mb-2',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Menyelami posisi brand di pasar secara mendalam',
                          className: 'text-muted-foreground',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'text-left relative pt-2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: '02',
                          className:
                            'inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-lg mb-4 relative z-10',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { level: 3, text: 'Strategi', className: 'text-2xl font-bold mb-2' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Menyusun peta jalan kreatif yang terarah',
                          className: 'text-muted-foreground',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'text-left relative pt-2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: '03',
                          className:
                            'inline-flex w-12 h-12 items-center justify-center rounded-full bg-foreground text-background font-black text-lg mb-4 relative z-10',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { level: 3, text: 'Eksekusi', className: 'text-2xl font-bold mb-2' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Pengembangan yang presisi hingga detail terkecil',
                          className: 'text-muted-foreground',
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'text-left relative pt-2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: '04',
                          className:
                            'inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-lg mb-4 relative z-10',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          level: 3,
                          text: 'Peluncuran',
                          className: 'text-2xl font-bold mb-2',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Deployment dan optimisasi berkelanjutan',
                          className: 'text-muted-foreground',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // KARYA PILIHAN — CMS dynamic list
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'py-24 md:py-32 bg-muted px-4 md:px-8 border-b border-border' },
            children: [
              {
                id: generateId(),
                type: 'Heading',
                props: {
                  text: 'Karya Pilihan',
                  className:
                    'text-center mb-16 text-4xl md:text-5xl text-foreground font-bold tracking-tight',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'CmsList',
                props: {
                  modelId: 'cms-projects',
                  limit: 6,
                  className: 'max-w-7xl mx-auto border-0 bg-transparent p-0',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'text-center mt-12' },
                children: [
                  {
                    id: generateId(),
                    type: 'Button',
                    props: {
                      text: 'Lihat Semua Proyek',
                      variant: 'outline',
                      className: 'rounded-none border-foreground text-foreground px-8 py-6',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // TESTIMONI — quote raksasa dengan tanda kutip dekoratif mengambang
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'py-24 md:py-32 bg-background px-4 md:px-8 border-b border-border relative overflow-hidden',
            },
            children: [
              {
                id: generateId(),
                type: 'Text',
                props: {
                  text: '"',
                  className:
                    'absolute -top-4 left-1/2 -translate-x-1/2 md:left-[15%] md:translate-x-0 text-[14rem] leading-none font-black text-primary/10 select-none pointer-events-none',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'relative max-w-4xl mx-auto text-center' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'TESTIMONI KLIEN',
                      className: 'text-primary mb-8 text-sm tracking-widest font-bold uppercase',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Volta benar-benar mengubah kehadiran digital kami. Tingkat konversi kami naik dua kali lipat dalam bulan pertama peluncuran.',
                      className:
                        'text-3xl md:text-5xl text-foreground font-light leading-tight mb-12 italic',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Divider',
                    props: { className: 'w-24 border-primary border-t-2 mx-auto mb-8' },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'items-center gap-4' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Image',
                        props: {
                          src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
                          className: 'w-16 h-16 rounded-full object-cover',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Sarah Jenkins, CMO di FintechGlobal',
                          className:
                            'text-muted-foreground font-medium uppercase tracking-widest text-sm',
                        },
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
              title: 'Siap mengguncang industri Anda?',
              description:
                'Mari bicarakan ide besar Anda selanjutnya. Tim strategi kami siap menganalisis posisi pasar Anda.',
              buttonText: 'Mulai Proyek',
              className:
                'bg-foreground text-background py-24 md:py-32 m-0 rounded-none border-none',
            },
            children: [],
          },

          // FOOTER
          {
            id: generateId(),
            type: 'Footer',
            props: {
              text: '© 2026 Volta Studio. Jakarta | Singapura | Tokyo',
              className:
                'bg-background border-t border-border text-muted-foreground py-16 px-6 md:px-8',
            },
            children: [],
          },
        ]),
      },
    ],
    theme: {
      colors: {
        primary: '300 70% 50%',
      },
      typography: { fontFamily: 'Inter, sans-serif' },
      radius: '0',
    },
  },
});
