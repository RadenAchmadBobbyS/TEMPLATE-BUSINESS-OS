import { prisma } from './src/shared/lib/prisma';

async function main() {
  const templates = await prisma.template.findMany({
    select: { name: true, slug: true, requiredTier: true, id: true }
  });
  console.log('Templates in DB:');
  for (const t of templates) {
    console.log(`- ${t.name} (Tier: ${t.requiredTier}, Slug: ${t.slug})`);
  }
}

main().finally(() => prisma.$disconnect());
