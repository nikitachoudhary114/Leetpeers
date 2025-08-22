import { NextRequest, NextResponse } from "next/server";
import{ prisma} from "@/lib/prisma"; 

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
     const userId = req.headers.get("x-user-id");
     if (!userId) {
       return NextResponse.json(
         { error: "Not authenticated" },
         { status: 401 }
       );
     }

    const roomId = params.id;

    // Check if room exists and is owned by the user
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, ownerId: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete room
    await prisma.room.delete({ where: { id: roomId } });

    return NextResponse.json({ success: true, message: "Room deleted" });
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        players: true, // fetch players as well
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}