import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    // Lightweight database check
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 200 });
  } catch (error) {
    console.error("[Health Check] Database connection failed", error);
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 503 });
  }
}
