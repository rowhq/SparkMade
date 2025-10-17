import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Provide a dummy DATABASE_URL if not configured (for build time)
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not configured. Using dummy URL for build. Database features will fail at runtime.');
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
