import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { syncUserProgress } from '@/lib/services/leetcode-service';
import { getUserAllRoomStreaks } from '@/lib/services/streak-service';
import prisma from '@/lib/prisma';

/**
 * POST - Manual sync of current user's LeetCode stats
 * Updates problemsSolved, lastTotalSolved, and DailyProgress
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user has a LeetCode profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        leetcodeProfile: true,
        leetcodeVerified: true,
      },
    });

    if (!user?.leetcodeProfile) {
      return NextResponse.json(
        { error: 'No LeetCode profile connected. Please add your LeetCode username in your profile.' },
        { status: 400 }
      );
    }

    if (!user.leetcodeVerified) {
      return NextResponse.json(
        { error: 'LeetCode profile not verified. Please verify your account first.' },
        { status: 400 }
      );
    }

    // Sync the user's progress
    const result = await syncUserProgress(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to sync LeetCode stats' },
        { status: 500 }
      );
    }

    // Get updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        problemsSolved: true,
        streakCount: true,
        lastTotalSolved: true,
      },
    });

    // Get per-room streaks
    const roomStreaks = await getUserAllRoomStreaks(userId);

    return NextResponse.json({
      success: true,
      message: 'LeetCode stats synced successfully',
      stats: result.stats,
      todaySolved: result.todaySolved,
      user: updatedUser,
      roomStreaks,
    });
  } catch (error) {
    console.error('Sync LeetCode error:', error);
    return NextResponse.json(
      { error: 'Failed to sync LeetCode stats' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get current sync status and LeetCode stats
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user with their LeetCode data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        leetcodeProfile: true,
        leetcodeVerified: true,
        problemsSolved: true,
        streakCount: true,
        lastTotalSolved: true,
        timezone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the latest DailyProgress entry
    const latestProgress = await prisma.dailyProgress.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    // Get per-room streaks
    const roomStreaks = await getUserAllRoomStreaks(userId);

    return NextResponse.json({
      success: true,
      leetcodeProfile: user.leetcodeProfile,
      leetcodeVerified: user.leetcodeVerified,
      problemsSolved: user.problemsSolved,
      streakCount: user.streakCount,
      timezone: user.timezone,
      latestProgress: latestProgress
        ? {
            date: latestProgress.date,
            totalSolved: latestProgress.totalSolved,
            easyCount: latestProgress.easyCount,
            mediumCount: latestProgress.mediumCount,
            hardCount: latestProgress.hardCount,
          }
        : null,
      roomStreaks,
    });
  } catch (error) {
    console.error('Get sync status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
