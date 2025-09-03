import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
      const session = await getServerSession({ req, ...authOptions });
     
         if (!session || !session.user?.id) {
           return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
         }
     
         const userId = session.user.id;
    const { code } = await req.json();

    // Check if user is already in the room
    const existingRoom = await prisma.room.findUnique({
      where: { code },
      include: { players: { where: { id: userId } } },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (existingRoom.players.length > 0) {
      return NextResponse.json({ error: "User already joined" }, { status: 400 });
    }

    const room = await prisma.room.update({
      where: { code },
      data: {
      players: { connect: { id: userId } },
      },
      include: { players: true },
    });

    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
