import { prisma } from '../src/shared/lib/prisma';

async function main() {
  console.log('Updating template slugs...');
  const templates = await prisma.template.findMany();
  let updatedCount = 0;

  for (const tpl of templates) {
    const slug = tpl.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    await prisma.template.update({
      where: { id: tpl.id },
      data: { slug },
    });
    console.log(`Updated slug for template: "${tpl.name}" -> "${slug}"`);
    updatedCount++;
  }

  console.log(`\nFinished updating ${updatedCount} template(s) with slugs!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
