import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id"); // ✅ from middleware
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    // Check if user is actually in the room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: { select: { id: true } } },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const isPlayer = room.players.some((p) => p.id === userId);
    if (!isPlayer) {
      return NextResponse.json(
        { error: "You are not part of this room" },
        { status: 400 }
      );
    }

    // Disconnect user
    await prisma.room.update({
      where: { id: roomId },
      data: {
        players: {
          disconnect: { id: userId },
        },
      },
    });

    // Optionally: if no players left, delete room
    const updatedRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true },
    });

    if (updatedRoom && updatedRoom.players.length === 0) {
      await prisma.room.delete({ where: { id: roomId } });
    }

    return NextResponse.json({ message: "Left room successfully" });
  } catch (err: any) {
    console.error("Leave room error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
