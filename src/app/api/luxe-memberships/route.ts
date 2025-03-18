import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient only once and reuse
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const members = await prisma.luxeMembership.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching luxe memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch luxe memberships' },
      { status: 500 }
    );
  }
} 