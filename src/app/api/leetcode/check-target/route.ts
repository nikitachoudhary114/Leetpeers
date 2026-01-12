// app/api/leetcode/check/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchLeetCodeStats, getTodaySolvedCount } from "@/lib/leetcode";



export async function GET() {
  try {
    // Fetch all users with their joined rooms
    const users = await prisma.user.findMany({
      where: { leetcodeProfile: { not: null } },
      include: { rooms: true },
    });

    const results: any[] = [];

    for (const user of users) {
      try {
        const stats = await fetchLeetCodeStats(user.leetcodeProfile!);
        const totalSolved = getTodaySolvedCount(stats);

        // Update user's problemsSolved
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { problemsSolved: totalSolved },
        });

        for (const room of user.rooms) {
          // Example: assume each room has a target (hardcode 2 for now)
          const dailyTarget = 2;

          if (totalSolved >= dailyTarget) {
            await prisma.user.update({
              where: { id: user.id },
              data: { streakCount: { increment: 1 } },
            });
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: { streakCount: 0 },
            });
          }

          results.push({
            user: user.username,
            room: room.name,
            totalSolved,
            streak: updatedUser.streakCount,
            target: dailyTarget,
          });
        }
      } catch (e) {
        console.error(`Failed for user ${user.username}:`, e);
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