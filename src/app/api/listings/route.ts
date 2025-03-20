import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build the where clause for search
    const where = search 
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { address: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { id: { contains: search, mode: Prisma.QueryMode.insensitive } }
          ]
        }
      : {};
    
    // Fetch listings with pagination
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where,
        select: {
          id: true,
          title: true,
          featuredImage: true,
          pricePerNight: true,
          maxGuests: true,
          bedrooms: true,
          bathrooms: true,
          address: true,
          isFeatured: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listing.count({ where }),
    ]);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      listings,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 