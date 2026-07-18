// In-memory data store to replace Prisma on Netlify Serverless
export const db = {
  disease: { count: async () => 6 },
  rootstock: { count: async () => 12 },
  genotype: { count: async () => 8 },
  isolate: { count: async () => 145 },
  researchPaper: { 
    count: async () => 84,
    findMany: async () => [
      { id: 'mock1', title: 'Global spread and genomic analysis of severe Citrus Tristeza Virus strains', authors: 'Dawson et al.', publicationYear: 2023, genotypesStudied: 'VT, T36, T30' },
      { id: 'mock2', title: 'Hyperspectral imaging for early asymptomatic detection of HLB', authors: 'Li, X. et al.', publicationYear: 2024, genotypesStudied: 'General' },
      { id: 'mock3', title: 'Cross-protection efficacy of mild CTV isolates in commercial orchards', authors: 'Moreno, P. et al.', publicationYear: 2022, genotypesStudied: 'Mild Strains' }
    ]
  },
  genome: {
    getCTVMock: async () => ({
      id: 'CTV-T36-REF',
      length: 19296,
      orfs: [
        { name: 'ORF1a', topLabel: '1a', startPos: 108, endPos: 10580, function: 'Polyprotein 1a (PRO)', alignment: 'bottom', color: 'gradient-red' },
        { name: 'ORF1b', topLabel: '1b', startPos: 10580, endPos: 11883, function: 'RNA-dependent RNA polymerase (RdRp)', alignment: 'center', color: 'gradient-tan' },
        { name: 'p33', topLabel: '2', startPos: 11883, endPos: 12782, function: 'Host interaction / systemic infection', alignment: 'bottom', color: 'gradient-blue' },
        { name: 'p6', topLabel: '3', startPos: 12782, endPos: 12943, function: 'Unknown', alignment: 'stack', color: 'gradient-lightgreen' },
        { name: 'p65', topLabel: '4', startPos: 12943, endPos: 14718, function: 'HSP70 homolog (virion assembly)', alignment: 'bottom', color: 'gradient-orange' },
        { name: 'p61', topLabel: '5', startPos: 14718, endPos: 16301, function: 'Virion assembly', alignment: 'center', color: 'gradient-gold' },
        { name: 'p27', topLabel: '6', startPos: 16301, endPos: 17020, function: 'Unknown', alignment: 'bottom', color: 'gradient-grey' },
        { name: 'p25', topLabel: '7', startPos: 17020, endPos: 17691, function: 'Major Coat Protein (CP)', alignment: 'stack', color: 'gradient-teal' },
        { name: 'p18', topLabel: '8', startPos: 17691, endPos: 18182, function: 'Minor Coat Protein (CPm)', alignment: 'bottom', color: 'gradient-magenta' },
        { name: 'p13', topLabel: '9', startPos: 18182, endPos: 18538, function: 'Unknown', alignment: 'stack', color: 'gradient-lightgrey' },
        { name: 'p20', topLabel: '10', startPos: 18538, endPos: 19080, function: 'Suppressor of RNA silencing', alignment: 'bottom', color: 'gradient-darkorange' },
        { name: 'p23', topLabel: '11', startPos: 19080, endPos: 19280, function: 'RNA silencing suppressor / Pathogenicity', alignment: 'stack', color: 'gradient-darkblue' }
      ]
    })
  }
};
