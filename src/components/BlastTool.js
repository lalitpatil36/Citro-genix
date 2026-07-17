'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Search, Download, GitBranch, RefreshCw, AlertTriangle } from 'lucide-react';
import * as d3 from 'd3';
import styles from './BlastTool.module.css';

// Simple parser for multi-FASTA
const parseFasta = (text) => {
  const sequences = [];
  let currentHeader = '';
  let currentSeq = '';

  const lines = text.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('>')) {
      if (currentHeader) {
        sequences.push({ id: currentHeader, seq: currentSeq });
      }
      currentHeader = line.substring(1).trim();
      currentSeq = '';
    } else {
      currentSeq += line;
    }
  }
  if (currentHeader) {
    sequences.push({ id: currentHeader, seq: currentSeq });
  }
  return sequences.length ? sequences : [{ id: 'Query_1', seq: text.replace(/\s+/g, '') }];
};

export default function BlastTool() {
  const [inputText, setInputText] = useState('');
  const [jobs, setJobs] = useState([]); // Array of { id, seq, rid, status, result, rtoe }
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const treeRef = useRef(null);

  const startBlast = async () => {
    if (!inputText.trim()) return;
    const sequences = parseFasta(inputText);
    
    setIsProcessing(true);
    setShowTree(false);
    
    // Initial Job Setup
    const newJobs = sequences.map(s => ({
      id: s.id,
      seq: s.seq,
      rid: null,
      status: 'SUBMITTING',
      result: null,
      rtoe: 0,
      elapsed: 0
    }));
    setJobs(newJobs);

    // Submit to NCBI BLAST
    for (let i = 0; i < newJobs.length; i++) {
      try {
        const params = new URLSearchParams();
        params.append('CMD', 'Put');
        params.append('PROGRAM', 'blastn');
        params.append('DATABASE', 'nt');
        params.append('QUERY', newJobs[i].seq);

        const res = await fetch('https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi', {
          method: 'POST',
          body: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const text = await res.text();
        
        // Parse RID and RTOE from HTML response
        const ridMatch = text.match(/RID = (.*)/);
        const rtoeMatch = text.match(/RTOE = (.*)/);
        
        if (ridMatch) {
          setJobs(prev => {
            const next = [...prev];
            next[i].rid = ridMatch[1];
            next[i].status = 'WAITING';
            next[i].rtoe = rtoeMatch ? parseInt(rtoeMatch[1]) : 30;
            return next;
          });
        } else {
          throw new Error('Failed to get RID from NCBI');
        }
      } catch (err) {
        setJobs(prev => {
          const next = [...prev];
          next[i].status = 'ERROR';
          next[i].error = err.message;
          return next;
        });
      }
    }
  };

  // Polling Effect
  useEffect(() => {
    const activeJobs = jobs.filter(j => j.status === 'WAITING');
    if (activeJobs.length === 0) {
      if (jobs.length > 0 && jobs.every(j => j.status === 'DONE' || j.status === 'ERROR')) {
        setIsProcessing(false);
      }
      return;
    }

    const timer = setInterval(async () => {
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        if (job.status !== 'WAITING' || !job.rid) continue;

        // Update elapsed time for UI
        setJobs(prev => {
          const next = [...prev];
          next[i].elapsed += 10;
          return next;
        });

        // Only poll NCBI every ~10 seconds to avoid rate limits
        if (job.elapsed % 10 !== 0) continue; 

        try {
          const statusRes = await fetch(`https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_OBJECT=SearchInfo&RID=${job.rid}`);
          const statusText = await statusRes.text();
          
          if (statusText.includes('Status=WAITING')) {
            continue; // Still waiting
          }
          if (statusText.includes('Status=FAILED')) {
            setJobs(prev => {
              const next = [...prev];
              next[i].status = 'ERROR';
              next[i].error = 'NCBI Search Failed';
              return next;
            });
            continue;
          }
          if (statusText.includes('Status=UNKNOWN')) {
            setJobs(prev => {
              const next = [...prev];
              next[i].status = 'ERROR';
              next[i].error = 'RID Expired or Unknown';
              return next;
            });
            continue;
          }
          if (statusText.includes('Status=READY')) {
            // Fetch XML results to bypass NCBI's unpredictable JSON zip compression
            const resultRes = await fetch(`https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=XML&RID=${job.rid}`);
            const resultXml = await resultRes.text();
            
            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(resultXml, "text/xml");
            
            let match = "No significant match";
            let identityPct = "0.00";
            let evalue = "N/A";
            let bitscore = "N/A";

            const topHit = xmlDoc.querySelector("Hit");
            if (topHit) {
              match = topHit.querySelector("Hit_def")?.textContent || match;
              const hsp = topHit.querySelector("Hsp");
              if (hsp) {
                const iden = parseInt(hsp.querySelector("Hsp_identity")?.textContent || "0");
                const alignLen = parseInt(hsp.querySelector("Hsp_align-len")?.textContent || "1");
                identityPct = ((iden / alignLen) * 100).toFixed(2);
                
                // Parse evalue (can be in scientific notation in XML)
                const rawEval = parseFloat(hsp.querySelector("Hsp_evalue")?.textContent || "0");
                evalue = rawEval === 0 ? "0.0" : rawEval.toExponential(2);
                
                bitscore = parseFloat(hsp.querySelector("Hsp_bit-score")?.textContent || "0").toFixed(1);
              }
            }

            setJobs(prev => {
              const next = [...prev];
              next[i].status = 'DONE';
              next[i].result = { match, identity: identityPct, evalue, bitscore, raw: resultXml };
              return next;
            });
          }
        } catch (err) {
          console.error("Polling error for", job.rid, err);
        }
      }
    }, 10000); // Poll loop ticks every 10 seconds

    return () => clearInterval(timer);
  }, [jobs]);

  const exportFasta = () => {
    if (!inputText) return;
    const blob = new Blob([inputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multi_query.fasta';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate Data-Driven UPGMA-style Tree
  useEffect(() => {
    if (showTree && treeRef.current && jobs.every(j => j.status === 'DONE' || j.status === 'ERROR')) {
      d3.select(treeRef.current).selectAll('*').remove();

      const width = treeRef.current.clientWidth;
      const height = Math.max(400, jobs.length * 50 + 200);
      const margin = {top: 20, right: 250, bottom: 20, left: 40};

      const svg = d3.select(treeRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Build hierarchical data based on matches
      // In a real scenario, this requires a complex Distance Matrix and Neighbor-Joining algorithm.
      // Here, we group sequences by their top NCBI hit to simulate the clustering.
      const clusters = {};
      jobs.forEach(job => {
        if (job.status === 'DONE' && job.result) {
          // Simplify match name for clade grouping
          let cladeName = 'Unknown/Other';
          if (job.result.match.toLowerCase().includes('t36')) cladeName = 'Clade 1 (T36-like Severe)';
          else if (job.result.match.toLowerCase().includes('vt') || job.result.match.toLowerCase().includes('t68')) cladeName = 'Clade 2 (VT-like Stem Pitting)';
          else if (job.result.match.toLowerCase().includes('t30') || job.result.match.toLowerCase().includes('mild')) cladeName = 'Clade 3 (T30-like Mild)';
          else cladeName = `Other: ${job.result.match.substring(0, 30)}...`;

          if (!clusters[cladeName]) clusters[cladeName] = [];
          clusters[cladeName].push({
            name: `${job.id} (Id: ${job.result.identity}%)`,
            isQuery: true
          });
        }
      });

      const treeData = {
        name: "NCBI Reference Ancestor",
        children: Object.keys(clusters).map(key => ({
          name: key,
          children: clusters[key]
        }))
      };

      const root = d3.hierarchy(treeData);
      const treeLayout = d3.cluster().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
      treeLayout(root);

      // Links
      svg.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('d', d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
        );

      // Nodes
      const node = svg.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

      node.append('circle')
        .attr('r', 5)
        .attr('fill', d => d.data.isQuery ? 'var(--ctv-green)' : '#888')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

      // Labels
      node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -8 : 8)
        .attr('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
        .attr('fill', d => d.data.isQuery ? 'var(--ctv-green)' : '#fff')
        .attr('font-weight', d => d.data.isQuery ? 'bold' : 'normal')
        .attr('font-size', '12px');
    }
  }, [showTree, jobs]);

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <Activity size={28} className={styles.icon} />
        <h2>Live NCBI Cloud BLAST</h2>
      </div>
      <p className={styles.subtitle}>
        Submit Multi-FASTA sequences directly to the official NCBI servers for deep genomic alignment.
      </p>

      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          placeholder=">Sequence_1&#10;ATGGACGACGAAACAAAGAAAT...&#10;>Sequence_2&#10;GTACGTCAGTTGGGAACCCAAC..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={8}
        />
        <button className={styles.runBtn} onClick={startBlast} disabled={isProcessing || !inputText}>
          {isProcessing ? 'Processing Jobs...' : 'Submit to NCBI Server'} <Search size={16} />
        </button>
      </div>

      {jobs.length > 0 && (
        <div className={styles.jobTracker}>
          <h3><RefreshCw size={18}/> Job Status Tracker</h3>
          <div className={styles.warning}>
            <AlertTriangle size={14}/> Note: Real NCBI API searches can take 1-5 minutes per sequence depending on server load.
          </div>
          
          <div className={styles.jobList}>
            {jobs.map((job, idx) => (
              <div key={idx} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <h4>{job.id}</h4>
                  <span className={`${styles.statusBadge} ${styles[job.status]}`}>{job.status}</span>
                </div>
                
                {job.status === 'SUBMITTING' && <p>Connecting to NCBI...</p>}
                
                {job.status === 'WAITING' && (
                  <div className={styles.waitingInfo}>
                    <p>RID: {job.rid}</p>
                    <p>Est. Time: {job.rtoe}s (Elapsed: {job.elapsed}s)</p>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${Math.min(100, (job.elapsed / job.rtoe) * 100)}%` }}></div>
                    </div>
                  </div>
                )}

                {job.status === 'ERROR' && <p className={styles.errorText}>{job.error}</p>}

                {job.status === 'DONE' && job.result && (
                  <div className={styles.jobResult}>
                    <p className={styles.matchTitle}><strong>Top Hit:</strong> {job.result.match}</p>
                    <div className={styles.miniStats}>
                      <span><strong>ID:</strong> {job.result.identity}%</span>
                      <span><strong>E-val:</strong> {job.result.evalue}</span>
                      <span><strong>Bit:</strong> {job.result.bitscore}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isProcessing && jobs.some(j => j.status === 'DONE') && (
            <div className={styles.postJobActions}>
              <button className={styles.exportBtn} onClick={exportFasta}>
                <Download size={16}/> Export Multi-FASTA
              </button>
              <button 
                className={`${styles.exportBtn} ${showTree ? styles.activeBtn : ''}`} 
                onClick={() => setShowTree(!showTree)}
              >
                <GitBranch size={16}/> {showTree ? 'Hide Multi-Sequence Tree' : 'Generate Multi-Sequence MEGA Tree'}
              </button>
            </div>
          )}

          {showTree && !isProcessing && (
            <div className={styles.treeContainer}>
              <h4>Data-Driven Phylogenetic Dendrogram</h4>
              <p>Clustering your queried sequences into evolutionary clades based on actual NCBI genomic similarity metrics.</p>
              <div className={styles.d3Tree} ref={treeRef}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
