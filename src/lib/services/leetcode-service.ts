import prisma from '@/lib/prisma';
import { fetchLeetCodeStats } from '@/lib/leetcode';

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

/**
 * Fetch user's LeetCode stats from the API
 */
export async function fetchUserStats(username: string): Promise<LeetCodeStats | null> {
  try {
    const stats = await fetchLeetCodeStats(username);

    if (!stats?.submitStats?.acSubmissionNum) {
      return null;
    }

    const getCount = (difficulty: string) =>
      stats.submitStats.acSubmissionNum.find(
        (x: { difficulty: string; count: number }) => x.difficulty === difficulty
      )?.count || 0;

    return {
      username: stats.username || username,
      totalSolved: getCount('All'),
      easySolved: getCount('Easy'),
      mediumSolved: getCount('Medium'),
      hardSolved: getCount('Hard'),
    };
  } catch (error) {
    console.error(`Failed to fetch LeetCode stats for ${username}:`, error);
    return null;
  }
}

/**
 * Get the start of day for a date in UTC
 */
function getStartOfDayUTC(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of day for a date in a specific timezone
 */
export function getStartOfDayInTimezone(date: Date, timezone: string): Date {
  try {
    // Format the date in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const dateStr = formatter.format(date);
    // Parse it back as UTC start of day
    return new Date(dateStr + 'T00:00:00.000Z');
  } catch {
    // Fallback to UTC if timezone is invalid
    return getStartOfDayUTC(date);
  }
}

/**
 * Sync a user's LeetCode progress and update DailyProgress
 * Returns the number of problems solved today (delta from yesterday)
 */
export async function syncUserProgress(userId: string): Promise<{
  success: boolean;
  stats?: LeetCodeStats;
  todaySolved?: number;
  error?: string;
}> {
  try {
    // Get user with their LeetCode profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        leetcodeProfile: true,
        leetcodeVerified: true,
        lastTotalSolved: true,
        timezone: true,
      },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.leetcodeProfile) {
      return { success: false, error: 'No LeetCode profile connected' };
    }

    // Fetch current stats from LeetCode
    const stats = await fetchUserStats(user.leetcodeProfile);

    if (!stats) {
      return { success: false, error: 'Failed to fetch LeetCode stats' };
    }

    const today = getStartOfDayInTimezone(new Date(), user.timezone || 'UTC');

    // Calculate today's delta
    let todaySolved = 0;
    if (user.lastTotalSolved !== null && user.lastTotalSolved !== undefined) {
      todaySolved = Math.max(0, stats.totalSolved - user.lastTotalSolved);
    }

    // Check if we already have a DailyProgress entry for today
    const existingProgress = await prisma.dailyProgress.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    // Update or create DailyProgress
    if (existingProgress) {
      // If stats increased, update
      if (stats.totalSolved > existingProgress.totalSolved) {
        await prisma.dailyProgress.update({
          where: { id: existingProgress.id },
          data: {
            totalSolved: stats.totalSolved,
            easyCount: stats.easySolved,
            mediumCount: stats.mediumSolved,
            hardCount: stats.hardSolved,
          },
        });
      }
    } else {
      await prisma.dailyProgress.create({
        data: {
          userId,
          date: today,
          totalSolved: stats.totalSolved,
          easyCount: stats.easySolved,
          mediumCount: stats.mediumSolved,
          hardCount: stats.hardSolved,
        },
      });
    }

    // Update user's problemsSolved and lastTotalSolved
    await prisma.user.update({
      where: { id: userId },
      data: {
        problemsSolved: stats.totalSolved,
        lastTotalSolved: stats.totalSolved,
      },
    });

    return {
      success: true,
      stats,
      todaySolved,
    };
  } catch (error) {
    console.error(`Failed to sync progress for user ${userId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Calculate the delta of problems solved today for a user
 * Based on comparing current stats with yesterday's DailyProgress
 */
export async function calculateDailyDelta(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        leetcodeProfile: true,
        timezone: true,
      },
    });

    if (!user?.leetcodeProfile) {
      return 0;
    }

    // Get current stats
    const currentStats = await fetchUserStats(user.leetcodeProfile);
    if (!currentStats) {
      return 0;
    }

    // Get yesterday's progress
    const today = getStartOfDayInTimezone(new Date(), user.timezone || 'UTC');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayProgress = await prisma.dailyProgress.findUnique({
      where: {
        userId_date: {
          userId,
          date: yesterday,
        },
      },
    });

    if (!yesterdayProgress) {
      // No record from yesterday - check for any previous record
      const latestProgress = await prisma.dailyProgress.findFirst({
        where: { userId },
        orderBy: { date: 'desc' },
      });

      if (latestProgress) {
        return Math.max(0, currentStats.totalSolved - latestProgress.totalSolved);
      }

      return 0;
    }

    return Math.max(0, currentStats.totalSolved - yesterdayProgress.totalSolved);
  } catch (error) {
    console.error(`Failed to calculate daily delta for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Sync all users with verified LeetCode profiles
 */
export async function syncAllUsers(): Promise<{
  processed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let processed = 0;

  try {
    const users = await prisma.user.findMany({
      where: {
        leetcodeProfile: { not: null },
        leetcodeVerified: true,
      },
      select: { id: true },
    });

    for (const user of users) {
      const result = await syncUserProgress(user.id);
      if (result.success) {
        processed++;
      } else {
        errors.push(`User ${user.id}: ${result.error}`);
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (error) {
    errors.push(`Global error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return { processed, errors };
}
