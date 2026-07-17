import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stats = {
      totalDiseases: await prisma.disease.count(),
      totalRootstocks: await prisma.rootstock.count(),
      totalGenotypes: await prisma.genotype.count(),
      totalIsolates: await prisma.isolate.count(),
      totalPapers: await prisma.researchPaper.count(),
    };

    const genotypes = await prisma.genotype.findMany({
      include: {
        _count: {
          select: { isolates: true }
        }
      }
    });

    const recentPapers = await prisma.researchPaper.findMany({
      take: 5,
      orderBy: { publicationYear: 'desc' }
    });

    const rootstocks = await prisma.rootstock.findMany();

    return NextResponse.json({
      stats,
      genotypes,
      recentPapers,
      rootstocks
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
