import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  try {
    const papers = await prisma.researchPaper.findMany();
    
    // Simple filter
    const filtered = papers.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.authors.toLowerCase().includes(q) ||
      (p.genotypesStudied && p.genotypesStudied.toLowerCase().includes(q))
    );

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}
