'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Play } from 'lucide-react';
import styles from './GenomeBrowser.module.css';

export default function GenomeBrowser() {
  const svgRef = useRef();
  const [isolate, setIsolate] = useState(null);
  const [hoveredOrf, setHoveredOrf] = useState(null);

  useEffect(() => {
    fetch('/api/genome')
      .then(res => res.json())
      .then(data => setIsolate(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!isolate || !svgRef.current) return;

    const width = 800;
    const height = 260; // Increased height for precise layout
    const margin = { top: 30, right: 40, bottom: 40, left: 40 };
    
    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('background', 'transparent');

    const genomeLength = isolate.length || 19300;
    
    const x = d3.scaleLinear()
      .domain([0, genomeLength])
      .range([margin.left, width - margin.right]);

    const rectHeight = 25;
    const centerY = height / 2;

    // Define gradients to match image styling
    const defs = svg.append("defs");
    const gradients = {
      'gradient-red': ['#ff1a1a', '#ff4d4d'], // Neon Red
      'gradient-darkgreen': ['#00ff00', '#33cc33'], // Neon Green
      'gradient-tan': ['#ffcc00', '#ffdb4d'], // Bright Yellow/Tan
      'gradient-blue': ['#1a8cff', '#4d94ff'], // Bright Azure
      'gradient-lightgreen': ['#ccff33', '#99ff33'], // Lime Neon
      'gradient-orange': ['#ff6600', '#ff8533'], // Electric Orange
      'gradient-gold': ['#ffd700', '#ffeb99'], // Bright Gold
      'gradient-grey': ['#f2f2f2', '#ffffff'], // Bright White/Grey
      'gradient-teal': ['#00ffff', '#66ffff'], // Neon Cyan
      'gradient-darkorange': ['#ff3300', '#ff5c33'], // Vivid Red-Orange
      'gradient-magenta': ['#ff00ff', '#ff66ff'], // Hot Pink/Magenta
      'gradient-lightgrey': ['#e6e6e6', '#f9f9f9'],
      'gradient-darkblue': ['#0000ff', '#4d4dff'] // Pure Blue
    };

    for (const [id, colors] of Object.entries(gradients)) {
      const gradient = defs.append("linearGradient")
        .attr("id", id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", colors[0]);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", colors[1]);
    }

    // Helper for Y positioning based on exact alignment
    const getYPos = (d) => {
      switch (d.alignment) {
        case 'bottom': return centerY - rectHeight; // Sits ON the line
        case 'top': return centerY; // Hangs BELOW the line
        case 'center': return centerY - (rectHeight / 2); // Line through middle
        case 'stack': return centerY - (rectHeight * 2); // Sits on top of a bottom block
        default: return centerY - rectHeight;
      }
    };

    // Draw the main horizontal line (5' to 3' axis)
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', centerY)
      .attr('x2', width - margin.right + 20) // Extend slightly
      .attr('y2', centerY)
      .attr('stroke', '#000') // Solid black line exactly like image
      .attr('stroke-width', 2);

    svg.append('text')
      .attr('x', margin.left - 15)
      .attr('y', centerY + 4)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--text-primary)')
      .text("5'");

    svg.append('text')
      .attr('x', width - margin.right + 25)
      .attr('y', centerY + 4)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', 'var(--text-primary)')
      .text("3'");

    // Draw ORFs
    svg.selectAll('rect')
      .data(isolate.orfs)
      .join('rect')
      .attr('x', d => x(d.startPos))
      .attr('y', d => getYPos(d))
      .attr('width', 0) // Start 0 for animation
      .attr('height', rectHeight)
      .attr('fill', d => d.color ? `url(#${d.color})` : '#999')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('class', styles.orfTrack)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        const query = `Citrus Tristeza Virus ${d.name} ORF function`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      })
      .on('mouseenter', (event, d) => {
        setHoveredOrf(d);
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr('stroke-width', 2)
          .attr('stroke', '#fff')
          .attr('filter', 'brightness(1.2)');
      })
      .on('mouseleave', (event) => {
        setHoveredOrf(null);
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr('stroke-width', 1)
          .attr('stroke', '#000')
          .attr('filter', 'none');
      })
      .transition()
      .duration(1500)
      .delay((d, i) => i * 150)
      .attr('width', d => Math.max(2, x(d.endPos) - x(d.startPos)))
      .ease(d3.easeElasticOut);

    // Inner block text (P-PRO, p33, etc.)
    svg.selectAll('text.innerLabel')
      .data(isolate.orfs)
      .join('text')
      .attr('class', 'innerLabel')
      .attr('x', d => x(d.startPos) + Math.max(2, x(d.endPos) - x(d.startPos))/2)
      .attr('y', d => getYPos(d) + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000') // Black text inside blocks mostly
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => (x(d.endPos) - x(d.startPos)) > 25 ? d.name : '')
      .transition()
      .duration(1500)
      .delay((d, i) => i * 150 + 500)
      .attr('opacity', 1);

    // Top Numbered Labels (1B, 2, 3...)
    svg.selectAll('text.topLabel')
      .data(isolate.orfs.filter(d => d.topLabel))
      .join('text')
      .attr('class', 'topLabel')
      .attr('x', d => x(d.startPos) + (x(d.endPos) - x(d.startPos))/2)
      // Position these high above the graph
      .attr('y', margin.top + 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => d.topLabel)
      .transition()
      .duration(1500)
      .delay((d, i) => i * 150 + 800)
      .attr('opacity', 1);

    // Add axes
    const xAxis = d3.axisBottom(x).ticks(10).tickFormat(d => `${d/1000}k`);
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom + 10})`)
      .call(xAxis)
      .attr('color', 'var(--text-secondary)');

  }, [isolate]);

  if (!isolate) return <div className={styles.loading}>Loading Genome Data...</div>;

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <h2>Interactive Genome Browser</h2>
        <button onClick={() => setIsolate({...isolate})} className={styles.animateBtn}>
          <Play size={16}/> Re-animate Genome
        </button>
      </div>
      <p className={styles.meta}>Total length: {isolate.length} nt | (+)-sense ssRNA</p>
      
      <div className={styles.browserContainer}>
        <svg ref={svgRef}></svg>
      </div>
      
      <div className={styles.infoPanel}>
        {hoveredOrf ? (
          <div className={styles.orfDetails}>
            <h3>{hoveredOrf.name}</h3>
            <p><strong>Function:</strong> {hoveredOrf.function}</p>
            <p><strong>Position:</strong> {hoveredOrf.startPos} - {hoveredOrf.endPos}</p>
          </div>
        ) : (
          <div className={styles.orfDetailsEmpty}>
            Hover over an ORF track to view gene function and details.
          </div>
        )}
      </div>
    </div>
  );
}
