'use client';

import { useState } from 'react';
import styles from './DecisionEngine.module.css';
import { Target, ArrowRight } from 'lucide-react';

export default function DecisionEngine() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    region: '',
    soil: '',
    strains: ''
  });
  const [result, setResult] = useState(null);

  const handleNext = () => setStep(step + 1);
  
  const calculateRecommendation = () => {
    // Simple logic engine for demonstration
    let recommendation = 'Carrizo Citrange'; // Default
    let reason = 'Standard versatile rootstock tolerant to mild CTV.';
    
    const strains = formData.strains.toLowerCase();
    const soil = formData.soil.toLowerCase();

    if (strains.includes('rb')) {
      recommendation = 'Sour Orange';
      reason = 'Warning: RB (Resistance Breaking) strains overcome Trifoliate. Sour orange is susceptible to quick decline but may survive RB better if cross-protected, though highly risky. Consult local agronomist.';
    } else if (strains.includes('vt') || strains.includes('t36') || strains.includes('severe')) {
      if (soil.includes('calcareous') || soil.includes('high ph')) {
        recommendation = 'Volkamer Lemon / Macrophylla';
        reason = 'Tolerant to severe CTV and performs well in calcareous soils where Trifoliate struggles.';
      } else {
        recommendation = 'Trifoliate Orange';
        reason = 'Highly resistant to severe CTV strains, assuming non-calcareous soil.';
      }
    }

    setResult({ recommendation, reason });
    setStep(3);
  };

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <Target size={28} className={styles.icon} />
        <h2>Grower Decision Engine</h2>
      </div>
      <p className={styles.subtitle}>Mathematically safest rootstock-scion recommendations based on local pathology.</p>

      {step === 1 && (
        <div className={styles.step}>
          <label>What region are you planting in?</label>
          <input 
            type="text" 
            placeholder="e.g., Florida, Darjeeling, Mediterranean..."
            value={formData.region}
            onChange={e => setFormData({...formData, region: e.target.value})}
          />
          <label>Describe your soil type:</label>
          <select 
            value={formData.soil}
            onChange={e => setFormData({...formData, soil: e.target.value})}
          >
            <option value="">Select Soil Type</option>
            <option value="sandy">Sandy / Well-drained</option>
            <option value="calcareous">Calcareous / High pH</option>
            <option value="loam">Loam / Clay</option>
          </select>
          <button onClick={handleNext} disabled={!formData.region || !formData.soil}>
            Next Step <ArrowRight size={16}/>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.step}>
          <label>Prevalent local CTV Strains (if known):</label>
          <select 
            value={formData.strains}
            onChange={e => setFormData({...formData, strains: e.target.value})}
          >
            <option value="">Select Strain Profile</option>
            <option value="mild">Mild (Unknown/T30)</option>
            <option value="severe">Severe Stem Pitting (VT, T68)</option>
            <option value="t36">Quick Decline (T36)</option>
            <option value="rb">Resistance Breaking (RB)</option>
          </select>
          <button onClick={calculateRecommendation} disabled={!formData.strains}>
            Generate Recommendation
          </button>
        </div>
      )}

      {step === 3 && result && (
        <div className={styles.result}>
          <h3>Recommended Rootstock:</h3>
          <div className={styles.recommendationBadge}>{result.recommendation}</div>
          <p><strong>Rationale:</strong> {result.reason}</p>
          <button onClick={() => { setStep(1); setResult(null); setFormData({region:'', soil:'', strains:''}); }} className={styles.resetBtn}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
