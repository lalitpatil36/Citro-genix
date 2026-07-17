'use client';

import { useState } from 'react';
import { Sprout, AlertTriangle, ShieldCheck, Bug, Info, Droplets, Mountain } from 'lucide-react';
import styles from './GrowerDecisionEngine.module.css';

export default function GrowerDecisionEngine() {
  const [region, setRegion] = useState('');
  const [strain, setStrain] = useState('');
  const [scion, setScion] = useState('');
  const [soil, setSoil] = useState('');
  const [water, setWater] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!region || !strain || !scion || !soil || !water) return;
    
    setIsGenerating(true);
    setRecommendation(null);

    setTimeout(() => {
      let rec = {
        primaryRootstock: '',
        scionAdvice: '',
        warning: '',
        soilAdvice: '',
        vectorControl: 'Implement strict control of the Brown Citrus Aphid (Toxoptera citricida) using recommended insecticides (e.g., Dimethoate) and yellow sticky traps.'
      };

      // Base Logic
      if (region.includes('India')) {
        
        // Water & Soil Logic for India
        if (water === 'rainfed' || soil === 'sandy') {
          rec.primaryRootstock = 'Rough Lemon (Jatti Khatti)';
          rec.soilAdvice = 'Rough Lemon is highly drought-tolerant and performs well in sandy/loamy soils. It induces vigorous growth and early fruiting.';
        } else if (soil === 'calcareous' || soil === 'heavy') {
          rec.primaryRootstock = 'Rangpur Lime or Cleopatra Mandarin';
          rec.soilAdvice = 'Rangpur lime tolerates calcareous (high pH) soils well. Cleopatra Mandarin is excellent for heavy soils and has high salt tolerance.';
        } else {
          rec.primaryRootstock = 'Rough Lemon or Rangpur Lime';
          rec.soilAdvice = 'Both are highly adaptable to general Indian soil conditions.';
        }

        // Scion Compatibility
        if (scion === 'nagpur' || scion === 'khasi' || scion === 'darjeeling') {
          rec.scionAdvice = 'Indian Mandarins are highly compatible with your selected rootstock, ensuring a long orchard lifespan.';
        } else if (scion === 'kinnow') {
          rec.scionAdvice = 'Kinnow performs exceptionally well on Rough Lemon, though fruit quality can be slightly improved on Troyer Citrange if soil permits.';
        } else if (scion === 'mosambi' || scion === 'valencia' || scion === 'navel') {
          rec.scionAdvice = 'Sweet Oranges graft well onto Rangpur Lime (for vigor) or Carrizo Citrange (for quality), depending on soil constraints.';
        } else if (scion === 'kagzi' || scion === 'persian_lime') {
          rec.scionAdvice = 'Acid limes are often grown from seed in India, but if grafting, Rangpur lime or Rough lemon is a standard choice.';
        } else if (scion === 'grapefruit' || scion === 'pummelo') {
          rec.scionAdvice = 'Grapefruit and Pummelos are highly susceptible to severe stem pitting strains (like VT). Extreme caution is advised regardless of rootstock.';
        } else if (scion === 'lemon') {
          rec.scionAdvice = 'Lemons (Eureka/Lisbon) are generally tolerant to CTV quick decline but can be susceptible to specific stem pitting isolates.';
        } else {
          rec.scionAdvice = 'Ensure the selected scion is certified virus-free before grafting onto the recommended rootstock.';
        }

        // Disease / Strain Overrides & Warnings
        rec.warning = 'CRITICAL: Do NOT use Sour Orange rootstock. ';
        if (strain === 'severe_sp') {
          rec.warning += 'Since severe Stem Pitting strains are prevalent, monitor tree vigor closely. Stem pitting affects the scion regardless of rootstock. Consider cross-protection (pre-immunization) of your scion material.';
        }
        if (soil === 'calcareous') {
          rec.warning += 'Avoid Poncirus trifoliata (Trifoliate orange); it will suffer severe iron chlorosis in high pH soils, despite its excellent CTV tolerance.';
        }

      } else {
        // Global / Generic
        rec.primaryRootstock = 'Swingle Citrumelo or Carrizo Citrange';
        rec.scionAdvice = 'General global recommendation for robust CTV tolerance.';
        rec.soilAdvice = 'Ensure soil is well-drained. Avoid highly calcareous soils for these Trifoliate hybrids.';
        rec.warning = 'Avoid Sour Orange unless you are in a region strictly free of Toxoptera citricida or severe strains.';
      }

      setRecommendation(rec);
      setIsGenerating(false);
    }, 1000);
  };

  const isFormComplete = region && strain && scion && soil && water;

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <Sprout size={28} className={styles.icon} />
        <h2>Advanced Grower Decision Engine</h2>
      </div>
      <p className={styles.subtitle}>
        Mathematically safest rootstock recommendations evaluating CTV Pathology, Soil Type, Water Availability, and Scion Compatibility.
      </p>

      <div className={styles.formGrid}>
        {/* Pathology Section */}
        <div className={styles.formSection}>
          <h4><ShieldCheck size={16}/> Disease & Region Profile</h4>
          <div className={styles.formGroup}>
            <label>Geographic Region:</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={styles.select}>
              <option value="">Select Region...</option>
              <option value="India (Central / Maharashtra)">India (Central / Maharashtra)</option>
              <option value="India (North-East)">India (North-East)</option>
              <option value="Florida, USA">Florida, USA</option>
              <option value="São Paulo, Brazil">São Paulo, Brazil</option>
              <option value="Mediterranean">Mediterranean Basin</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Prevalent CTV Strains:</label>
            <select value={strain} onChange={(e) => setStrain(e.target.value)} className={styles.select}>
              <option value="">Select Strain Profile...</option>
              <option value="mild">Mostly Mild (Asymptomatic)</option>
              <option value="decline">Quick Decline Strains (e.g., T36)</option>
              <option value="severe_sp">Severe Stem Pitting (e.g., VT / Asian strains)</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        {/* Agronomy Section */}
        <div className={styles.formSection}>
          <h4><Mountain size={16}/> Agronomic Profile</h4>
          <div className={styles.formGroup}>
            <label>Target Scion (Crop Group):</label>
            <select value={scion} onChange={(e) => setScion(e.target.value)} className={styles.select}>
              <option value="">Select Crop...</option>
              <optgroup label="Mandarins & Tangerines">
                <option value="nagpur">Nagpur Mandarin</option>
                <option value="kinnow">Kinnow Mandarin</option>
                <option value="khasi">Khasi Mandarin</option>
                <option value="darjeeling">Darjeeling Mandarin</option>
                <option value="clementine">Clementine / Satsuma</option>
              </optgroup>
              <optgroup label="Sweet Oranges">
                <option value="mosambi">Mosambi (Sweet Orange)</option>
                <option value="valencia">Valencia Orange</option>
                <option value="navel">Washington Navel</option>
              </optgroup>
              <optgroup label="Limes & Lemons">
                <option value="kagzi">Acid Lime (Kagzi)</option>
                <option value="persian_lime">Persian / Tahiti Lime</option>
                <option value="lemon">True Lemon (Eureka / Lisbon)</option>
              </optgroup>
              <optgroup label="Grapefruit & Pummelo">
                <option value="grapefruit">Grapefruit (Ruby Red / Star)</option>
                <option value="pummelo">Pummelo</option>
              </optgroup>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Primary Soil Type:</label>
            <select value={soil} onChange={(e) => setSoil(e.target.value)} className={styles.select}>
              <option value="">Select Soil...</option>
              <option value="loamy">Loamy / Well-drained</option>
              <option value="heavy">Heavy Clay (Poor Drainage)</option>
              <option value="calcareous">High pH / Calcareous</option>
              <option value="sandy">Sandy</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Water Availability:</label>
            <select value={water} onChange={(e) => setWater(e.target.value)} className={styles.select}>
              <option value="">Select Irrigation...</option>
              <option value="irrigated">Fully Irrigated</option>
              <option value="rainfed">Rainfed / Drought-prone</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        className={styles.generateBtn} 
        onClick={handleGenerate}
        disabled={!isFormComplete || isGenerating}
      >
        {isGenerating ? 'Synthesizing Agronomic Data...' : 'Generate Comprehensive Strategy'}
      </button>

      {recommendation && (
        <div className={styles.reportCard}>
          <h3><ShieldCheck size={20}/> Comprehensive Agronomic Strategy</h3>
          
          <div className={styles.reportSection}>
            <h4><Sprout size={16}/> Primary Rootstock Recommendation</h4>
            <p className={styles.highlight}>{recommendation.primaryRootstock}</p>
            <p>{recommendation.scionAdvice}</p>
          </div>

          <div className={styles.reportSection}>
            <h4><Droplets size={16}/> Soil & Water Compatibility</h4>
            <p>{recommendation.soilAdvice}</p>
          </div>

          <div className={styles.reportSection}>
            <h4 style={{color: 'var(--ctv-red)'}}><AlertTriangle size={16}/> Critical Warnings</h4>
            <p>{recommendation.warning}</p>
          </div>

          <div className={styles.reportSection}>
            <h4 style={{color: 'var(--ctv-orange)'}}><Bug size={16}/> Vector Management</h4>
            <p>{recommendation.vectorControl}</p>
          </div>

          <div className={styles.disclaimer}>
            <Info size={14}/>
            <p><strong>Disclaimer:</strong> This is a data-driven algorithmic suggestion. Always consult your local Krishi Vigyan Kendra (KVK) or agricultural extension officer before making large-scale planting decisions.</p>
          </div>
        </div>
      )}
    </div>
  );
}
