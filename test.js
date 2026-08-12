const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const w = await prisma.website.findFirst();
  console.log(w.id, w.slug);
}
main().finally(() => prisma.$disconnect());
