import { prisma } from "../src/shared/lib/prisma";

async function main() {
  console.log("Seeding Templates...");

  const catNames = ["Restaurant / Food", "Coffee Shop", "Laundry", "Fashion", "Furniture", "Hardware", "Supplier", "Automotive", "Beauty", "Professional Services"];
  const categories: Record<string, any> = {};
  for (const name of catNames) {
    const c = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    categories[name] = c;
  }

  const industryNames = ["Food & Beverage", "Retail", "Services", "Manufacturing"];
  const industries: Record<string, any> = {};
  for (const name of industryNames) {
    const ind = await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    industries[name] = ind;
  }

  const templates = [
    {
      name: "Modern Restaurant",
      categoryId: categories["Restaurant / Food"].id,
      industryId: industries["Food & Beverage"].id,
      defaultTree: {
        metadata: {
          version: "1.0",
          status: "PUBLISHED",
          thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
          description: "A beautiful template for restaurants with a menu and reservation section."
        },
        pages: [
          {
            id: "tpl-restaurant-home",
            slug: "/",
            title: "Home",
            order: 0,
            nodeTree: {
              type: "Page",
              children: [
                { type: "Hero", props: { title: "Delicious Food", subtitle: "Experience the best taste." } },
                { type: "MenuSection", props: { items: [{ name: "Pasta", price: "$12" }] } }
              ]
            }
          },
          {
            id: "tpl-restaurant-about",
            slug: "about",
            title: "About Us",
            order: 1,
            nodeTree: {
              type: "Page",
              children: [
                { type: "Text", props: { content: "We are a family owned restaurant." } }
              ]
            }
          }
        ],
        theme: {
          colors: {
            primary: "346.8 77.2% 49.8%",
            background: "0 0% 100%",
            foreground: "222.2 84% 4.9%",
            card: "0 0% 100%",
            cardForeground: "222.2 84% 4.9%",
            border: "214.3 31.8% 91.4%",
            muted: "210 40% 96.1%",
            mutedForeground: "215.4 16.3% 46.9%"
          },
          typography: {
            fontFamily: "Inter, sans-serif",
            headingFontFamily: "Inter, sans-serif"
          },
          radius: "0.5rem"
        },
        navigation: {
          navbar: [
            { id: "nav-home", label: "Home", type: "page", pageId: "tpl-restaurant-home" },
            { id: "nav-about", label: "About", type: "page", pageId: "tpl-restaurant-about" }
          ],
          footer: []
        }
      }
    },
    {
      name: "Chic Coffee Shop",
      categoryId: categories["Coffee Shop"].id,
      industryId: industries["Food & Beverage"].id,
      defaultTree: {
        metadata: {
          version: "1.0",
          status: "PUBLISHED",
          thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop",
          description: "Perfect for local coffee shops and cafes."
        },
        pages: [
          {
            id: "tpl-coffee-home",
            slug: "/",
            title: "Home",
            order: 0,
            nodeTree: {
              type: "Page",
              children: [
                { type: "Hero", props: { title: "Freshly Brewed", subtitle: "Start your morning right." } }
              ]
            }
          }
        ],
        theme: {
          colors: {
            primary: "200 98% 39%",
            background: "0 0% 100%",
            foreground: "222.2 84% 4.9%",
            card: "0 0% 100%",
            cardForeground: "222.2 84% 4.9%",
            border: "214.3 31.8% 91.4%",
            muted: "210 40% 96.1%",
            mutedForeground: "215.4 16.3% 46.9%"
          },
          typography: {
            fontFamily: "Inter, sans-serif",
            headingFontFamily: "Inter, sans-serif"
          },
          radius: "0.5rem"
        },
        navigation: {
          navbar: [
            { id: "nav-coffee-home", label: "Home", type: "page", pageId: "tpl-coffee-home" }
          ],
          footer: []
        }
      }
    }
  ];

  for (const tpl of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: tpl.name }
    });

    if (!existing) {
      await prisma.template.create({
        data: {
          name: tpl.name,
          categoryId: tpl.categoryId,
          industryId: tpl.industryId,
          defaultTree: tpl.defaultTree,
          isPremium: false
        }
      });
      console.log(`Created template: ${tpl.name}`);
    } else {
      await prisma.template.update({
        where: { id: existing.id },
        data: { defaultTree: tpl.defaultTree }
      });
      console.log(`Updated template: ${tpl.name}`);
    }
  }

  console.log("Templates seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
