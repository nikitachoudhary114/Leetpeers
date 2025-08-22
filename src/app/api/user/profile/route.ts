import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        leetcodeProfile: true,
        bio: true,
        avatarUrl: true,
        githubProfile: true,
        linkedinProfile: true,
        country: true,
        streakCount: true,
        problemsSolved: true,
        createdAt: true,
        rooms: {
          select: {
            id: true,
            name: true,
            code: true,
            createdAt: true,
            ownerId: true,
          },
        },
        ownedRooms: {
          select: {
            id: true,
            name: true,
            code: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const filteredRooms = user.rooms.filter((room) => room.ownerId !== userId);

    return NextResponse.json({
      ...user,
      rooms: filteredRooms,
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
