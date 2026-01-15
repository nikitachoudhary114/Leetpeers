import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  dailyTarget: z.number().min(1, "Target must be at least 1"),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id: roomId } = await params;
    const { dailyTarget } = schema.parse(await req.json());

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    if (room.ownerId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this room" },
        { status: 403 }
      );
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { dailyTarget },
    });

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
