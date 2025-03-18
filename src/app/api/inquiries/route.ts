import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all vacation inquiries ordered by creation date (newest first)
    const inquiries = await prisma.vacationInquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Prepare data for the weekly chart
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Count inquiries for each day of the past week
    const weeklyData = Array(7).fill(0);
    
    inquiries.forEach(inquiry => {
      const inquiryDate = new Date(inquiry.createdAt);
      if (inquiryDate >= oneWeekAgo && inquiryDate <= today) {
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = inquiryDate.getDay();
        // Adjust to match the chart display (where 0 = Monday in the chart)
        const adjustedDay = (dayOfWeek + 6) % 7; // Converts Sunday=0 to Sunday=6
        weeklyData[adjustedDay]++;
      }
    });

    return NextResponse.json({ 
      inquiries: inquiries, 
      weeklyData: weeklyData 
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
} 