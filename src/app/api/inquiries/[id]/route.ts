import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/inquiries/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    // Validate status
    if (!['new', 'contacted', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update the inquiry status
    const updatedInquiry = await prisma.vacationInquiry.update({
      where: { id },
      data: { status },
    });
    
    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
} 