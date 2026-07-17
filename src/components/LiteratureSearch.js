'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import styles from './LiteratureSearch.module.css';

export default function LiteratureSearch() {
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [rootstock, setRootstock] = useState('');
  const [country, setCountry] = useState('Global');
  const [docType, setDocType] = useState('All');
  
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchPapers = async () => {
    setLoading(true);
    let apiQuery = 'Citrus Tristeza Virus'; // Base context
    
    if (query) apiQuery += ` AND ${query}`;
    if (author) apiQuery += ` AND AUTH:"${author}"`;
    if (year) apiQuery += ` AND PUB_YEAR:${year}`;
    if (rootstock) apiQuery += ` AND "${rootstock}"`;
    if (country && country !== 'Global') apiQuery += ` AND "${country}"`;
    if (docType === 'Review') apiQuery += ` AND (PT:"Review" OR "review")`;
    if (docType === 'Chapter') apiQuery += ` AND (PT:"Book" OR "chapter")`;

    try {
      const res = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(apiQuery)}&format=json&pageSize=10&resultType=core`);
      const data = await res.json();
      setPapers(data.resultList?.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleScholarSearch = () => {
    let q = query;
    if (author) q += ` author:"${author}"`;
    if (rootstock) q += ` ${rootstock}`;
    if (country && country !== 'Global') q += ` ${country}`;
    if (docType === 'Review') q += ` review`;
    if (docType === 'Chapter') q += ` chapter`;
    
    window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`, '_blank');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPapers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, author, year, rootstock, country, docType]);

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <h2>Academic Literature Search (Global Database)</h2>
        <button className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} /> Advanced Filters
        </button>
      </div>
      <p className={styles.subtitle}>Powered by Europe PMC & Global Databases - Searching millions of Research Papers, Review Articles, and Book Chapters.</p>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.icon} />
        <input 
          type="text" 
          placeholder="Search global databases (keywords, technology, rootstocks)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleGoogleScholarSearch} className={styles.scholarBtn}>
          Search Google Scholar
        </button>
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label>Author</label>
            <input type="text" placeholder="e.g. Gottwald" value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
          <div className={styles.filterGroup}>
            <label>Publication Year</label>
            <input type="number" placeholder="e.g. 2023" value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div className={styles.filterGroup}>
            <label>Rootstock Focus</label>
            <input type="text" placeholder="e.g. Trifoliate Orange" value={rootstock} onChange={e => setRootstock(e.target.value)} />
          </div>
          <div className={styles.filterGroup}>
            <label>Region / Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)}>
              <option value="Global">Global (All)</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="Spain">Spain</option>
              <option value="Brazil">Brazil</option>
              <option value="China">China</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Document Type</label>
            <select value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Research">Research Papers</option>
              <option value="Review">Review Articles</option>
              <option value="Chapter">Book Chapters</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingSpinner}></div>
      ) : (
        <div className={styles.results}>
          {papers.length === 0 ? <p>No papers found. Try adjusting filters.</p> : papers.map(paper => (
            <div key={paper.id} className={styles.paperCard}>
              <div className={styles.paperMain}>
                <h3>{paper.title}</h3>
                <p className={styles.authors}>{paper.authorString} ({paper.pubYear})</p>
                <p className={styles.abstract}>
                  {paper.abstractText ? paper.abstractText.substring(0, 250) + '...' : 'No abstract available.'}
                </p>
              </div>
              <div className={styles.paperMeta}>
                <span className={styles.journal}>{paper.journalTitle || 'Unknown Journal'}</span>
                {paper.doi && (
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className={styles.doiBtn}>
                    View <ExternalLink size={14}/>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
