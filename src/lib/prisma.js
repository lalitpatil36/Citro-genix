import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// On Netlify serverless, Prisma Client can crash on instantiation if the SQLite binary is missing.
// Since this is a demo, we mock the PrismaClient to prevent the entire Next.js server chunk from crashing on boot.
export const prisma = globalForPrisma.prisma || {
  disease: { count: async () => 0, findMany: async () => [] },
  rootstock: { count: async () => 0, findMany: async () => [] },
  genotype: { count: async () => 0, findMany: async () => [] },
  isolate: { count: async () => 0, findMany: async () => [] },
  researchPaper: { count: async () => 0, findMany: async () => [] }
};

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
