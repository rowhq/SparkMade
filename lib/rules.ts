import { readFileSync } from 'fs';
import { join } from 'path';

interface BannedCategories {
  banned: string[];
  restricted: string[];
}

/**
 * Check if a category is banned
 */
export function isBannedCategory(category: string): boolean {
  try {
    const bannedPath = join(
      process.cwd(),
      '../../packages/config/rules/banned_categories.json'
    );
    const data: BannedCategories = JSON.parse(readFileSync(bannedPath, 'utf-8'));

    return data.banned.some((banned) =>
      category.toLowerCase().includes(banned.toLowerCase())
    );
  } catch (error) {
    console.error('Error loading banned categories:', error);
    return false;
  }
}

/**
 * Check if a category is restricted (requires extra review)
 */
export function isRestrictedCategory(category: string): boolean {
  try {
    const bannedPath = join(
      process.cwd(),
      '../../packages/config/rules/banned_categories.json'
    );
    const data: BannedCategories = JSON.parse(readFileSync(bannedPath, 'utf-8'));

    return data.restricted.some((restricted) =>
      category.toLowerCase().includes(restricted.toLowerCase())
    );
  } catch (error) {
    console.error('Error loading restricted categories:', error);
    return false;
  }
}

/**
 * Get default milestones for a project
 */
export function getDefaultMilestones(): Array<{
  name: string;
  percentRelease: number;
  daysFromLock: number;
}> {
  return [
    {
      name: 'Pilot sample approved',
      percentRelease: 30,
      daysFromLock: 14,
    },
    {
      name: 'Mass production complete',
      percentRelease: 40,
      daysFromLock: 45,
    },
    {
      name: 'Freight and fulfillment',
      percentRelease: 30,
      daysFromLock: 60,
    },
  ];
}

/**
 * Calculate platform fee (e.g., 5% of total)
 */
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * 0.05);
}
