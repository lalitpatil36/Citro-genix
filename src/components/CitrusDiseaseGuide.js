'use client';

import { useState } from 'react';
import { ShieldAlert, Bug, Droplets, Leaf, Activity, Info, X } from 'lucide-react';
import styles from './CitrusDiseaseGuide.module.css';

export default function CitrusDiseaseGuide() {
  const [activeDisease, setActiveDisease] = useState(null);

  const diseases = [
    {
      id: 'hlb',
      name: 'Citrus Greening (HLB)',
      scientific: 'Candidatus Liberibacter asiaticus',
      icon: <Leaf size={24} color="#ffaa00" />,
      color: 'var(--ctv-orange)',
      symptoms: 'Asymmetrical blotchy mottle on leaves, yellow shoots, lopsided bitter fruit with aborted seeds. Roots decline severely.',
      vector: 'Asian Citrus Psyllid (Diaphorina citri). Spread through grafting and insect feeding.',
      management: 'No cure exists. Management requires strict vector control (insecticides), use of certified disease-free nursery stock, and immediate removal of infected trees.',
      farmerAdvice: 'Check new flush for psyllids. If you see blotchy mottling that crosses the leaf vein, it is likely HLB.'
    },
    {
      id: 'canker',
      name: 'Citrus Canker',
      scientific: 'Xanthomonas axonopodis pv. citri',
      icon: <Activity size={24} color="#ff3333" />,
      color: '#ff3333',
      symptoms: 'Raised, corky, crater-like lesions with water-soaked margins and yellow halos on leaves, twigs, and fruit. Causes severe defoliation and fruit drop.',
      vector: 'Bacterial pathogen spread by wind-driven rain, contaminated equipment, and human movement.',
      management: 'Apply copper-based bactericides preventatively. Implement windbreaks to reduce rain splashing. Prune out infected shoots during the dry season.',
      farmerAdvice: 'Do not work in the orchard when leaves are wet. Disinfect tools with 1% sodium hypochlorite.'
    },
    {
      id: 'phytophthora',
      name: 'Phytophthora (Gummosis)',
      scientific: 'Phytophthora nicotianae / P. palmivora',
      icon: <Droplets size={24} color="#58a6ff" />,
      color: 'var(--accent-primary)',
      symptoms: 'Water-soaked bark at the trunk base exuding gum. Bark dries, cracks, and sloughs off. Causes yellowing canopy and root rot.',
      vector: 'Soil-borne water molds. Thrives in poorly drained soils and excessive moisture against the trunk.',
      management: 'Use resistant rootstocks (e.g., Sour Orange, Swingle). Avoid burying the bud union. Apply trunk paints (Bordeaux mixture or systemic fungicides like Fosetyl-Al).',
      farmerAdvice: 'Ensure water does not pool around the trunk base. Use drip or micro-sprinkler irrigation rather than flood irrigation if possible.'
    },
    {
      id: 'ctv',
      name: 'Citrus Tristeza Virus',
      scientific: 'Closterovirus (CTV)',
      icon: <Bug size={24} color="#3fb950" />,
      color: 'var(--ctv-green)',
      symptoms: 'Quick decline of trees grafted on sour orange. Stem pitting (deep grooves in wood under bark) in severe strains on susceptible scions like grapefruit.',
      vector: 'Brown Citrus Aphid (Toxoptera citricida) and Melon Aphid. Also spread by infected grafting material.',
      management: 'Use tolerant rootstocks (e.g., Trifoliate, Rangpur Lime). Cross-protection with mild strains (T30) can protect against severe stem-pitting strains.',
      farmerAdvice: 'Always buy certified virus-free budwood. If trees suddenly wilt with leaves still attached, check for a honey-combing pattern under the bark at the graft union.'
    },
    {
      id: 'blackspot',
      name: 'Citrus Black Spot',
      scientific: 'Guignardia citricarpa',
      icon: <Bug size={24} color="#8b4513" />,
      color: '#8b4513',
      symptoms: 'Hard spot lesions on the fruit with grey centers and dark rims, often containing tiny black dots (pycnidia). Causes premature fruit drop.',
      vector: 'Fungal spores spread by wind and rain splash from fallen, decaying leaves on the orchard floor.',
      management: 'Remove leaf litter to reduce inoculum. Apply protective copper fungicide sprays during the susceptible fruit development period.',
      farmerAdvice: 'Clear the orchard floor of fallen leaves before the rainy season begins, as this is where the fungus survives and spreads from.'
    },
    {
      id: 'scab',
      name: 'Citrus Scab',
      scientific: 'Elsinoë fawcettii',
      icon: <Activity size={24} color="#a0522d" />,
      color: '#a0522d',
      symptoms: 'Wart-like, corky, raised pustules on leaves, twigs, and fruit. Severe infections distort leaves and stunt growth.',
      vector: 'Fungal spores spread via rain splash and overhead irrigation. High humidity is required for infection.',
      management: 'Apply fungicides (like copper or strobilurins) at the onset of new flush and again at petal fall.',
      farmerAdvice: 'Avoid using overhead sprinklers that wet the canopy. Water the soil directly to keep the leaves dry.'
    },
    {
      id: 'melanose',
      name: 'Citrus Melanose',
      scientific: 'Diaporthe citri',
      icon: <Droplets size={24} color="#cd853f" />,
      color: '#cd853f',
      symptoms: 'Small, dark brown, raised pustules on leaves and fruit ("sandpaper" texture). Causes "tear-stain" patterns on fruit skin.',
      vector: 'Fungus reproduces in dead wood in the canopy. Spores wash down onto healthy tissue during rain.',
      management: 'Prune out dead wood from the canopy, as this is the source of the infection. Apply copper sprays post-bloom.',
      farmerAdvice: 'Regular pruning is your best defense. If you leave dead branches in the tree, the next rain will spread the disease to the fruit below.'
    }
  ];

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <ShieldAlert size={28} className={styles.icon} />
        <h2>Comprehensive Citrus Disease Guide</h2>
      </div>
      <p className={styles.subtitle}>
        Identify, understand, and manage the major diseases threatening citrus crops in India.
      </p>

      <div className={styles.grid}>
        {diseases.map(disease => (
          <div 
            key={disease.id} 
            className={`${styles.card} ${activeDisease?.id === disease.id ? styles.activeCard : ''}`}
            onClick={() => setActiveDisease(disease)}
            style={{ '--theme-color': disease.color }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>{disease.icon}</div>
              <h3>{disease.name}</h3>
            </div>
            <p className={styles.scientific}><em>{disease.scientific}</em></p>
          </div>
        ))}
      </div>

      {activeDisease && (
        <div className={styles.detailsPanel} style={{ '--theme-color': activeDisease.color }}>
          <div className={styles.detailsHeader}>
            <h3>{activeDisease.name} Details</h3>
            <button className={styles.closeBtn} onClick={() => setActiveDisease(null)}><X size={20}/></button>
          </div>
          
          <div className={styles.detailsContent}>
            <div className={styles.detailSection}>
              <h4><Activity size={16}/> Symptoms</h4>
              <p>{activeDisease.symptoms}</p>
            </div>
            <div className={styles.detailSection}>
              <h4><Bug size={16}/> Spread & Vector</h4>
              <p>{activeDisease.vector}</p>
            </div>
            <div className={styles.detailSection}>
              <h4><ShieldAlert size={16}/> Management</h4>
              <p>{activeDisease.management}</p>
            </div>
            <div className={styles.adviceBox}>
              <h4><Info size={16}/> Practical Farmer Advice</h4>
              <p>{activeDisease.farmerAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
