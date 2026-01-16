import cron from "node-cron";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { fetchLeetCodeStats } from "@/lib/leetcode";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to get start of day for date comparisons
function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

// Calculate problems solved today based on delta from last check
async function calculateTodaySolved(
  userId: string,
  currentTotal: number
): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastTotalSolved: true },
  });

  if (user?.lastTotalSolved === null || user?.lastTotalSolved === undefined) {
    // First time - can't calculate delta, assume 0 for today
    return 0;
  }

  const delta = currentTotal - user.lastTotalSolved;
  return Math.max(0, delta); // Ensure non-negative
}

// Update streak based on daily target completion
async function updateStreak(
  userId: string,
  roomId: string,
  metTarget: boolean,
  today: Date
): Promise<void> {
  const todayStart = getStartOfDay(today);

  // Check if already logged for today
  const existingLog = await prisma.streakLog.findUnique({
    where: {
      userId_roomId_date: {
        userId,
        roomId,
        date: todayStart,
      },
    },
  });

  if (metTarget && !existingLog) {
    // Met target and not logged - increment streak
    await prisma.$transaction([
      // Create streak log entry
      prisma.streakLog.create({
        data: {
          userId,
          roomId,
          date: todayStart,
        },
      }),
      // Increment user streak
      prisma.user.update({
        where: { id: userId },
        data: { streakCount: { increment: 1 } },
      }),
      // Increment room streak (if all members met target)
      // This is simplified - full implementation would check all members
    ]);
  } else if (!metTarget) {
    // Didn't meet target - check if streak should reset
    // Reset if no log for yesterday
    const yesterday = new Date(todayStart);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayLog = await prisma.streakLog.findUnique({
      where: {
        userId_roomId_date: {
          userId,
          roomId,
          date: yesterday,
        },
      },
    });

    if (!yesterdayLog) {
      // No activity yesterday and no activity today - reset streak
      await prisma.user.update({
        where: { id: userId },
        data: { streakCount: 0 },
      });
    }
  }
}

// Main daily check function - can be called manually or via cron
export async function runDailyStreakCheck(): Promise<{
  processed: number;
  errors: string[];
}> {
  console.log("Running daily streak check...");
  const errors: string[] = [];
  let processed = 0;

  try {
    const users = await prisma.user.findMany({
      where: {
        leetcodeProfile: { not: null },
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

    const today = new Date();

    for (const user of users) {
      if (!user.leetcodeProfile) continue;

      try {
        // Fetch current LeetCode stats
        const stats = await fetchLeetCodeStats(user.leetcodeProfile);

        if (!stats?.submitStats?.acSubmissionNum) {
          errors.push(`No stats for user ${user.id}`);
          continue;
        }

        const allSubmissions = stats.submitStats.acSubmissionNum.find(
          (x: { difficulty: string }) => x.difficulty === "All"
        );
        const currentTotal = allSubmissions?.count || 0;

        // Calculate today's solved count
        const solvedToday = await calculateTodaySolved(user.id, currentTotal);

        // Update user's last total for next day's delta calculation
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastTotalSolved: currentTotal,
            problemsSolved: currentTotal,
          },
        });

        // Check each room the user is in
        for (const room of user.rooms) {
          const metTarget = solvedToday >= room.dailyTarget;

          // Update streak
          await updateStreak(user.id, room.id, metTarget, today);

          // Send notification if target not met
          if (!metTarget && user.email && process.env.EMAIL_USER) {
            try {
              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Daily Target Alert - ${room.name || 'Study Room'}`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">LeetPeers Daily Update</h2>
                    <p>Hi ${user.name || user.username || 'there'},</p>
                    <p>You've solved <strong>${solvedToday}</strong> problems today, but your daily target in <strong>${room.name || 'your study room'}</strong> is <strong>${room.dailyTarget}</strong>.</p>
                    <p>Keep pushing! Every problem counts towards your goal.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                      Your current streak: ${user.streakCount} days
                    </p>
                    <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;">
                      Go to Dashboard
                    </a>
                  </div>
                `,
              });
            } catch (emailError) {
              console.error('Email send error:', emailError);
            }
          }
        }

        processed++;
      } catch (userError) {
        const errorMsg = userError instanceof Error ? userError.message : 'Unknown error';
        errors.push(`User ${user.id}: ${errorMsg}`);
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Global error: ${errorMsg}`);
  }

  console.log(`Daily check complete. Processed: ${processed}, Errors: ${errors.length}`);
  return { processed, errors };
}

// Schedule daily check at 9 PM (21:00)
// This runs in the server process
if (typeof window === 'undefined') {
  cron.schedule("0 21 * * *", async () => {
    console.log("Cron job triggered at 9 PM");
    await runDailyStreakCheck();
  });

  // Also run at midnight to finalize the day
  cron.schedule("0 0 * * *", async () => {
    console.log("Midnight cron job triggered");
    await runDailyStreakCheck();
  });
}
