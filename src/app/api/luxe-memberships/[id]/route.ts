import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient only once and reuse
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.luxeMembership.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting luxe membership:', error);
    return NextResponse.json(
      { error: 'Failed to delete luxe membership' },
      { status: 500 }
    );
  }
} 