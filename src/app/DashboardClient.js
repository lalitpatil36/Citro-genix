'use client';

import { useState, useEffect } from 'react';
import GenomeBrowser from '@/components/GenomeBrowser';
import LiteratureSearch from '@/components/LiteratureSearch';
import GrowerDecisionEngine from '@/components/GrowerDecisionEngine';
import BlastTool from '@/components/BlastTool';
import CleanPlantProgram from '@/components/CleanPlantProgram';
import HyperspectralImaging from '@/components/HyperspectralImaging';
import GlobalStats from '@/components/GlobalStats';
import CitrusDiseaseGuide from '@/components/CitrusDiseaseGuide';
import CitrusProductionStats from '@/components/CitrusProductionStats';
import { Network, Database, BookOpen, ExternalLink, GraduationCap, Tractor } from 'lucide-react';
import styles from './DashboardClient.module.css';

export default function DashboardClient({ data }) {
  const [role, setRole] = useState('scientist'); // 'scientist' or 'farmer'

  useEffect(() => {
    // Inject Google Translate script only once
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr,te,pa,gu,ta,bn,kn,ml,ur',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'google_translate_element');
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.roleToggle}>
        <button 
          className={`${styles.toggleBtn} ${role === 'scientist' ? styles.activeScientist : ''}`}
          onClick={() => setRole('scientist')}
        >
          <GraduationCap size={20}/> Scientist / Student Portal
        </button>
        <button 
          className={`${styles.toggleBtn} ${role === 'farmer' ? styles.activeFarmer : ''}`}
          onClick={() => setRole('farmer')}
        >
          <Tractor size={20}/> Farmer Portal
        </button>
      </div>

      {role === 'farmer' && (
        <div className={styles.farmerHero}>
          <img src="/images/farmer.png" alt="Indian Farmer in Citrus Orchard" className={styles.farmerHeroBg} />
          <div className={styles.farmerHeroOverlay}></div>
          <div className={styles.farmerHeroContent}>
            <h2>Empowering Citrus Growers</h2>
            <p>Data-driven agronomy, disease identification, and live production statistics for your orchard.</p>
          </div>
        </div>
      )}

      <div 
        className={styles.translateBanner}
        style={{ display: role === 'farmer' ? 'flex' : 'none' }}
      >
        <div className={styles.translateBox}>
          <span>Translate to your language (अपनी भाषा चुनें): </span>
          <div id="google_translate_element"></div>
        </div>
      </div>

      {role === 'scientist' && <GlobalStats />}

      <div className={styles.mainGrid}>
        <section className={styles.visualizerSection}>
          {role === 'scientist' ? (
            <>
              <GenomeBrowser />
              <BlastTool />
              <HyperspectralImaging />
              <LiteratureSearch />
            </>
          ) : (
            <>
              <CitrusProductionStats />
              <GrowerDecisionEngine />
              <CitrusDiseaseGuide />
              <CleanPlantProgram />
            </>
          )}
        </section>

        {role === 'scientist' && (
          <aside className={styles.sidebar}>
            <div className={`glass-panel ${styles.ictvLink}`}>
              <h2>Global Databases</h2>
              <div className={styles.resourceList}>
                <a href="https://www.ncbi.nlm.nih.gov/labs/virus/vssi/#/virus?SeqType_s=Nucleotide&VirusLineage_ss=Citrus%20tristeza%20virus,%20taxid:12180" target="_blank" rel="noreferrer" className={styles.resourceCard}>
                  <Database size={20} />
                  <div>
                    <h4>NCBI Virus Database</h4>
                    <p>Access thousands of live CTV genomic sequences globally.</p>
                  </div>
                  <ExternalLink size={16} className={styles.externalIcon} />
                </a>
                <a href="https://ictv.global/taxonomy" target="_blank" rel="noreferrer" className={styles.resourceCard}>
                  <Network size={20} />
                  <div>
                    <h4>ICTV Taxonomy</h4>
                    <p>Official viral taxonomy and nomenclature.</p>
                  </div>
                  <ExternalLink size={16} className={styles.externalIcon} />
                </a>
              </div>
            </div>

            <div className={`glass-panel ${styles.recentPapers}`}>
              <h2><BookOpen size={20}/> Recent Literature</h2>
              <ul>
                {data?.recentPapers.map(paper => (
                  <li key={paper.id}>
                    <h4>{paper.title}</h4>
                    <p className={styles.authors}>{paper.authors}</p>
                    <span className={styles.tag}>{paper.genotypesStudied || 'General'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
