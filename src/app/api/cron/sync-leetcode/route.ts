import { NextRequest, NextResponse } from 'next/server';
import { syncAllUsers } from '@/lib/services/leetcode-service';

/**
 * Cron endpoint to sync LeetCode stats for all verified users
 * Should be called every 6 hours
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

  console.log('[Cron] Starting LeetCode sync for all users...');

  try {
    const result = await syncAllUsers();

    console.log(`[Cron] LeetCode sync complete. Processed: ${result.processed}, Errors: ${result.errors.length}`);

    return NextResponse.json({
      success: true,
      message: 'LeetCode sync completed',
      processed: result.processed,
      errors: result.errors.length,
      errorDetails: process.env.NODE_ENV === 'development' ? result.errors : undefined,
    });
  } catch (error) {
    console.error('[Cron] LeetCode sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
