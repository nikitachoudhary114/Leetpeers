import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getRoomDailyStatus } from '@/lib/services/streak-service';
import prisma from '@/lib/prisma';

/**
 * GET - Get daily progress status for a room
 * Shows all members' progress towards daily target
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Verify user is a member of this room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        players: {
          where: { id: session.user.id },
          select: { id: true },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.players.length === 0) {
      return NextResponse.json(
        { error: 'You are not a member of this room' },
        { status: 403 }
      );
    }

    // Get the daily status
    const status = await getRoomDailyStatus(roomId);

    if (!status) {
      return NextResponse.json(
        { error: 'Failed to get room status' },
        { status: 500 }
      );
    }

    // Get user's timezone for display
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true },
    });

    // Calculate time remaining until midnight in user's timezone
    const userTimezone = user?.timezone || 'UTC';
    let timeRemaining = '';
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: userTimezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      const [hours, minutes] = formatter.format(now).split(':').map(Number);
      const hoursLeft = 23 - hours;
      const minutesLeft = 59 - minutes;
      timeRemaining = `${hoursLeft}h ${minutesLeft}m`;
    } catch {
      timeRemaining = 'Unknown';
    }

    return NextResponse.json({
      success: true,
      roomId,
      roomStreak: status.roomStreak,
      dailyTarget: status.dailyTarget,
      timeRemaining,
      userTimezone,
      members: status.members,
    });
  } catch (error) {
    console.error('Get room daily status error:', error);
    return NextResponse.json(
      { error: 'Failed to get room daily status' },
      { status: 500 }
    );
  }
}
