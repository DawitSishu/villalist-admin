import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';// Make sure you have your Prisma client set up

export async function GET() {
  try {
    // Fetch all bookings regardless of status
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        property: {
          select: {
            title: true
          }
        }
      }
    });

    console.log(`Retrieved ${bookings.length} total bookings for dashboard overview, including all statuses`);

    // Transform bookings to include propertyName
    const transformedBookings = bookings.map((booking: any) => ({
      ...booking,
      propertyName: booking.property?.title || 'Unknown Property'
    }));

    // Fetch all inquiries
    const inquiries = await prisma.vacationInquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch all members
    const members = await prisma.luxeMembership.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Return all data as a single JSON response
    return NextResponse.json({
      bookings: transformedBookings,
      inquiries,
      members
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 