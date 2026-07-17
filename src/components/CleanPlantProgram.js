'use client';

import { useState } from 'react';
import { ShieldCheck, ArrowRight, Activity, Beaker, Leaf, CheckCircle, Info, Landmark, X, Globe } from 'lucide-react';
import styles from './CleanPlantProgram.module.css';

export default function CleanPlantProgram() {
  const [activeStrain, setActiveStrain] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  const strainDB = {
    mild: {
      name: "T30 (Mild Strain)",
      type: "Cross-Protection Agent",
      description: "A mild, asymptomatic isolate of CTV. When inoculated into healthy citrus, it triggers the plant's RNA-interference (RNAi) defense mechanism. This 'pre-primes' the immune system, effectively blocking severe strains from establishing a super-infection in the same plant.",
      usage: "Widely used globally (e.g., Florida, Brazil, South Africa) in commercial nurseries before field planting."
    },
    severe: {
      name: "VT / T36 (Severe Strains)",
      type: "Pathogenic Targets",
      description: "Highly virulent strains responsible for Quick Decline (T36) and severe Stem Pitting (VT). These strains cause massive phloem necrosis at the bud union of susceptible rootstocks (like Sour Orange), leading to rapid tree death or severe stunting.",
      usage: "The primary targets that Clean Plant Programmes attempt to eradicate or protect against via mild strain cross-protection."
    }
  };

  const steps = [
    { 
      id: 'source',
      title: 'Source Selection', 
      icon: <Leaf />, 
      desc: 'Identify elite, true-to-type mother trees.',
      details: {
        title: "Elite Mother Tree Identification",
        content: "The process begins in isolated foundation blocks. Agronomists identify 'mother trees' that exhibit superior horticultural traits (yield, fruit quality, true-to-type genetics) and show absolutely no visual symptoms of viral, viroid, or bacterial infections. In India, institutions like ICAR-CCRI maintain these primary foundation blocks."
      }
    },
    { 
      id: 'indexing',
      title: 'Pathogen Indexing', 
      icon: <Activity />, 
      desc: 'PCR testing for CTV, HLB, and viroids.',
      details: {
        title: "Rigorous Molecular Indexing",
        content: "Budwood from the mother tree undergoes exhaustive laboratory testing. This includes Double Antibody Sandwich ELISA (DAS-ELISA) and Reverse Transcription PCR (RT-PCR) specifically targeting Citrus Tristeza Virus (CTV), Citrus Greening (HLB/Liberibacter), and Citrus Exocortis Viroid (CEVd). Any tree testing positive is immediately rejected from the foundation block."
      }
    },
    { 
      id: 'stg',
      title: 'Shoot Tip Grafting', 
      icon: <Beaker />, 
      desc: 'In vitro grafting to eliminate remaining viruses.',
      details: {
        title: "Shoot Tip Micro-Grafting (STG)",
        content: "If a highly valuable variety is infected, it can be 'cleaned' via STG. Viruses like CTV struggle to replicate in the rapidly dividing cells of the apical meristem. Scientists excise a microscopic (0.1 - 0.2 mm) shoot tip under a microscope and graft it in-vitro onto a sterile rootstock seedling. The resulting plant is completely virus-free."
      }
    },
    { 
      id: 'cross_protection',
      title: 'Cross Protection', 
      icon: <ShieldCheck />, 
      desc: 'Pre-immunization with mild CTV strain.',
      details: {
        title: "Pre-Immunization",
        content: "Before the clean plant is released to areas where severe CTV strains are endemic, it is purposefully inoculated with a mild, asymptomatic strain (like T30). This acts similarly to a vaccine, triggering the plant's RNA-interference (RNAi) defenses and preventing super-infection by severe, decline-causing strains."
      }
    },
    { 
      id: 'release',
      title: 'Certified Release', 
      icon: <CheckCircle />, 
      desc: 'Distribution to commercial growers.',
      details: {
        title: "Regulatory Policy & Distribution",
        content: "Release is strictly governed by national policies to prevent the spread of infected material.",
        indiaPolicy: "In India, the National Horticulture Board (NHB), backed by the Asian Development Bank, leads the Clean Plant Program (CPP). It establishes 9 Clean Plant Centers (CPCs). Nurseries must adhere to the Seeds Act, 1966, utilize 40-mesh insect-proof net houses with double-door entry to block aphids, and use soilless media. Nurseries are graded via the NHB Star-Rating accreditation system.",
        globalPolicy: "Globally, programs like the California Citrus Clonal Protection Program (CCPP) and Florida's mandatory budwood registration laws make it illegal to propagate citrus from non-certified, non-indexed budwood sources."
      }
    }
  ];

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <ShieldCheck size={28} className={styles.icon} />
        <h2>Clean Plant & Cross-Protection Pipeline</h2>
      </div>
      <p className={styles.subtitle}>
        Global regulatory framework for producing virus-free propagation material. Click any step for detailed ICAR/NHB scientific and policy data.
      </p>

      <div className={styles.pipeline}>
        {steps.map((step, idx) => (
          <div key={idx} className={styles.stepWrapper}>
            <div 
              className={`${styles.stepCard} ${activeStep === step.id ? styles.activeStepCard : ''}`}
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
            >
              <div className={styles.stepIcon}>{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
            {idx < steps.length - 1 && <ArrowRight className={styles.arrow} />}
          </div>
        ))}
      </div>

      {activeStep && (
        <div className={styles.stepDetailsPanel}>
          <button className={styles.closeBtn} onClick={() => setActiveStep(null)}><X size={16}/></button>
          
          {steps.map(step => step.id === activeStep && (
            <div key={step.id}>
              <h3>{step.details.title}</h3>
              <p>{step.details.content}</p>
              
              {step.details.indiaPolicy && (
                <div className={styles.policyGrid}>
                  <div className={styles.policyCard}>
                    <h4><Landmark size={16}/> India NHB Policy (CPP)</h4>
                    <p>{step.details.indiaPolicy}</p>
                  </div>
                  <div className={styles.policyCard}>
                    <h4><Globe size={16}/> Global Standard (CCPP)</h4>
                    <p>{step.details.globalPolicy}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.crossProtectionPanel}>
        <h3><Info size={18}/> Interactive Strain Database</h3>
        <p>Explore the biological components used in global cross-protection programs.</p>
        
        <div className={styles.strainButtons}>
          <button 
            className={`${styles.strainBtn} ${activeStrain === 'mild' ? styles.activeMild : ''}`}
            onClick={() => setActiveStrain(activeStrain === 'mild' ? null : 'mild')}
          >
            Mild Strain (e.g., T30)
          </button>
          <button 
            className={`${styles.strainBtn} ${activeStrain === 'severe' ? styles.activeSevere : ''}`}
            onClick={() => setActiveStrain(activeStrain === 'severe' ? null : 'severe')}
          >
            Severe Strain (e.g., VT/T36)
          </button>
        </div>

        {activeStrain && (
          <div className={styles.strainInfoBox}>
            <h4>{strainDB[activeStrain].name} <span>({strainDB[activeStrain].type})</span></h4>
            <p><strong>Mechanism:</strong> {strainDB[activeStrain].description}</p>
            <p><strong>Global Context:</strong> {strainDB[activeStrain].usage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
