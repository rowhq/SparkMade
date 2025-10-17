import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use POSTGRES_PRISMA_URL if available (Vercel/Neon), otherwise DATABASE_URL
// Provide a dummy URL if not configured (for build time)
if (!process.env.DATABASE_URL) {
  if (process.env.POSTGRES_PRISMA_URL) {
    process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
  } else {
    console.warn('DATABASE_URL is not configured. Using dummy URL for build. Database features will fail at runtime.');
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
