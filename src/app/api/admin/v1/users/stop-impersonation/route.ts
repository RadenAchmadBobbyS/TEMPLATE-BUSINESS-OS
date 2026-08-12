import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value;
  const originalToken = cookieStore.get("admin_original_session")?.value;
  
  if (token) {
    // Attempt to delete the impersonation session
    await prisma.session.deleteMany({
      where: { token, impersonatedBy: { not: null } }
    });
  }

  const url = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const response = NextResponse.redirect(new URL("/admin/users", url));
  
  if (originalToken) {
    // Restore the admin session
    response.cookies.set("better-auth.session_token", originalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days (standard length)
    });
    // Remove the temporary original token backup
    response.cookies.delete("admin_original_session");
  } else {
    // Just in case, clean up
    response.cookies.delete("better-auth.session_token");
  }
  
  return response;
}
