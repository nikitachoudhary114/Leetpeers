import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { getStartOfDayInTimezone } from './leetcode-service';

// ============================================================================
// IN-APP NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  // Streak & Progress
  | 'reminder_20h'
  | 'reminder_2h'
  | 'target_met'
  | 'streak_milestone'
  | 'streak_lost'
  | 'streak_at_risk'
  // Room
  | 'room_streak'
  | 'room_streak_milestone'
  | 'room_streak_lost'
  | 'member_joined'
  | 'member_left'
  | 'room_target_changed'
  | 'kicked_from_room'
  // Leaderboard
  | 'leaderboard_top3'
  | 'leaderboard_overtaken'
  | 'most_problems_today'
  // LeetCode Sync
  | 'sync_success'
  | 'sync_failed'
  | 'leetcode_unverified'
  | 'new_problems_detected'
  // Engagement
  | 'inactive_reminder'
  | 'weekly_summary'
  | 'first_problem'
  | 'comeback'
  // System
  | 'welcome'
  | 'profile_incomplete'
  | 'timezone_reminder';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  roomId?: string;
  roomName?: string;
  link?: string;
}

// ============================================================================
// IN-APP NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Create an in-app notification
 */
export async function createNotification(params: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      roomId: params.roomId,
      roomName: params.roomName,
      link: params.link,
    },
  });
}

/**
 * Create notifications for multiple users (bulk)
 */
export async function createBulkNotifications(
  notifications: CreateNotificationParams[]
) {
  return prisma.notification.createMany({
    data: notifications.map((n) => ({
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      roomId: n.roomId,
      roomName: n.roomName,
      link: n.link,
    })),
  });
}

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  options: { limit?: number; offset?: number; unreadOnly?: boolean } = {}
) {
  const { limit = 20, offset = 0, unreadOnly = false } = options;

  const where = {
    userId,
    ...(unreadOnly ? { isRead: false } : {}),
  };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  return { notifications, unreadCount };
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(
  userId: string,
  notificationIds: string[]
) {
  return prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId, // Ensure user owns these notifications
    },
    data: { isRead: true },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

/**
 * Delete a notification
 */
export async function deleteNotification(userId: string, notificationId: string) {
  return prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId, // Ensure user owns this notification
    },
  });
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

// ============================================================================
// NOTIFICATION TEMPLATE HELPERS
// ============================================================================

export const NotificationTemplates = {
  // Streak & Progress
  reminder20h: (roomName: string, remaining: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'reminder_20h',
    title: '⏰ 4 Hours Left!',
    message: `You need ${remaining} more problem${remaining > 1 ? 's' : ''} in ${roomName} to keep your streak alive!`,
    roomName,
  }),

  reminder2h: (roomName: string, remaining: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'reminder_2h',
    title: '🚨 Last Chance!',
    message: `Only 2 hours left! Solve ${remaining} problem${remaining > 1 ? 's' : ''} in ${roomName} before midnight.`,
    roomName,
  }),

  targetMet: (roomName: string, streakCount: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'target_met',
    title: '🎯 Target Complete!',
    message: `You've hit today's target in ${roomName}! Your streak is now ${streakCount} days.`,
    roomName,
  }),

  streakMilestone: (roomName: string, days: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'streak_milestone',
    title: `🔥 ${days}-Day Streak!`,
    message: `Incredible! You've maintained a ${days}-day streak in ${roomName}!`,
    roomName,
  }),

  streakLost: (roomName: string, previousStreak: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'streak_lost',
    title: '💔 Streak Ended',
    message: `Your ${previousStreak}-day streak in ${roomName} has ended. Don't give up - start fresh today!`,
    roomName,
  }),

  streakAtRisk: (roomName: string, currentStreak: number, remaining: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'streak_at_risk',
    title: '⚠️ Streak at Risk!',
    message: `Your ${currentStreak}-day streak in ${roomName} is about to break! ${remaining} problem${remaining > 1 ? 's' : ''} to go.`,
    roomName,
  }),

  // Room
  memberJoined: (roomName: string, memberName: string): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'member_joined',
    title: '👋 New Member!',
    message: `${memberName} joined ${roomName}. Welcome them!`,
    roomName,
  }),

  memberLeft: (roomName: string, memberName: string): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'member_left',
    title: '👋 Member Left',
    message: `${memberName} left ${roomName}.`,
    roomName,
  }),

  roomTargetChanged: (roomName: string, oldTarget: number, newTarget: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'room_target_changed',
    title: '📊 Target Updated',
    message: `${roomName}'s daily target changed from ${oldTarget} to ${newTarget} problems.`,
    roomName,
  }),

  kickedFromRoom: (roomName: string): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'kicked_from_room',
    title: '🚫 Removed from Room',
    message: `You've been removed from ${roomName} by the room leader.`,
    roomName,
  }),

  // Leaderboard
  leaderboardTop3: (roomName: string, rank: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'leaderboard_top3',
    title: '🥇 Top Performer!',
    message: `You're now #${rank} on ${roomName}'s leaderboard!`,
    roomName,
  }),

  leaderboardOvertaken: (roomName: string, memberName: string, newRank: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'leaderboard_overtaken',
    title: '📈 Rank Change',
    message: `${memberName} just passed you on ${roomName}'s leaderboard. You're now #${newRank}.`,
    roomName,
  }),

  mostProblemsToday: (roomName: string, count: number): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'most_problems_today',
    title: '⭐ Top Solver!',
    message: `You solved the most problems in ${roomName} today! (${count} problems)`,
    roomName,
  }),

  // LeetCode Sync
  syncSuccess: (totalSolved: number): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'sync_success',
    title: '✅ Sync Complete',
    message: `LeetCode stats updated! You've solved ${totalSolved} problems total.`,
  }),

  syncFailed: (): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'sync_failed',
    title: '❌ Sync Failed',
    message: "Couldn't sync your LeetCode stats. Please try again later.",
  }),

  newProblemsDetected: (newCount: number): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'new_problems_detected',
    title: '🆕 Progress Detected!',
    message: `Nice! You solved ${newCount} new problem${newCount > 1 ? 's' : ''} since last sync.`,
  }),

  // Engagement
  inactiveReminder: (): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'inactive_reminder',
    title: '👀 We Miss You!',
    message: "You haven't solved any problems in 2 days. Jump back in!",
  }),

  weeklySummary: (weekSolved: number, activeDays: number): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'weekly_summary',
    title: '📊 Weekly Recap',
    message: `This week: ${weekSolved} problems, ${activeDays} active days. Keep going!`,
  }),

  firstProblem: (roomName: string): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'first_problem',
    title: '🎉 First Problem!',
    message: `You solved your first problem in ${roomName}! The journey begins.`,
    roomName,
  }),

  comeback: (roomName: string): Omit<CreateNotificationParams, 'userId' | 'roomId'> => ({
    type: 'comeback',
    title: '🙌 Welcome Back!',
    message: `Great to see you again! Your streak in ${roomName} is ready to restart.`,
    roomName,
  }),

  // System
  welcome: (): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'welcome',
    title: '👋 Welcome to LeetPeers!',
    message: 'Start by joining a room or creating your own study group.',
    link: '/rooms',
  }),

  profileIncomplete: (): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'profile_incomplete',
    title: '📝 Complete Profile',
    message: 'Add your LeetCode username to start tracking progress.',
    link: '/profile',
  }),

  timezoneReminder: (): Omit<CreateNotificationParams, 'userId'> => ({
    type: 'timezone_reminder',
    title: '🌍 Set Your Timezone',
    message: 'Set your timezone for accurate daily target tracking.',
    link: '/profile',
  }),
};

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const APP_URL = process.env.NEXTAUTH_URL || 'https://leetpeers.com';

/**
 * Get the room leader's info for sending emails
 */
async function getRoomLeader(roomId: string): Promise<{
  name: string;
  email: string;
} | null> {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      owner: {
        select: {
          name: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!room?.owner) return null;

  return {
    name: room.owner.name || room.owner.username || 'Room Leader',
    email: room.owner.email,
  };
}

/**
 * Format the "from" field to show room leader's name
 */
function formatFromField(leaderName: string): string {
  return `${leaderName} (LeetPeers) <${process.env.EMAIL_USER}>`;
}

/**
 * Get the current hour in a user's timezone
 */
export function getCurrentHourInTimezone(timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    return parseInt(formatter.format(new Date()), 10);
  } catch {
    // Fallback to UTC
    return new Date().getUTCHours();
  }
}

/**
 * Check if a notification was already sent today
 */
async function wasNotificationSentToday(
  userId: string,
  roomId: string | null,
  type: string,
  timezone: string
): Promise<boolean> {
  const today = getStartOfDayInTimezone(new Date(), timezone);

  const existing = await prisma.notificationLog.findFirst({
    where: {
      userId,
      roomId,
      type,
      date: today,
    },
  });

  return !!existing;
}

/**
 * Log a notification as sent
 */
async function logNotificationSent(
  userId: string,
  roomId: string | null,
  type: string,
  timezone: string
): Promise<void> {
  const today = getStartOfDayInTimezone(new Date(), timezone);

  await prisma.notificationLog.create({
    data: {
      userId,
      roomId,
      type,
      date: today,
    },
  });
}

/**
 * Send a 20-hour reminder email (4 hours before midnight)
 */
export async function send20HourReminder(
  user: { id: string; email: string; name: string | null; username: string | null; timezone: string },
  room: { id: string; name: string | null; dailyTarget: number },
  solvedSoFar: number
): Promise<boolean> {
  // Check if already sent today
  const alreadySent = await wasNotificationSentToday(
    user.id,
    room.id,
    'reminder_20h',
    user.timezone
  );

  if (alreadySent) {
    return false;
  }

  const remaining = room.dailyTarget - solvedSoFar;
  if (remaining <= 0) {
    // Already met target, no need to remind
    return false;
  }

  const displayName = user.name || user.username || 'there';
  const roomName = room.name || 'your study room';

  // Get room leader info for the "From" field
  const leader = await getRoomLeader(room.id);
  const fromField = leader ? formatFromField(leader.name) : `LeetPeers <${process.env.EMAIL_USER}>`;

  try {
    if (!process.env.EMAIL_USER) {
      console.log(`[DRY RUN] Would send 20h reminder to ${user.email} for room ${roomName}`);
      await logNotificationSent(user.id, room.id, 'reminder_20h', user.timezone);
      return true;
    }

    await transporter.sendMail({
      from: fromField,
      replyTo: leader?.email, // Reply goes to room leader
      to: user.email,
      subject: `4 Hours Left! Complete your daily target - ${roomName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Time's Running Out!</h1>
          </div>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Hi ${displayName},
          </p>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            You have <strong>4 hours left</strong> to complete your daily target in <strong>${roomName}</strong>!
          </p>

          <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 16px; color: #92400e;">
              <strong>Progress:</strong> ${solvedSoFar}/${room.dailyTarget} problems solved
            </p>
            <p style="margin: 8px 0 0 0; font-size: 16px; color: #92400e;">
              <strong>Remaining:</strong> ${remaining} more problem${remaining > 1 ? 's' : ''} to go!
            </p>
          </div>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Don't let your streak break! Every problem counts towards your consistency.
          </p>

          <a href="${APP_URL}/rooms/${room.id}"
             style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px;">
            Go to Room
          </a>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">
            You're receiving this because you're a member of ${roomName} on LeetPeers.
            <br />
            <a href="${APP_URL}/profile" style="color: #6366f1;">Manage notification settings</a>
          </p>
        </div>
      `,
    });

    await logNotificationSent(user.id, room.id, 'reminder_20h', user.timezone);
    return true;
  } catch (error) {
    console.error(`Failed to send 20h reminder to ${user.email}:`, error);
    return false;
  }
}

/**
 * Send daily summary email
 */
export async function sendDailySummary(
  user: { id: string; email: string; name: string | null; username: string | null; timezone: string },
  results: Array<{
    roomName: string;
    roomId: string;
    target: number;
    solved: number;
    metTarget: boolean;
    newStreakCount: number;
  }>
): Promise<boolean> {
  const alreadySent = await wasNotificationSentToday(
    user.id,
    null,
    'daily_summary',
    user.timezone
  );

  if (alreadySent) {
    return false;
  }

  const displayName = user.name || user.username || 'there';

  const roomResults = results
    .map(
      (r) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${r.roomName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${r.solved}/${r.target}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${r.metTarget ? '&#10004;' : '&#10008;'}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${r.newStreakCount} days</td>
      </tr>
    `
    )
    .join('');

  const allMet = results.every((r) => r.metTarget);
  const totalSolved = results.reduce((sum, r) => sum + r.solved, 0);

  try {
    if (!process.env.EMAIL_USER) {
      console.log(`[DRY RUN] Would send daily summary to ${user.email}`);
      await logNotificationSent(user.id, null, 'daily_summary', user.timezone);
      return true;
    }

    await transporter.sendMail({
      from: `LeetPeers <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: allMet
        ? `Great job! You completed all your targets today`
        : `Daily Summary - Keep pushing!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, ${allMet ? '#10b981' : '#6366f1'} 0%, ${allMet ? '#059669' : '#8b5cf6'} 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              ${allMet ? 'Excellent Work!' : 'Daily Summary'}
            </h1>
          </div>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Hi ${displayName},
          </p>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Here's your LeetCode progress summary for today. You solved <strong>${totalSolved} problems</strong> in total.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Room</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Progress</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Target</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Streak</th>
              </tr>
            </thead>
            <tbody>
              ${roomResults}
            </tbody>
          </table>

          <a href="${APP_URL}/dashboard"
             style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px;">
            View Dashboard
          </a>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">
            You're receiving this daily summary from LeetPeers.
            <br />
            <a href="${APP_URL}/profile" style="color: #6366f1;">Manage notification settings</a>
          </p>
        </div>
      `,
    });

    await logNotificationSent(user.id, null, 'daily_summary', user.timezone);
    return true;
  } catch (error) {
    console.error(`Failed to send daily summary to ${user.email}:`, error);
    return false;
  }
}

/**
 * Send streak lost notification
 */
export async function sendStreakLostNotification(
  user: { id: string; email: string; name: string | null; username: string | null; timezone: string },
  room: { id: string; name: string | null },
  previousStreak: number
): Promise<boolean> {
  if (previousStreak <= 1) {
    // Don't notify for very short streaks
    return false;
  }

  const alreadySent = await wasNotificationSentToday(
    user.id,
    room.id,
    'streak_lost',
    user.timezone
  );

  if (alreadySent) {
    return false;
  }

  const displayName = user.name || user.username || 'there';
  const roomName = room.name || 'your study room';

  // Get room leader info for the "From" field
  const leader = await getRoomLeader(room.id);
  const fromField = leader ? formatFromField(leader.name) : `LeetPeers <${process.env.EMAIL_USER}>`;

  try {
    if (!process.env.EMAIL_USER) {
      console.log(`[DRY RUN] Would send streak lost notification to ${user.email}`);
      await logNotificationSent(user.id, room.id, 'streak_lost', user.timezone);
      return true;
    }

    await transporter.sendMail({
      from: fromField,
      replyTo: leader?.email,
      to: user.email,
      subject: `Your ${previousStreak}-day streak ended - Let's start fresh!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Streak Ended</h1>
          </div>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Hi ${displayName},
          </p>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Your <strong>${previousStreak}-day streak</strong> in <strong>${roomName}</strong> has ended.
          </p>

          <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 16px; color: #92400e;">
              Don't be discouraged! Consistency is a journey, not a destination.
              Start a new streak today and beat your personal best!
            </p>
          </div>

          <a href="${APP_URL}/rooms/${room.id}"
             style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px;">
            Start New Streak
          </a>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">
            You're receiving this because you're a member of ${roomName} on LeetPeers.
            <br />
            <a href="${APP_URL}/profile" style="color: #6366f1;">Manage notification settings</a>
          </p>
        </div>
      `,
    });

    await logNotificationSent(user.id, room.id, 'streak_lost', user.timezone);
    return true;
  } catch (error) {
    console.error(`Failed to send streak lost notification to ${user.email}:`, error);
    return false;
  }
}

/**
 * Send 20-hour reminders to all eligible users
 * This should be called every hour from a cron job
 */
export async function send20HourReminders(): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
}> {
  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    // Get all users with verified LeetCode
    const users = await prisma.user.findMany({
      where: {
        leetcodeProfile: { not: null },
        leetcodeVerified: true,
      },
      include: {
        rooms: {
          select: {
            id: true,
            name: true,
            dailyTarget: true,
          },
        },
      },
    });

    for (const user of users) {
      // Check if it's 8 PM (20:00) in user's timezone
      const currentHour = getCurrentHourInTimezone(user.timezone || 'UTC');
      if (currentHour !== 20) {
        continue;
      }

      // Process each room
      for (const room of user.rooms) {
        try {
          // Get today's progress for this room
          const today = getStartOfDayInTimezone(new Date(), user.timezone || 'UTC');
          const streakLog = await prisma.streakLog.findUnique({
            where: {
              userId_roomId_date: {
                userId: user.id,
                roomId: room.id,
                date: today,
              },
            },
          });

          const solvedToday = streakLog?.problemsSolved || 0;

          // Only send if they haven't met the target
          if (solvedToday < room.dailyTarget) {
            const success = await send20HourReminder(
              {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                timezone: user.timezone || 'UTC',
              },
              room,
              solvedToday
            );

            if (success) {
              sent++;
            } else {
              skipped++;
            }
          } else {
            skipped++;
          }
        } catch (roomError) {
          errors.push(
            `User ${user.id} Room ${room.id}: ${roomError instanceof Error ? roomError.message : 'Unknown'}`
          );
        }
      }
    }
  } catch (error) {
    errors.push(`Global error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  console.log(`20-hour reminders: Sent ${sent}, Skipped ${skipped}, Errors: ${errors.length}`);
  return { sent, skipped, errors };
}
