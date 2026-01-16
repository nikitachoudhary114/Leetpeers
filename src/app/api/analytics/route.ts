import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface DailyStats {
  date: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'weekly';

    // Calculate date range
    const now = new Date();
    const days = range === 'weekly' ? 7 : range === 'monthly' ? 30 : 365;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Fetch submissions from database
    const submissions = await prisma.codeSubmission.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
        },
        status: 'accepted',
      },
      select: {
        createdAt: true,
        problemSlug: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Fetch streak logs
    const streakLogs = await prisma.streakLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get user's current streak
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        streakCount: true,
        problemsSolved: true,
      },
    });

    // Aggregate submissions by day
    // Note: Since we don't store difficulty in CodeSubmission,
    // we'll simulate it based on problemSlug patterns or fetch from LeetCode
    const dailyStatsMap = new Map<string, DailyStats>();

    // Initialize all days in range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStatsMap.set(dateStr, {
        date: dateStr,
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0,
      });
    }

    // Group unique problems solved per day (deduplicate by problemSlug per day)
    const dailyProblemsMap = new Map<string, Set<string>>();

    for (const submission of submissions) {
      const dateStr = submission.createdAt.toISOString().split('T')[0];

      if (!dailyProblemsMap.has(dateStr)) {
        dailyProblemsMap.set(dateStr, new Set());
      }

      dailyProblemsMap.get(dateStr)!.add(submission.problemSlug);
    }

    // Update daily stats with unique problem counts
    for (const [dateStr, problems] of dailyProblemsMap.entries()) {
      const stats = dailyStatsMap.get(dateStr);
      if (stats) {
        // Distribute randomly among difficulties for demo
        // In production, you'd want to store difficulty with the submission
        const total = problems.size;
        const easy = Math.floor(total * 0.4);
        const medium = Math.floor(total * 0.4);
        const hard = total - easy - medium;

        stats.easy = easy;
        stats.medium = medium;
        stats.hard = hard;
        stats.total = total;
      }
    }

    const dailyStats = Array.from(dailyStatsMap.values());

    // Calculate totals
    const totals = dailyStats.reduce(
      (acc, day) => ({
        easy: acc.easy + day.easy,
        medium: acc.medium + day.medium,
        hard: acc.hard + day.hard,
        total: acc.total + day.total,
      }),
      { easy: 0, medium: 0, hard: 0, total: 0 }
    );

    // Find best day
    const bestDay = dailyStats.reduce(
      (max, day) => (day.total > max.total ? day : max),
      dailyStats[0] || { date: '', total: 0 }
    );

    // Calculate current active streak from daily stats
    let activeStreak = 0;
    for (let i = dailyStats.length - 1; i >= 0; i--) {
      if (dailyStats[i].total > 0) {
        activeStreak++;
      } else {
        break;
      }
    }

    // Calculate average per day
    const avgPerDay = dailyStats.length > 0
      ? (totals.total / dailyStats.length).toFixed(1)
      : '0';

    return NextResponse.json({
      dailyStats,
      totals,
      bestDay,
      activeStreak,
      avgPerDay,
      streakCount: user?.streakCount || 0,
      totalProblemsSolved: user?.problemsSolved || 0,
      streakLogs: streakLogs.map(log => ({
        date: log.date.toISOString().split('T')[0],
        roomId: log.roomId,
      })),
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
