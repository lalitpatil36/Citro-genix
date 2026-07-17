import { Leaf } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';
import styles from './page.module.css';

async function getDashboardData() {
  const stats = {
    totalDiseases: await prisma.disease.count(),
    totalRootstocks: await prisma.rootstock.count(),
    totalGenotypes: await prisma.genotype.count(),
    totalIsolates: await prisma.isolate.count(),
    totalPapers: await prisma.researchPaper.count(),
  };

  const recentPapers = await prisma.researchPaper.findMany({
    take: 5,
    orderBy: { publicationYear: 'desc' }
  });

  return { stats, recentPapers };
}

export default async function Home() {
  const data = await getDashboardData();

  return (
    <main className="container">
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <Leaf className={styles.logoIcon} size={42} />
          <div>
            <h1>CitroGenix</h1>
            <p>The Global Citrus Genomics & Agronomy Platform</p>
          </div>
        </div>
      </header>

      <DashboardClient data={data} />
    </main>
  );
}
