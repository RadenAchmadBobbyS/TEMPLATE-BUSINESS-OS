import { buildRoot, generateId } from './utils';

export const getFreeTemplate = (categories: any, industries: any) => ({
  name: 'Nord & Co. Studio',
  categoryId: categories['Corporate'].id,
  industryId: industries['Business & Professional'].id,
  requiredTier: 'FREE',
  defaultTree: {
    metadata: {
      version: '1.2',
      status: 'PUBLISHED',
      thumbnail:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      description:
        'Desain minimalis satu-aksen-warna dengan garis tegas dan tipografi bersih. Cocok untuk freelancer, studio kecil, atau bisnis baru yang butuh tampilan profesional tanpa ribet.',
    },
    pages: [
      {
        id: 'tpl-free-home',
        slug: '/',
        title: 'Home',
        order: 0,
        nodeTree: buildRoot([
          // NAVBAR — wordmark polos + 1 CTA, tanpa dropdown/menu kompleks
          {
            id: generateId(),
            type: 'Navbar',
            props: {
              logoText: 'Nord & Co.',
              className: 'py-5 border-b-2 border-foreground bg-background text-foreground',
            },
            children: [],
          },

          // HERO — rata kiri, tanpa gambar/gradient, angka besar sebagai aksen tipografis
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'bg-background py-20 md:py-28' },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: {
                  className:
                    'max-w-4xl mx-auto px-6 md:px-8 border-l-4 border-foreground pl-6 md:pl-10',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'STUDIO KONSULTASI — EST. 2026',
                      className:
                        'text-xs md:text-sm font-mono tracking-widest text-muted-foreground mb-4 uppercase',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Kerja rapi, hasil jelas, tanpa basa-basi.',
                      level: 1,
                      className:
                        'text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-5 leading-tight',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Kami membantu bisnis kecil menyusun strategi operasional dan keuangan yang sederhana, terukur, dan langsung bisa dijalankan minggu ini juga.',
                      className:
                        'text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Button',
                    props: {
                      text: 'Booking Sesi Gratis',
                      variant: 'default',
                      className:
                        'bg-foreground text-background rounded-none px-7 py-3.5 font-medium hover:opacity-85 border-2 border-foreground',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // STRIP STAT — pengganti "social proof" mewah, cukup 3 angka polos
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'bg-muted py-10 border-y-2 border-foreground' },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className:
                    'grid-cols-3 gap-4 max-w-4xl mx-auto px-6 md:px-8 text-center divide-x-2 divide-foreground',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: '40+\nKlien Terbantu',
                      className:
                        'text-xl md:text-2xl font-bold text-foreground whitespace-pre-line',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: '3 Hari\nRata-rata Respon',
                      className:
                        'text-xl md:text-2xl font-bold text-foreground whitespace-pre-line',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: '100%\nSesi Pertama Gratis',
                      className:
                        'text-xl md:text-2xl font-bold text-foreground whitespace-pre-line',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // LAYANAN — 3 card, border tipis, tanpa shadow/icon berwarna-warni
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'py-20 md:py-24 bg-background' },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'max-w-5xl mx-auto px-6 md:px-8' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Layanan Utama',
                      level: 2,
                      className: 'text-2xl md:text-3xl font-bold text-foreground mb-10 md:mb-12',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Grid',
                    props: { className: 'grid-cols-1 md:grid-cols-3 gap-0' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Card',
                        props: {
                          className:
                            'border-2 border-foreground p-6 md:p-7 -ml-0.5 -mt-0.5 bg-background rounded-none',
                        },
                        children: [
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '01',
                              className: 'font-mono text-sm text-muted-foreground mb-3',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              level: 3,
                              text: 'Penataan Keuangan',
                              className: 'text-lg font-semibold text-foreground mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Rapikan arus kas dan struktur biaya agar bisnis lebih sehat dan mudah dipantau.',
                              className: 'text-sm text-muted-foreground leading-relaxed',
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
                            'border-2 border-foreground p-6 md:p-7 -ml-0.5 -mt-0.5 bg-background rounded-none',
                        },
                        children: [
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '02',
                              className: 'font-mono text-sm text-muted-foreground mb-3',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              level: 3,
                              text: 'Riset Pasar',
                              className: 'text-lg font-semibold text-foreground mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Pahami kompetitor dan peluang pasar dengan analisis yang ringkas dan actionable.',
                              className: 'text-sm text-muted-foreground leading-relaxed',
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
                            'border-2 border-foreground p-6 md:p-7 -ml-0.5 -mt-0.5 bg-background rounded-none',
                        },
                        children: [
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: '03',
                              className: 'font-mono text-sm text-muted-foreground mb-3',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              level: 3,
                              text: 'Pendampingan Operasional',
                              className: 'text-lg font-semibold text-foreground mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Bantu susun SOP dan alur kerja harian yang lebih efisien untuk tim kecil.',
                              className: 'text-sm text-muted-foreground leading-relaxed',
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

          // CTA — solid block, tanpa gradient, kontras tinggi
          {
            id: generateId(),
            type: 'CTA',
            props: {
              title: 'Siap merapikan bisnis Anda?',
              description: 'Jadwalkan sesi konsultasi pertama, gratis tanpa komitmen.',
              buttonText: 'Mulai Sekarang',
              className: 'py-16 md:py-20 m-0 rounded-none bg-foreground text-background',
            },
            children: [],
          },

          // FOOTER — polos, satu baris
          {
            id: generateId(),
            type: 'Footer',
            props: {
              text: '© 2026 Nord & Co. Studio. Dibuat dengan paket Free.',
              className:
                'bg-background border-t-2 border-foreground text-muted-foreground py-8 text-sm px-6 md:px-8',
            },
            children: [],
          },
        ]),
      },
    ],
    theme: {
      typography: { fontFamily: 'Inter, sans-serif' },
      radius: '0rem',
    },
  },
});
