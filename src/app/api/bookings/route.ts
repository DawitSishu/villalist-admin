import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { startOfDay, subDays, format, addDays } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all bookings without pagination or filtering
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Get counts for stats
    const total = bookings.length;
    const confirmed = bookings.filter(booking => booking.status === 'confirmed').length;
    const pending = bookings.filter(booking => booking.status === 'pending').length;
    const cancelled = bookings.filter(booking => booking.status === 'cancelled').length;

    return NextResponse.json({
      bookings,
      total,
      stats: {
        confirmed,
        pending,
        cancelled,
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 