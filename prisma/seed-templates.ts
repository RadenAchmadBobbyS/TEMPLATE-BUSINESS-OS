import { config } from 'dotenv';
config();

import { getFreeTemplate } from './templates/free';
import { getStarterTemplate } from './templates/starter';
import { getProTemplate } from './templates/pro';
import { getBusinessTemplate } from './templates/business';
import { getEnterpriseTemplate } from './templates/enterprise';

async function main() {
  const { prisma } = await import('../src/shared/lib/prisma');
  console.log('Seeding Categories, Industries, and Differentiated Templates...');

  const catNames = [
    'Hotel / Travel',
    'Tour Package',
    'Corporate',
    'Workshop',
    'Automotive',
    'Fitness',
    'Restaurant',
    'Cafe',
    'Real Estate',
    'Agency',
    'SaaS',
    'Portfolio',
    'Education',
    'Clinic',
    'Beauty / Salon',
    'E-commerce',
    'Event',
    'Photography',
    'Construction',
    'Professional Services',
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
    'Hospitality & Travel',
    'Business & Professional',
    'Retail & Commerce',
    'Health & Wellness',
    'Creative & Arts',
    'Automotive & Transport',
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
    getFreeTemplate(categories, industries),
    getStarterTemplate(categories, industries),
    getProTemplate(categories, industries),
    getBusinessTemplate(categories, industries),
    getEnterpriseTemplate(categories, industries),
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

  console.log('Templates seeded successfully!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
