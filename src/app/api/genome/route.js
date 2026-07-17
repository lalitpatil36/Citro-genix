import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isolateName = searchParams.get('isolate');

  try {
    if (isolateName) {
      const isolate = await prisma.isolate.findUnique({
        where: { name: isolateName },
        include: { orfs: true, genotype: true }
      });
      if (!isolate) return NextResponse.json({ error: 'Isolate not found' }, { status: 404 });
      return NextResponse.json(isolate);
    }

    // Default to a known isolate for demo purposes
    const isolate = await prisma.isolate.findFirst({
      where: { name: 'Kpg5' },
      include: { orfs: true, genotype: true }
    });
    
    return NextResponse.json(isolate);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch genome data' }, { status: 500 });
  }
}
