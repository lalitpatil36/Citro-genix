import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// A simple k-mer based heuristic aligner for JS (mocking BLASTn logic)
function calculateAlignment(querySeq, targetSeq) {
  if (!querySeq || !targetSeq) return 0;
  
  // Clean inputs
  querySeq = querySeq.toUpperCase().replace(/[^ATCG]/g, '');
  
  if (querySeq.length === 0) return 0;

  // Simple heuristic: count matching 11-mers (common in BLAST)
  const k = Math.min(11, querySeq.length);
  let matches = 0;
  const totalKmers = querySeq.length - k + 1;
  
  // If sequence is small, just do a direct substring search or simple match
  if (querySeq.length < 50) {
    if (targetSeq.includes(querySeq)) return 100;
    
    // Otherwise, simple character match (very naive, but fast)
    let bestIdentity = 0;
    for(let i=0; i <= targetSeq.length - querySeq.length; i++) {
        let matchCount = 0;
        for(let j=0; j < querySeq.length; j++) {
            if (targetSeq[i+j] === querySeq[j]) matchCount++;
        }
        const identity = (matchCount / querySeq.length) * 100;
        if (identity > bestIdentity) bestIdentity = identity;
    }
    return bestIdentity;
  }

  // K-mer matching for larger sequences (faster heuristic)
  // To avoid huge memory, we just sample k-mers from query and check if they exist in target
  let hitCount = 0;
  const sampleRate = Math.max(1, Math.floor(querySeq.length / 100)); // sample max 100 k-mers
  let actualSamples = 0;

  for (let i = 0; i < totalKmers; i += sampleRate) {
    actualSamples++;
    const kmer = querySeq.substring(i, i + k);
    if (targetSeq.includes(kmer)) {
      hitCount++;
    }
  }

  // Interpolate identity (very rough estimation for demonstration)
  const hitRatio = hitCount / actualSamples;
  // If 100% kmers hit, 100% identity. If 0%, random chance (25%).
  let estimatedIdentity = 25 + (hitRatio * 75);
  
  // Add some slight randomness to simulate realistic biological variance if it's high
  if (estimatedIdentity > 99 && estimatedIdentity < 100) estimatedIdentity = 99.9;
  
  return estimatedIdentity;
}

export async function POST(request) {
  try {
    const body = await request.json();
    let querySequence = body.sequence || '';
    
    // Remove FASTA header if present
    if (querySequence.startsWith('>')) {
      querySequence = querySequence.split('\n').slice(1).join('');
    }

    const isolates = await prisma.isolate.findMany({
      include: { genotype: true }
    });

    let bestMatch = null;
    let highestIdentity = 0;

    for (const iso of isolates) {
      if (!iso.sequence) continue;
      
      const identity = calculateAlignment(querySequence, iso.sequence);
      if (identity > highestIdentity) {
        highestIdentity = identity;
        bestMatch = iso;
      }
    }

    if (!bestMatch) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 });
    }

    // Calculate simulated E-value (lower is better, dependent on length and identity)
    const eValue = highestIdentity > 90 ? '0.0' : highestIdentity > 50 ? '1e-50' : '0.01';
    
    // Calculate coverage (mocked based on input length vs standard gene)
    const coverage = Math.min(100, Math.max(10, Math.floor((querySequence.length / bestMatch.length) * 100 * 50)));

    return NextResponse.json({
      matchedStrain: `${bestMatch.name} (${bestMatch.genotype.name})`,
      identity: highestIdentity.toFixed(2),
      eValue,
      queryCoverage: coverage > 100 ? '100%' : `${coverage}%`
    });

  } catch (error) {
    console.error('BLAST Error:', error);
    return NextResponse.json({ error: 'Failed to run alignment' }, { status: 500 });
  }
}
