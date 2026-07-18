import { Leaf } from 'lucide-react';
import DashboardClient from './DashboardClient';
import styles from './page.module.css';
import { db } from '@/lib/db';

async function getDashboardData() {
  const stats = {
    totalDiseases: await db.disease.count(),
    totalRootstocks: await db.rootstock.count(),
    totalGenotypes: await db.genotype.count(),
    totalIsolates: await db.isolate.count(),
    totalPapers: await db.researchPaper.count(),
  };

  const recentPapers = await db.researchPaper.findMany();

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
