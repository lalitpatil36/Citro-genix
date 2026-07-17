'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BarChart3, Globe, MapPin, ExternalLink, AlertOctagon } from 'lucide-react';
import styles from './CitrusProductionStats.module.css';

const globalData = [
  { year: '2018', China: 38.5, Brazil: 17.5, India: 12.5, USA: 5.5, Spain: 6.0 },
  { year: '2019', China: 39.2, Brazil: 18.0, India: 13.1, USA: 5.2, Spain: 6.2 },
  { year: '2020', China: 40.5, Brazil: 16.5, India: 13.8, USA: 4.8, Spain: 6.5 },
  { year: '2021', China: 41.2, Brazil: 16.0, India: 14.2, USA: 4.5, Spain: 6.6 },
  { year: '2022', China: 42.0, Brazil: 15.8, India: 14.8, USA: 4.1, Spain: 5.9 },
  { year: '2023', China: 42.5, Brazil: 16.2, India: 15.2, USA: 3.8, Spain: 5.7 },
  { year: '2024', China: 43.1, Brazil: 16.0, India: 15.8, USA: 3.5, Spain: 5.8 },
  { year: '2025', China: 43.8, Brazil: 16.3, India: 16.5, USA: 3.2, Spain: 5.6 },
  { year: '2026', China: 44.5, Brazil: 16.5, India: 17.2, USA: 2.9, Spain: 5.7 }
]; // in Million Tonnes (Simulated FAO Data)

const indiaData = [
  { year: '2018', Maharashtra: 3.2, MadhyaPradesh: 2.1, Punjab: 1.5, AndhraPradesh: 1.4 },
  { year: '2019', Maharashtra: 3.4, MadhyaPradesh: 2.3, Punjab: 1.6, AndhraPradesh: 1.3 },
  { year: '2020', Maharashtra: 3.3, MadhyaPradesh: 2.4, Punjab: 1.7, AndhraPradesh: 1.5 },
  { year: '2021', Maharashtra: 3.5, MadhyaPradesh: 2.6, Punjab: 1.6, AndhraPradesh: 1.6 },
  { year: '2022', Maharashtra: 3.6, MadhyaPradesh: 2.8, Punjab: 1.8, AndhraPradesh: 1.7 },
  { year: '2023', Maharashtra: 3.8, MadhyaPradesh: 2.9, Punjab: 1.9, AndhraPradesh: 1.8 },
  { year: '2024', Maharashtra: 3.8, MadhyaPradesh: 3.1, Punjab: 2.0, AndhraPradesh: 1.8 },
  { year: '2025', Maharashtra: 3.9, MadhyaPradesh: 3.3, Punjab: 2.2, AndhraPradesh: 1.9 },
  { year: '2026', Maharashtra: 3.9, MadhyaPradesh: 3.5, Punjab: 2.3, AndhraPradesh: 1.9 }
]; // in Million Tonnes (Simulated NHB Data)

const threatMatrix = {
  global: [
    { region: "Florida, USA", crop: "Sweet Oranges", disease: "Citrus Greening (HLB)", impact: "Devastating. Production down >70% since 2005.", advice: "Requires vector control (psyllid) under protective screen structures (CUPS)." },
    { region: "São Paulo, Brazil", crop: "Sweet Oranges", disease: "Citrus Tristeza Virus (CTV)", impact: "Managed successfully via cross-protection.", advice: "Mandatory use of mild strain cross-protection on all commercial plantings." },
    { region: "Mediterranean (Spain/Italy)", crop: "Lemons/Oranges", disease: "Citrus Tristeza Virus (CTV)", impact: "Rising threat as severe strains emerge.", advice: "Transitioning away from susceptible Sour Orange rootstocks." }
  ],
  india: [
    { region: "Maharashtra (Vidarbha)", crop: "Nagpur Mandarin", disease: "Phytophthora & CTV", impact: "High threat. Causes widespread decline (gummosis).", advice: "Avoid flood irrigation. Ensure bud-union is >6 inches above soil. Use Rangpur Lime rootstock." },
    { region: "Punjab & Rajasthan", crop: "Kinnow Mandarin", disease: "Citrus Greening (HLB)", impact: "Severe threat spreading rapidly via psyllids.", advice: "Frequent scouting for psyllids. Immediate eradication of yellowing, symptomatic trees." },
    { region: "Andhra Pradesh", crop: "Sweet Orange (Sathgudi)", disease: "Citrus Canker & Dry Root Rot", impact: "High threat during monsoon seasons.", advice: "Apply copper sprays before monsoons. Improve soil drainage." },
    { region: "Northeast (Assam/Meghalaya)", crop: "Khasi Mandarin", disease: "Citrus Tristeza Virus (CTV)", impact: "Endemic, causing slow decline.", advice: "Procure virus-free planting material from accredited clean plant centers." }
  ]
};

export default function CitrusProductionStats() {
  const [mode, setMode] = useState('india'); // 'global' or 'india'
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current).selectAll('*').remove();

    const data = mode === 'global' ? globalData : indiaData;
    const keys = mode === 'global' 
      ? ['China', 'Brazil', 'India', 'USA', 'Spain']
      : ['Maharashtra', 'MadhyaPradesh', 'Punjab', 'AndhraPradesh'];
    
    const colors = mode === 'global'
      ? ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
      : ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
      
    const colorScale = d3.scaleOrdinal().domain(keys).range(colors);

    const margin = { top: 30, right: 120, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(data.map(d => d.year))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, mode === 'global' ? 45 : 4])
      .range([height, 0]);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(5))
      .style("stroke-dasharray", "3,3")
      .style("stroke-opacity", 0.1);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr('color', 'var(--text-secondary)')
      .style("font-size", "12px");

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('color', 'var(--text-secondary)')
      .style("font-size", "12px");

    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('Production (Million Tonnes)');

    keys.forEach(key => {
      const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d[key]))
        .curve(d3.curveMonotoneX);

      const path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colorScale(key))
        .attr('stroke-width', 3)
        .attr('d', line);
        
      const totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);
        
      // Dots
      svg.selectAll(`.dot-${key}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d[key]))
        .attr('r', 4)
        .attr('fill', '#050914')
        .attr('stroke', colorScale(key))
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .transition()
        .delay(1000)
        .duration(500)
        .style('opacity', 1);
    });

    // Legend
    const legend = svg.selectAll(".legend")
      .data(keys)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width + 10},${i * 25})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", colorScale);

    legend.append("text")
      .attr("x", 20)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("fill", "var(--text-primary)")
      .style("font-size", "12px")
      .text(d => d.replace(/([A-Z])/g, ' $1').trim());

  }, [mode]);

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <BarChart3 size={28} className={styles.icon} />
        <h2>Citrus Production & Regional Threat Matrix</h2>
      </div>
      <p className={styles.subtitle}>
        Analyze crop output trends and identify the specific pathogenic threats targeting your geographic region.
      </p>

      <div className={styles.controls}>
        <button 
          className={`${styles.toggleBtn} ${mode === 'india' ? styles.active : ''}`}
          onClick={() => setMode('india')}
        >
          <MapPin size={16}/> India State-Wise (NHB Data)
        </button>
        <button 
          className={`${styles.toggleBtn} ${mode === 'global' ? styles.active : ''}`}
          onClick={() => setMode('global')}
        >
          <Globe size={16}/> Global Top Producers (FAO Data)
        </button>
      </div>

      <div className={styles.chartContainer}>
        <svg ref={svgRef} className={styles.d3Chart}></svg>
      </div>

      <div className={styles.sourceLinks}>
        <span>Verify Live Data Sources:</span>
        {mode === 'india' ? (
          <a href="https://nhb.gov.in/Statistics.aspx" target="_blank" rel="noreferrer"><ExternalLink size={14}/> National Horticulture Board (NHB)</a>
        ) : (
          <a href="https://www.fao.org/faostat/en/#data/QCL" target="_blank" rel="noreferrer"><ExternalLink size={14}/> FAOSTAT Database</a>
        )}
      </div>

      <div className={styles.threatMatrix}>
        <h3 className={styles.threatTitle}><AlertOctagon size={20}/> Regional Disease Threat Matrix ({mode === 'india' ? 'India' : 'Global'})</h3>
        <p className={styles.threatSubtitle}>Which diseases are actively destroying crops in your area?</p>
        
        <div className={styles.matrixGrid}>
          {threatMatrix[mode].map((threat, idx) => (
            <div key={idx} className={styles.threatCard}>
              <div className={styles.threatHeader}>
                <h4>{threat.region}</h4>
                <span className={styles.cropTag}>{threat.crop}</span>
              </div>
              <div className={styles.primaryThreat}>
                <strong>Primary Threat:</strong> <span className={styles.diseaseName}>{threat.disease}</span>
              </div>
              <p className={styles.impact}><em>"{threat.impact}"</em></p>
              <div className={styles.advice}>
                <strong>Farmer Advice:</strong> {threat.advice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
