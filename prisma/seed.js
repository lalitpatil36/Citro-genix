const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateSequence(length) {
  const chars = 'ATCG';
  let seq = '';
  for (let i = 0; i < length; i++) {
    seq += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seq;
}

const baseT36Sequence = generateSequence(19296);
const mutateSeq = (seq, identity) => {
  let mutated = '';
  const chars = 'ATCG';
  for (let i = 0; i < seq.length; i++) {
    if (Math.random() > identity) {
      mutated += chars.charAt(Math.floor(Math.random() * chars.length));
    } else {
      mutated += seq[i];
    }
  }
  return mutated;
};

async function main() {
  console.log('Clearing old data...');
  await prisma.orf.deleteMany({});
  await prisma.researchPaper.deleteMany({});
  await prisma.isolate.deleteMany({});
  await prisma.rootstock.deleteMany({});
  await prisma.genotype.deleteMany({});
  await prisma.disease.deleteMany({});

  console.log('Seeding comprehensive database...');
  
  const ctv = await prisma.disease.create({
    data: { name: 'Citrus Tristeza', pathogen: 'CTV', symptoms: 'Quick decline, stem pitting', transmission: 'Aphids', management: 'Cross-protection' }
  });
  
  const rootstocks = [
    { name: 'Poncirus trifoliata (Trifoliate Orange)', origin: 'China', ctvTolerance: 'Highly Resistant', soilPreference: 'Well-drained, slightly acidic', recommendations: 'Standard cold-hardy rootstock globally.' },
    { name: 'Swingle Citrumelo', origin: 'USA (Hybrid)', ctvTolerance: 'Tolerant', soilPreference: 'Sandy to loam, sensitive to high pH', recommendations: 'Excellent Phytophthora resistance.' },
    { name: 'Carrizo Citrange', origin: 'USA (Hybrid)', ctvTolerance: 'Tolerant', soilPreference: 'Wide range, intolerant of calcareous', recommendations: 'Vigorous, standard in Florida & Spain.' },
    { name: 'Sour Orange', origin: 'Asia', ctvTolerance: 'Highly Susceptible (Quick Decline)', soilPreference: 'Calcareous, wet soils', recommendations: 'Historically used globally; now avoided where severe CTV exists.' },
    { name: 'Flying Dragon', origin: 'Japan', ctvTolerance: 'Resistant', soilPreference: 'Well-drained', recommendations: 'Used for high-density dwarfing orchards.' },
    { name: 'Rough Lemon (Jatti Khatti)', origin: 'India', ctvTolerance: 'Tolerant', soilPreference: 'Wide adaptability', recommendations: 'Most widely used in India; vigorous but susceptible to root rot.' },
    { name: 'Rangpur Lime', origin: 'India', ctvTolerance: 'Tolerant', soilPreference: 'Drought-prone, sandy', recommendations: 'Excellent drought tolerance; popular in India and Brazil.' },
    { name: 'Cleopatra Mandarin', origin: 'India', ctvTolerance: 'Tolerant', soilPreference: 'Saline, calcareous', recommendations: 'Salt-tolerant; slow to reach full production.' },
    { name: 'Kharna Khatta', origin: 'Northern India', ctvTolerance: 'Moderate', soilPreference: 'Various', recommendations: 'Popular in Uttar Pradesh.' },
    { name: 'Pectinifera', origin: 'India', ctvTolerance: 'Moderate', soilPreference: 'Loam', recommendations: 'Potential alternative for specific Indian agro-climates.' },
    { name: 'Galgal (Citrus limon)', origin: 'India', ctvTolerance: 'Susceptible', soilPreference: 'Various', recommendations: 'Generally discouraged commercially due to root rot susceptibility.' }
  ];

  await prisma.rootstock.createMany({ data: rootstocks });

  const t36 = await prisma.genotype.create({ data: { name: 'T36' } });
  const vt = await prisma.genotype.create({ data: { name: 'VT' } });
  const rb = await prisma.genotype.create({ data: { name: 'RB' } });

  const isolates = [
    { name: 'FS593', region: 'Florida', country: 'USA', genotypeId: t36.id, diseaseId: ctv.id, length: 19296, sequence: baseT36Sequence },
    { name: 'Kpg3', region: 'Darjeeling', country: 'India', genotypeId: vt.id, diseaseId: ctv.id, length: 19296, sequence: mutateSeq(baseT36Sequence, 0.85) },
    { name: 'Kpg5', region: 'Northeast', country: 'India', genotypeId: vt.id, diseaseId: ctv.id, length: 19296, sequence: mutateSeq(baseT36Sequence, 0.88) }
  ];

  for (const iso of isolates) {
    await prisma.isolate.create({ data: iso });
  }

  const kpg5 = await prisma.isolate.findUnique({ where: { name: 'Kpg5' } });
  
  // Exact Image Layout Replication
  // alignment: 'bottom' (sits ON the line), 'top' (hangs BELOW the line), 'center' (line through middle), 'stack' (sits ON TOP of another block)
  // topLabel: The number/label that floats high above
  const exactOrfs = [
    { name: 'P-PRO', function: 'Papain-like Protease', start: 108, end: 1800, alignment: 'bottom', topLabel: 'ORF1a', color: 'gradient-red' },
    { name: 'MTR', function: 'Methyltransferase', start: 1801, end: 4000, alignment: 'bottom', topLabel: '', color: 'gradient-darkgreen' },
    // A visual spacer/connector for p349 in the image (yellowish)
    { name: 'p349', function: 'Polyprotein 1a', start: 4001, end: 5000, alignment: 'bottom', topLabel: '', color: 'gradient-tan' },
    { name: 'HEL', function: 'Helicase', start: 5001, end: 10400, alignment: 'bottom', topLabel: '', color: 'gradient-blue' },
    // Another spacer (light green)
    { name: '', function: '', start: 10401, end: 11000, alignment: 'bottom', topLabel: '', color: 'gradient-lightgreen' },
    
    // RdRp (1B) hangs below
    { name: 'RdRp', function: 'RNA-dependent RNA polymerase', start: 10426, end: 12200, alignment: 'top', topLabel: '1B', color: 'gradient-lightgreen' },
    
    // p33 (2) sits on line
    { name: 'p33', function: 'Host range/movement', start: 12200, end: 13200, alignment: 'bottom', topLabel: '2', color: 'gradient-orange' },
    
    // p6 (3) stacked on p33
    { name: 'p6', function: 'Movement', start: 13000, end: 13400, alignment: 'stack', topLabel: '3', color: 'gradient-gold' },
    
    // p65 (4) centered on line
    { name: 'p65', function: 'Virion assembly (HSP70h)', start: 13200, end: 14800, alignment: 'center', topLabel: '4', color: 'gradient-grey' },
    
    // p61 (5) hangs below
    { name: 'p61', function: 'Virion assembly', start: 14750, end: 16400, alignment: 'top', topLabel: '5', color: 'gradient-teal' },
    
    // p27 (6) sits on line
    { name: 'p27', function: 'Minor coat protein (CPm)', start: 16400, end: 17100, alignment: 'bottom', topLabel: '6', color: 'gradient-orange' },
    
    // p25 (7) hangs below
    { name: 'p25', function: 'Major coat protein (CP)', start: 17100, end: 17800, alignment: 'top', topLabel: '7', color: 'gradient-darkorange' },
    
    // p18 (8) sits on line
    { name: 'p18', function: 'Unknown', start: 17800, end: 18200, alignment: 'bottom', topLabel: '8', color: 'gradient-magenta' },
    
    // p13 (9) hangs below
    { name: 'p13', function: 'Unknown', start: 18200, end: 18600, alignment: 'top', topLabel: '9', color: 'gradient-lightgrey' },
    
    // p20 (10) sits on line
    { name: 'p20', function: 'Silencing suppressor', start: 18600, end: 19100, alignment: 'bottom', topLabel: '10', color: 'gradient-blue' },
    
    // p23 (11) hangs below
    { name: 'p23', function: 'RNA silencing suppressor', start: 19100, end: 19700, alignment: 'top', topLabel: '11', color: 'gradient-darkblue' }
  ];

  for (const orf of exactOrfs) {
    await prisma.orf.create({
      data: {
        isolateId: kpg5.id,
        name: orf.name,
        function: orf.function,
        startPos: orf.start,
        endPos: Math.min(orf.end, kpg5.length),
        alignment: orf.alignment,
        topLabel: orf.topLabel,
        color: orf.color
      }
    });
  }

  console.log('Seeding completed.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
