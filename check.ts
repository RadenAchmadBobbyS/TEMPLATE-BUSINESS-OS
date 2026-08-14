import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const session = await prisma.session.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log('SESSION TOKEN:', session?.token);
}
main();
