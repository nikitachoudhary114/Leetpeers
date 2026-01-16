import { NextRequest, NextResponse } from 'next/server';
import { runDailyStreakCheck } from '@/lib/services/streak-service';

/**
 * Cron endpoint to run daily streak checks
 * Should be called at midnight (UTC) or user's local midnight
 *
 * This endpoint:
 * 1. Syncs LeetCode stats for all verified users
 * 2. Updates individual streak counts per room
 * 3. Updates room streak counts
 *
 * Protected by CRON_SECRET header validation
 */
export async function GET(request: NextRequest) {
  // Validate cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In development, allow without secret
  if (process.env.NODE_ENV === 'production') {
    if (!cronSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  console.log('[Cron] Starting daily streak check...');

  try {
    const result = await runDailyStreakCheck();

    console.log(
      `[Cron] Daily check complete. Users: ${result.usersProcessed}, Rooms: ${result.roomsProcessed}, Errors: ${result.errors.length}`
    );

    return NextResponse.json({
      success: true,
      message: 'Daily streak check completed',
      usersProcessed: result.usersProcessed,
      roomsProcessed: result.roomsProcessed,
      errors: result.errors.length,
      errorDetails: process.env.NODE_ENV === 'development' ? result.errors : undefined,
    });
  } catch (error) {
    console.error('[Cron] Daily check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
