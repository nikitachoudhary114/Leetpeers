import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchLeetCodeStats } from "@/lib/leetcode";


export async function GET() {
  try {
    // Fetch all users with LeetCode profile and joined rooms
    const users = await prisma.user.findMany({
      where: { leetcodeProfile: { not: null } },
      include: { rooms: true },
    });
      console.log(users)

    const results: any[] = [];
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const roomStatus: Record<string, { allPassed: boolean }> = {};

    for (const user of users) {
      try {
        const stats = await fetchLeetCodeStats(user.leetcodeProfile!);
        const currentTotal =
          stats.submitStats.acSubmissionNum.find(
            (x: any) => x.difficulty === "All"
          )?.count || 0;

        // Compute solved problems since last check
        const delta = currentTotal - (user.lastTotalSolved || 0);

        // Update lastTotalSolved in DB
        await prisma.user.update({
          where: { id: user.id },
          data: { lastTotalSolved: currentTotal },
        });

        for (const room of user.rooms) {
          const dailyTarget = room.dailyTarget ?? 2;

          // Already marked today?
          const alreadyMarked = await prisma.streakLog.findFirst({
            where: {
              userId: user.id,
              roomId: room.id,
              date: today,
            },
          });

          if (alreadyMarked) {
            results.push({
              user: user.username,
              room: room.name,
              delta,
              streak: user.streakCount,
              target: dailyTarget,
              status: "already counted",
            });
            continue;
          }

          if (delta >= dailyTarget) {
            // User passed
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { streakCount: { increment: 1 } },
            });

            // Log today’s pass
            await prisma.streakLog.create({
              data: {
                userId: user.id,
                roomId: room.id,
                date: today,
              },
            });

            results.push({
              user: user.username,
              room: room.name,
              delta,
              streak: updatedUser.streakCount,
              target: dailyTarget,
              status: "passed",
            });
          } else {
            // User failed → reset streak
            await prisma.user.update({
              where: { id: user.id },
              data: { streakCount: 0 },
            });

            results.push({
              user: user.username,
              room: room.name,
              delta,
              streak: 0,
              target: dailyTarget,
              status: "failed",
            });

            // Mark room as failed candidate
            roomStatus[room.id] = { allPassed: false };
          }

          // Initialize room status if not set
          if (!(room.id in roomStatus))
            roomStatus[room.id] = { allPassed: true };
          if (delta < dailyTarget) roomStatus[room.id].allPassed = false;
        }
      } catch (e) {
        console.error(`Failed for user ${user.username}:`, e);
      }
    }

    // Process room streaks
    for (const [roomId, status] of Object.entries(roomStatus)) {
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) continue;

      if (status.allPassed) {
        await prisma.room.update({
          where: { id: roomId },
          data: { streakCount: { increment: 1 } },
        });
      } else {
        await prisma.room.update({
          where: { id: roomId },
          data: { streakCount: 0 },
        });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (e) {
    console.error("LeetCode check error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}