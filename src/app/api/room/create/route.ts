import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const runtime = "nodejs"; 
export async function POST(req: NextRequest) {
  try {
    
     const session = await getServerSession({ req, ...authOptions });

     if (!session || !session.user?.id) {
       return NextResponse.json(
         { error: "Not authenticated" },
         { status: 401 }
       );
     }

     const userId = session.user.id;

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    const code = uuidv4().slice(0, 6).toUpperCase(); 
    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        code,
        ownerId: userId,
        players: { connect: { id: userId } },
      },
      include: {
        players: {
          select: { id: true, username: true, avatarUrl: true },
        },
        owner: {
          select: { id: true, username: true },
        },
      },
    });

    return NextResponse.json(room);
  } catch (err: any) {
    console.error("Create room error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
