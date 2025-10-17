import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

/**
 * Get the current authenticated user from database
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return user;
}

/**
 * Require authentication or throw
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Require specific role
 */
export async function requireRole(role: Role) {
  const user = await requireAuth();

  if (user.role !== role && user.role !== Role.ADMIN) {
    throw new Error('Forbidden');
  }

  return user;
}

/**
 * Check if user has role
 */
export async function hasRole(role: Role): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role || user?.role === Role.ADMIN;
}

/**
 * Sync Clerk user to database
 */
export async function syncUser(clerkUserId: string, email: string, name?: string) {
  return await prisma.user.upsert({
    where: { id: clerkUserId },
    update: { email, name },
    create: {
      id: clerkUserId,
      email,
      name,
      role: Role.BACKER,
      kycStatus: 'PENDING',
    },
  });
}
