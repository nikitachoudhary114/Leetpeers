import prisma from '@/lib/prisma';
import { getStartOfDayInTimezone, fetchUserStats, syncUserProgress } from './leetcode-service';
import { createNotification, NotificationTemplates } from './notification-service';

const STREAK_MILESTONES = [7, 14, 30, 50, 100];

/**
 * Get the start of day for a date in UTC
 */
function getStartOfDayUTC(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if a date is yesterday relative to another date
 */
function isYesterday(date1: Date, date2: Date): boolean {
  const d1 = getStartOfDayUTC(date1);
  const d2 = getStartOfDayUTC(date2);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

/**
 * Update a user's streak for a specific room
 */
export async function updateUserRoomStreak(
  userId: string,
  roomId: string,
  solvedToday: number,
  dailyTarget: number
): Promise<{
  success: boolean;
  streakCount: number;
  metTarget: boolean;
  error?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { name: true },
    });

    const roomName = room?.name || 'the room';
    const today = getStartOfDayInTimezone(new Date(), user?.timezone || 'UTC');
    const metTarget = solvedToday >= dailyTarget;

    // Check if we already have a StreakLog for today
    const existingLog = await prisma.streakLog.findUnique({
      where: {
        userId_roomId_date: {
          userId,
          roomId,
          date: today,
        },
      },
    });

    if (existingLog) {
      // Already processed today - just return current status
      const userRoomStreak = await prisma.userRoomStreak.findUnique({
        where: {
          userId_roomId: { userId, roomId },
        },
      });
      return {
        success: true,
        streakCount: userRoomStreak?.streakCount || 0,
        metTarget: existingLog.metTarget,
      };
    }

    // Create StreakLog entry
    await prisma.streakLog.create({
      data: {
        userId,
        roomId,
        date: today,
        problemsSolved: solvedToday,
        metTarget,
      },
    });

    // Get or create UserRoomStreak
    let userRoomStreak = await prisma.userRoomStreak.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    if (!userRoomStreak) {
      userRoomStreak = await prisma.userRoomStreak.create({
        data: {
          userId,
          roomId,
          streakCount: 0,
          lastActiveDate: null,
        },
      });
    }

    let newStreakCount = userRoomStreak.streakCount;

    const previousStreak = userRoomStreak.streakCount;

    if (metTarget) {
      // Check if lastActiveDate was yesterday
      if (
        userRoomStreak.lastActiveDate &&
        isYesterday(userRoomStreak.lastActiveDate, today)
      ) {
        // Continue streak
        newStreakCount = userRoomStreak.streakCount + 1;
      } else if (userRoomStreak.streakCount === 0) {
        // Starting new streak
        newStreakCount = 1;
      } else {
        // Gap in activity - reset to 1
        newStreakCount = 1;
      }

      // Update UserRoomStreak
      await prisma.userRoomStreak.update({
        where: { id: userRoomStreak.id },
        data: {
          streakCount: newStreakCount,
          lastActiveDate: today,
        },
      });

      // Send target completion notification
      try {
        const template = NotificationTemplates.targetMet(roomName, newStreakCount);
        await createNotification({
          userId,
          roomId,
          ...template,
          link: `/rooms/${roomId}`,
        });

        // Check for streak milestone
        if (STREAK_MILESTONES.includes(newStreakCount)) {
          const milestoneTemplate = NotificationTemplates.streakMilestone(roomName, newStreakCount);
          await createNotification({
            userId,
            roomId,
            ...milestoneTemplate,
            link: `/rooms/${roomId}`,
          });
        }
      } catch (notifError) {
        console.error('Failed to send streak notification:', notifError);
      }
    } else {
      // Didn't meet target - reset streak to 0
      newStreakCount = 0;
      await prisma.userRoomStreak.update({
        where: { id: userRoomStreak.id },
        data: {
          streakCount: 0,
        },
      });

      // Send streak lost notification if they had a streak
      if (previousStreak > 1) {
        try {
          const template = NotificationTemplates.streakLost(roomName, previousStreak);
          await createNotification({
            userId,
            roomId,
            ...template,
            link: `/rooms/${roomId}`,
          });
        } catch (notifError) {
          console.error('Failed to send streak lost notification:', notifError);
        }
      }
    }

    return {
      success: true,
      streakCount: newStreakCount,
      metTarget,
    };
  } catch (error) {
    console.error(`Failed to update streak for user ${userId} in room ${roomId}:`, error);
    return {
      success: false,
      streakCount: 0,
      metTarget: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if all members in a room met their target for a specific date
 */
export async function checkAllMembersMetTarget(
  roomId: string,
  date: Date
): Promise<boolean> {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      players: {
        select: { id: true },
      },
    },
  });

  if (!room || room.players.length === 0) {
    return false;
  }

  const dateStart = getStartOfDayUTC(date);

  // Get all StreakLogs for this room and date
  const streakLogs = await prisma.streakLog.findMany({
    where: {
      roomId,
      date: dateStart,
    },
  });

  // Check if every player has a StreakLog with metTarget=true
  const memberIds = new Set(room.players.map((p) => p.id));
  const membersWhoMetTarget = new Set(
    streakLogs.filter((log) => log.metTarget).map((log) => log.userId)
  );

  // Every member must have met the target
  for (const memberId of memberIds) {
    if (!membersWhoMetTarget.has(memberId)) {
      return false;
    }
  }

  return true;
}

/**
 * Update a room's streak based on all members' performance
 */
export async function updateRoomStreak(roomId: string): Promise<{
  success: boolean;
  streakCount: number;
  allMembersMetTarget: boolean;
  error?: string;
}> {
  try {
    const today = getStartOfDayUTC(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return {
        success: false,
        streakCount: 0,
        allMembersMetTarget: false,
        error: 'Room not found',
      };
    }

    const allMembersMetTarget = await checkAllMembersMetTarget(roomId, today);

    let newStreakCount = room.streakCount;

    if (allMembersMetTarget) {
      // Check if everyone also met target yesterday
      const yesterdayAllMet = await checkAllMembersMetTarget(roomId, yesterday);

      if (yesterdayAllMet || room.streakCount === 0) {
        // Continue or start streak
        newStreakCount = room.streakCount + 1;
      } else {
        // Gap - reset to 1
        newStreakCount = 1;
      }
    } else {
      // Not everyone met target - reset to 0
      newStreakCount = 0;
    }

    // Update room streak
    await prisma.room.update({
      where: { id: roomId },
      data: { streakCount: newStreakCount },
    });

    return {
      success: true,
      streakCount: newStreakCount,
      allMembersMetTarget,
    };
  } catch (error) {
    console.error(`Failed to update room streak for ${roomId}:`, error);
    return {
      success: false,
      streakCount: 0,
      allMembersMetTarget: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Process end-of-day streak calculations for all users and rooms
 */
export async function runDailyStreakCheck(): Promise<{
  usersProcessed: number;
  roomsProcessed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let usersProcessed = 0;
  let roomsProcessed = 0;

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
            dailyTarget: true,
          },
        },
      },
    });

    // Process each user
    for (const user of users) {
      if (!user.leetcodeProfile) continue;

      try {
        // Sync user's LeetCode progress first
        const syncResult = await syncUserProgress(user.id);

        if (!syncResult.success || !syncResult.stats) {
          errors.push(`User ${user.id}: Failed to sync - ${syncResult.error}`);
          continue;
        }

        const todaySolved = syncResult.todaySolved || 0;

        // Process each room the user is in
        for (const room of user.rooms) {
          const result = await updateUserRoomStreak(
            user.id,
            room.id,
            todaySolved,
            room.dailyTarget
          );

          if (!result.success) {
            errors.push(`User ${user.id} Room ${room.id}: ${result.error}`);
          }
        }

        usersProcessed++;

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (userError) {
        errors.push(
          `User ${user.id}: ${userError instanceof Error ? userError.message : 'Unknown error'}`
        );
      }
    }

    // Update room streaks
    const rooms = await prisma.room.findMany({
      select: { id: true },
    });

    for (const room of rooms) {
      const result = await updateRoomStreak(room.id);
      if (result.success) {
        roomsProcessed++;
      } else {
        errors.push(`Room ${room.id}: ${result.error}`);
      }
    }
  } catch (error) {
    errors.push(`Global error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  console.log(
    `Daily check complete. Users: ${usersProcessed}, Rooms: ${roomsProcessed}, Errors: ${errors.length}`
  );

  return { usersProcessed, roomsProcessed, errors };
}

/**
 * Get a user's streak information for a specific room
 */
export async function getUserRoomStreakInfo(
  userId: string,
  roomId: string
): Promise<{
  streakCount: number;
  lastActiveDate: Date | null;
  todayMetTarget: boolean;
  todayProblemsSolved: number;
} | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    const userRoomStreak = await prisma.userRoomStreak.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    const today = getStartOfDayInTimezone(new Date(), user?.timezone || 'UTC');

    const todayLog = await prisma.streakLog.findUnique({
      where: {
        userId_roomId_date: {
          userId,
          roomId,
          date: today,
        },
      },
    });

    return {
      streakCount: userRoomStreak?.streakCount || 0,
      lastActiveDate: userRoomStreak?.lastActiveDate || null,
      todayMetTarget: todayLog?.metTarget || false,
      todayProblemsSolved: todayLog?.problemsSolved || 0,
    };
  } catch (error) {
    console.error(`Failed to get streak info for user ${userId} in room ${roomId}:`, error);
    return null;
  }
}

/**
 * Get all members' daily status for a room
 */
export async function getRoomDailyStatus(roomId: string): Promise<{
  roomStreak: number;
  dailyTarget: number;
  members: Array<{
    userId: string;
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
    todaySolved: number;
    metTarget: boolean;
    userStreak: number;
  }>;
} | null> {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        players: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            timezone: true,
          },
        },
      },
    });

    if (!room) {
      return null;
    }

    const today = getStartOfDayUTC(new Date());

    const members = await Promise.all(
      room.players.map(async (player) => {
        // Get today's streak log
        const playerToday = getStartOfDayInTimezone(new Date(), player.timezone || 'UTC');
        const streakLog = await prisma.streakLog.findUnique({
          where: {
            userId_roomId_date: {
              userId: player.id,
              roomId,
              date: playerToday,
            },
          },
        });

        // Get user's streak in this room
        const userRoomStreak = await prisma.userRoomStreak.findUnique({
          where: {
            userId_roomId: { userId: player.id, roomId },
          },
        });

        return {
          userId: player.id,
          username: player.username,
          name: player.name,
          avatarUrl: player.avatarUrl,
          todaySolved: streakLog?.problemsSolved || 0,
          metTarget: streakLog?.metTarget || false,
          userStreak: userRoomStreak?.streakCount || 0,
        };
      })
    );

    return {
      roomStreak: room.streakCount,
      dailyTarget: room.dailyTarget,
      members,
    };
  } catch (error) {
    console.error(`Failed to get room daily status for ${roomId}:`, error);
    return null;
  }
}

/**
 * Get all per-room streaks for a user
 */
export async function getUserAllRoomStreaks(userId: string): Promise<
  Array<{
    roomId: string;
    roomName: string | null;
    roomCode: string;
    streakCount: number;
    lastActiveDate: Date | null;
  }>
> {
  try {
    const userRoomStreaks = await prisma.userRoomStreak.findMany({
      where: { userId },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return userRoomStreaks.map((streak) => ({
      roomId: streak.room.id,
      roomName: streak.room.name,
      roomCode: streak.room.code,
      streakCount: streak.streakCount,
      lastActiveDate: streak.lastActiveDate,
    }));
  } catch (error) {
    console.error(`Failed to get room streaks for user ${userId}:`, error);
    return [];
  }
}

/**
 * Increment a user's solved count inside a specific room (for in-app submissions)
 */
export async function incrementUserRoomProgress(
  userId: string,
  roomId: string
): Promise<{
  success: boolean;
  problemsSolved: number;
  streakCount: number;
  metTarget: boolean;
  error?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { name: true, dailyTarget: true },
    });

    if (!room) {
      return { success: false, problemsSolved: 0, streakCount: 0, metTarget: false, error: 'Room not found' };
    }

    const roomName = room.name || 'the room';
    const dailyTarget = room.dailyTarget;
    const today = getStartOfDayInTimezone(new Date(), user?.timezone || 'UTC');

    // Get or create today's StreakLog
    const existingLog = await prisma.streakLog.findUnique({
      where: {
        userId_roomId_date: {
          userId,
          roomId,
          date: today,
        },
      },
    });

    let solvedToday = 1;
    let metTargetBefore = false;

    if (existingLog) {
      metTargetBefore = existingLog.metTarget;
      const updatedLog = await prisma.streakLog.update({
        where: { id: existingLog.id },
        data: {
          problemsSolved: { increment: 1 },
        },
      });
      solvedToday = updatedLog.problemsSolved;
    } else {
      const newLog = await prisma.streakLog.create({
        data: {
          userId,
          roomId,
          date: today,
          problemsSolved: 1,
          metTarget: false,
        },
      });
      solvedToday = newLog.problemsSolved;
    }

    const metTarget = solvedToday >= dailyTarget;

    // Get or create UserRoomStreak
    let userRoomStreak = await prisma.userRoomStreak.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    if (!userRoomStreak) {
      userRoomStreak = await prisma.userRoomStreak.create({
        data: {
          userId,
          roomId,
          streakCount: 0,
          lastActiveDate: null,
        },
      });
    }

    let newStreakCount = userRoomStreak.streakCount;

    // If target is met now but was not met before, update streak!
    if (metTarget) {
      // Update StreakLog metTarget status to true
      await prisma.streakLog.update({
        where: {
          userId_roomId_date: {
            userId,
            roomId,
            date: today,
          },
        },
        data: { metTarget: true },
      });

      if (!metTargetBefore) {
        // Calculate new streak count
        if (
          userRoomStreak.lastActiveDate &&
          isYesterday(userRoomStreak.lastActiveDate, today)
        ) {
          newStreakCount = userRoomStreak.streakCount + 1;
        } else if (userRoomStreak.streakCount === 0 || !userRoomStreak.lastActiveDate) {
          newStreakCount = 1;
        } else {
          // Gap in activity - reset to 1
          newStreakCount = 1;
        }

        // Update UserRoomStreak
        await prisma.userRoomStreak.update({
          where: { id: userRoomStreak.id },
          data: {
            streakCount: newStreakCount,
            lastActiveDate: today,
          },
        });

        // Send notifications
        try {
          const template = NotificationTemplates.targetMet(roomName, newStreakCount);
          await createNotification({
            userId,
            roomId,
            ...template,
            link: `/rooms/${roomId}`,
          });

          // Check for streak milestone
          if (STREAK_MILESTONES.includes(newStreakCount)) {
            const milestoneTemplate = NotificationTemplates.streakMilestone(roomName, newStreakCount);
            await createNotification({
              userId,
              roomId,
              ...milestoneTemplate,
              link: `/rooms/${roomId}`,
            });
          }
        } catch (notifError) {
          console.error('Failed to send streak notification:', notifError);
        }
      }
    }

    return {
      success: true,
      problemsSolved: solvedToday,
      streakCount: newStreakCount,
      metTarget,
    };
  } catch (error) {
    console.error(`Failed to increment progress for user ${userId} in room ${roomId}:`, error);
    return {
      success: false,
      problemsSolved: 0,
      streakCount: 0,
      metTarget: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
