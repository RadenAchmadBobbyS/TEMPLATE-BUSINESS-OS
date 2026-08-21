import { buildRoot, generateId } from './utils';

export const getStarterTemplate = (categories: any, industries: any) => ({
  name: 'Ember & Vine',
  categoryId: categories['Restaurant'].id,
  industryId: industries['Hospitality & Travel'].id,
  requiredTier: 'STARTER',
  defaultTree: {
    metadata: {
      version: '1.2',
      status: 'PUBLISHED',
      thumbnail:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
      description:
        'Template hangat untuk kafe dan restoran — foto besar, palet amber lembut, sudut membulat, dan galeri visual. Fitur ini membuka komponen gambar, ikon, dan kartu bergambar yang tidak tersedia di paket Free.',
    },
    pages: [
      {
        id: 'tpl-starter-home',
        slug: '/',
        title: 'Home',
        order: 0,
        nodeTree: buildRoot([
          // NAVBAR — dengan multi-link, sudah lebih kompleks dari Free
          {
            id: generateId(),
            type: 'Navbar',
            props: {
              logoText: 'Ember & Vine',
              className: 'py-4 bg-background text-foreground border-b border-border',
              links: [
                { label: 'Menu', href: '#' },
                { label: 'Reservasi', href: '#' },
                { label: 'Cerita Kami', href: '#' },
                { label: 'Kontak', href: '#' },
              ],
            },
            children: [],
          },

          // HERO — full-bleed photo dengan overlay gelap, judul serif besar
          {
            id: generateId(),
            type: 'Section',
            props: {
              className:
                'bg-[url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200)] bg-cover bg-center py-32 md:py-48 relative before:content-[""] before:absolute before:inset-0 before:bg-black/55',
            },
            children: [
              {
                id: generateId(),
                type: 'Container',
                props: { className: 'text-center relative z-10 px-6 md:px-8' },
                children: [
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: {
                      text: 'Dari Kebun ke Meja Anda',
                      level: 1,
                      className:
                        'text-4xl md:text-6xl text-white mb-6 font-serif tracking-wide drop-shadow-lg',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Text',
                    props: {
                      text: 'Bahan lokal pilihan, diolah dengan sepenuh hati, disajikan dalam suasana yang hangat dan bersahabat.',
                      className:
                        'text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Button',
                    props: {
                      text: 'Reservasi Meja',
                      variant: 'default',
                      className:
                        'bg-primary text-primary-foreground rounded-full px-8 py-4 text-lg font-medium border-0 hover:opacity-90',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // KEUNGGULAN — 3 feature dengan ikon (fitur ikon = unlock dari Free)
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'bg-background py-16 border-b border-border' },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className:
                    'grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 max-w-7xl mx-auto text-center',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Bahan Segar Lokal',
                      description:
                        'Kami bermitra langsung dengan petani dalam radius 50 km untuk menjaga kesegaran setiap hidangan.',
                      icon: '🌿',
                      className: 'p-6 items-center flex flex-col text-center',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Panggangan Kayu Bakar',
                      description:
                        'Teknik memanggang tradisional dengan kayu ek dan hickory untuk cita rasa yang autentik.',
                      icon: '🔥',
                      className: 'p-6 items-center flex flex-col text-center',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Feature',
                    props: {
                      title: 'Diakui Kritikus',
                      description:
                        'Diulas oleh Culinary Digest atas menu musiman kami yang inovatif dan konsisten.',
                      icon: '⭐',
                      className: 'p-6 items-center flex flex-col text-center',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // MENU UNGGULAN — kartu bergambar (fitur Card+Image = unlock dari Free)
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'py-24 md:py-32 bg-muted' },
            children: [
              {
                id: generateId(),
                type: 'Heading',
                props: {
                  text: 'Menu Andalan Kami',
                  className: 'text-center mb-16 text-3xl md:text-4xl font-serif text-foreground',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className:
                    'grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-8 max-w-7xl mx-auto mb-12',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Card',
                    props: {
                      className:
                        'border border-border shadow-md bg-card rounded-2xl overflow-hidden p-0 flex flex-col transition-transform hover:-translate-y-1',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Image',
                        props: {
                          src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400',
                          className: 'w-full h-56 object-cover rounded-none',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-6 md:p-8 flex-1' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              level: 3,
                              text: 'Pasta Truffle Artisan',
                              className: 'text-xl font-serif text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Linguine buatan tangan dengan saus krim black truffle, ditaburi Parmigiano-Reggiano tua dan peterseli segar.',
                              className: 'text-muted-foreground text-sm leading-relaxed',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Card',
                    props: {
                      className:
                        'border border-border shadow-md bg-card rounded-2xl overflow-hidden p-0 flex flex-col transition-transform hover:-translate-y-1',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Image',
                        props: {
                          src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
                          className: 'w-full h-56 object-cover rounded-none',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-6 md:p-8 flex-1' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              level: 3,
                              text: 'Margherita Panggang Kayu',
                              className: 'text-xl font-serif text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Pizza gaya Napoli otentik dengan tomat San Marzano, mozzarella buffalo segar, dan daun basil aromatik.',
                              className: 'text-muted-foreground text-sm leading-relaxed',
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Card',
                    props: {
                      className:
                        'border border-border shadow-md bg-card rounded-2xl overflow-hidden p-0 flex flex-col transition-transform hover:-translate-y-1',
                    },
                    children: [
                      {
                        id: generateId(),
                        type: 'Image',
                        props: {
                          src: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=400',
                          className: 'w-full h-56 object-cover rounded-none',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { className: 'p-6 md:p-8 flex-1' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Heading',
                            props: {
                              level: 3,
                              text: 'Salad Burrata & Fig',
                              className: 'text-xl font-serif text-primary mb-2',
                            },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Text',
                            props: {
                              text: 'Burrata lokal yang lembut dengan fig organik, arugula muda, kenari karamel, dan saus balsamic reduction.',
                              className: 'text-muted-foreground text-sm leading-relaxed',
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
                type: 'Container',
                props: { className: 'text-center' },
                children: [
                  {
                    id: generateId(),
                    type: 'Button',
                    props: {
                      text: 'Lihat Menu Lengkap',
                      variant: 'outline',
                      className:
                        'border-primary text-primary rounded-full px-8 py-3 font-medium hover:bg-primary hover:text-primary-foreground',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },

          // FILOSOFI — split image/teks (fitur Columns = unlock dari Free)
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
                    props: {
                      src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600',
                      className: 'rounded-2xl shadow-xl w-full md:w-1/2 object-cover aspect-square',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { className: 'p-4 md:p-8 w-full md:w-1/2' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: {
                          text: 'Filosofi Kami',
                          level: 2,
                          className: 'font-serif text-3xl md:text-5xl text-foreground mb-6',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Divider',
                        props: { className: 'w-16 border-primary border-t-2 mb-6 ml-0' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: {
                          text: 'Sejak 1992, Ember & Vine berkomitmen menyatukan komunitas di meja makan. Kami percaya makanan enak dimulai dari bahan terbaik — karena itu kami hanya bermitra dengan kebun berkelanjutan di radius 50 km.',
                          className: 'text-muted-foreground text-lg leading-relaxed mb-6',
                        },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Button',
                        props: {
                          text: 'Kenali Cerita Kami',
                          variant: 'outline',
                          className:
                            'rounded-full border-foreground text-foreground self-start px-6',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // SUASANA — galeri foto (fitur galeri = unlock dari Free)
          {
            id: generateId(),
            type: 'Section',
            props: { className: 'py-24 bg-muted border-y border-border' },
            children: [
              {
                id: generateId(),
                type: 'Heading',
                props: {
                  text: 'Suasana di Ember & Vine',
                  className: 'text-center mb-12 text-3xl md:text-4xl font-serif text-foreground',
                },
                children: [],
              },
              {
                id: generateId(),
                type: 'Grid',
                props: {
                  className: 'grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 max-w-7xl mx-auto',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'Image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400',
                      className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1466978913421-bac2e5e42729?q=80&w=400',
                      className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400',
                      className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm',
                    },
                    children: [],
                  },
                  {
                    id: generateId(),
                    type: 'Image',
                    props: {
                      src: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=400',
                      className: 'w-full h-48 md:h-64 object-cover rounded-xl shadow-sm',
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
              title: 'Bergabunglah untuk Makan Malam',
              description:
                'Rasakan kehangatan Ember & Vine malam ini. Walk-in dipersilakan, reservasi disarankan.',
              buttonText: 'Cari Meja',
              className: 'bg-primary text-primary-foreground rounded-none py-20 md:py-24 m-0',
            },
            children: [],
          },

          // FOOTER
          {
            id: generateId(),
            type: 'Footer',
            props: {
              text: '© 2026 Ember & Vine. Jl. Utama No. 123 | (021) 123-4567',
              className:
                'bg-background border-t border-border text-muted-foreground py-12 px-6 md:px-8',
            },
            children: [],
          },
        ]),
      },
    ],
    theme: {
      colors: { primary: '32 80% 50%' },
      typography: { fontFamily: 'Lora, serif', headingFontFamily: 'Lora, serif' },
      radius: '1rem',
    },
  },
});
