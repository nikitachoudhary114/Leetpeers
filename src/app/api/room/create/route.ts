import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // ✅ force Node.js runtime for prisma + JWT

export async function POST(req: NextRequest) {
  try {
    // ✅ middleware sets x-user-id header
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const code = uuidv4().slice(0, 6);

    const room = await prisma.room.create({
      data: {
        code,
        ownerId: userId,
        players: { connect: { id: userId } },
      },
      include: { players: true, owner: true },
    });

    return NextResponse.json(room);
  } catch (err: any) {
    console.error("Create room error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
