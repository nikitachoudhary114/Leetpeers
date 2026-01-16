import { NextRequest, NextResponse } from 'next/server';
import { send20HourReminders } from '@/lib/services/notification-service';

/**
 * Cron endpoint to send 20-hour reminders
 * Should be called every hour to catch users in different timezones
 * at their local 8 PM (4 hours before midnight)
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

  console.log('[Cron] Starting 20-hour reminders...');

  try {
    const result = await send20HourReminders();

    console.log(`[Cron] 20-hour reminders complete. Sent: ${result.sent}, Skipped: ${result.skipped}, Errors: ${result.errors.length}`);

    return NextResponse.json({
      success: true,
      message: '20-hour reminders processed',
      sent: result.sent,
      skipped: result.skipped,
      errors: result.errors.length,
      errorDetails: process.env.NODE_ENV === 'development' ? result.errors : undefined,
    });
  } catch (error) {
    console.error('[Cron] 20-hour reminders failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
