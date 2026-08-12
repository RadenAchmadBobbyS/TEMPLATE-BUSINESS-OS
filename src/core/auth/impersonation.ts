import { cookies } from "next/headers";
import { prisma } from "@/shared/lib/prisma";

export async function getImpersonationContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value;
  if (!token) return null;

  const session = await prisma.session.findFirst({
    where: { token, impersonatedBy: { not: null } },
    include: { user: { select: { name: true } } }
  });

  return session;
}
