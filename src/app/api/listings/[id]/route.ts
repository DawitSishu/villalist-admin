import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        featuredImage: true,
        pricePerNight: true,
        maxGuests: true,
        bedrooms: true,
        bathrooms: true,
        address: true,
        typeOfPlace: true,
        isFeatured: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Only allow updating specific fields
    const allowedFields = [
      'title',
      'description',
      'pricePerNight',
      'maxGuests',
      'bedrooms',
      'bathrooms',
      'typeOfPlace',
      'isFeatured',
    ];

    // Filter out any disallowed fields
    const updateData = Object.keys(data).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = data[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // Ensure numeric fields are numbers
    if ('pricePerNight' in updateData) {
      updateData.pricePerNight = Number(updateData.pricePerNight);
    }
    if ('maxGuests' in updateData) {
      updateData.maxGuests = Number(updateData.maxGuests);
    }
    if ('bedrooms' in updateData) {
      updateData.bedrooms = Number(updateData.bedrooms);
    }
    if ('bathrooms' in updateData) {
      updateData.bathrooms = Number(updateData.bathrooms);
    }

    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        pricePerNight: true,
        maxGuests: true,
        bedrooms: true,
        bathrooms: true,
        typeOfPlace: true,
        address: true,
        featuredImage: true,
        isFeatured: true,
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing', message: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 