'use client';

import { Globe, Database, BookOpen, Microscope, X } from 'lucide-react';
import { useState } from 'react';
import styles from './GlobalStats.module.css';

export default function GlobalStats() {
  const [activePanel, setActivePanel] = useState(null);
  return (
    <div className={styles.containerWrapper}>
      <div className={styles.statsContainer}>
        <div 
          className={`${styles.statCard} ${activePanel === 'genotypes' ? styles.activeCard : ''}`}
          onClick={() => setActivePanel(activePanel === 'genotypes' ? null : 'genotypes')}
        >
          <div className={styles.iconWrapper}><Globe size={24} /></div>
          <div className={styles.statInfo}>
            <h4>Global CTV Genotypes</h4>
            <p className={styles.statValue}>8 <span className={styles.subtext}>Major Lineages</span></p>
          </div>
        </div>
        
        <div 
          className={`${styles.statCard} ${activePanel === 'ncbi' ? styles.activeCard : ''}`}
          onClick={() => setActivePanel(activePanel === 'ncbi' ? null : 'ncbi')}
        >
          <div className={styles.iconWrapper}><Database size={24} /></div>
          <div className={styles.statInfo}>
            <h4>NCBI Genomes</h4>
            <p className={styles.statValue}>2,450+ <span className={styles.subtext}>Sequences</span></p>
          </div>
        </div>
        
        <div 
          className={`${styles.statCard} ${activePanel === 'rootstocks' ? styles.activeCard : ''}`}
          onClick={() => setActivePanel(activePanel === 'rootstocks' ? null : 'rootstocks')}
        >
          <div className={styles.iconWrapper}><Microscope size={24} /></div>
          <div className={styles.statInfo}>
            <h4>Cataloged Rootstocks</h4>
            <p className={styles.statValue}>11 <span className={styles.subtext}>Global & India</span></p>
          </div>
        </div>
      </div>

      {activePanel === 'genotypes' && (
        <div className={styles.expandedPanel}>
          <button className={styles.closeBtn} onClick={() => setActivePanel(null)}><X size={16}/></button>
          <h3>Global CTV Genotypes (The Big 8)</h3>
          <p>Citrus Tristeza Virus is highly diverse. Researchers currently classify global isolates into 8 major phylogenetic lineages:</p>
          <ul className={styles.infoList}>
            <li><strong>T30:</strong> Generally mild or asymptomatic. Used globally for cross-protection.</li>
            <li><strong>T36:</strong> Causes severe Quick Decline on Sour Orange rootstock. Endemic in Florida.</li>
            <li><strong>VT:</strong> Highly virulent, causing severe Stem Pitting regardless of rootstock. Widespread in Asia and Spain.</li>
            <li><strong>RB:</strong> "Resistance-Breaking". Uniquely capable of infecting Poncirus trifoliata.</li>
            <li><strong>T3 & T68:</strong> Regional severe strains associated with varying degrees of stem pitting.</li>
            <li><strong>S1 & HA16-5:</strong> Newly classified recombinant or distinct lineages identified through Next-Generation Sequencing.</li>
          </ul>
        </div>
      )}

      {activePanel === 'ncbi' && (
        <div className={styles.expandedPanel}>
          <button className={styles.closeBtn} onClick={() => setActivePanel(null)}><X size={16}/></button>
          <h3>NCBI Sequence Database</h3>
          <p>The National Center for Biotechnology Information (NCBI) hosts a massive, continuously growing repository of CTV genomic data.</p>
          <ul className={styles.infoList}>
            <li><strong>Scope:</strong> Over 2,450 complete and partial genome sequences are currently available.</li>
            <li><strong>NGS Revolution:</strong> The majority of these sequences have been deposited in the last 10 years due to the plummeting cost of Next-Generation Sequencing (NGS).</li>
            <li><strong>Geographic Hotspots:</strong> Major contributions come from diagnostic surveys in the USA (Florida/California), Spain, China, Brazil, and India.</li>
            <li><strong>Significance:</strong> These sequences allow researchers to track viral recombination events and the global movement of severe strains in real-time.</li>
          </ul>
        </div>
      )}

      {activePanel === 'rootstocks' && (
        <div className={styles.expandedPanel}>
          <button className={styles.closeBtn} onClick={() => setActivePanel(null)}><X size={16}/></button>
          <h3>Cataloged Rootstocks</h3>
          <p>The platform currently tracks 11 commercially and historically significant rootstocks, focusing on their specific CTV tolerance.</p>
          <div className={styles.gridList}>
            <div>
              <strong style={{color: 'var(--ctv-green)'}}>Highly Resistant / Tolerant:</strong>
              <ul>
                <li>Poncirus trifoliata (Global)</li>
                <li>Swingle Citrumelo (Global)</li>
                <li>Carrizo Citrange (Global)</li>
                <li>Flying Dragon (Japan)</li>
              </ul>
            </div>
            <div>
              <strong style={{color: 'var(--ctv-orange)'}}>Moderately Tolerant (Used in India):</strong>
              <ul>
                <li>Rough Lemon / Jatti Khatti</li>
                <li>Rangpur Lime</li>
                <li>Cleopatra Mandarin</li>
                <li>Kharna Khatta</li>
                <li>Pectinifera</li>
              </ul>
            </div>
            <div>
              <strong style={{color: 'var(--ctv-red)'}}>Highly Susceptible:</strong>
              <ul>
                <li>Sour Orange (Prone to Quick Decline)</li>
                <li>Galgal (Citrus limon)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
