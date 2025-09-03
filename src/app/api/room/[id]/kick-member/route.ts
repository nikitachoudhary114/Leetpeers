import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const schema = z.object({
  userIdToKick: z.string(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
     const session = await getServerSession({ req, ...authOptions });
    
        if (!session || !session.user?.id) {
          return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
    
        const userId = session.user.id;
    const roomId = params.id;
    const { userIdToKick } = schema.parse(await req.json());

    // fetch room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true },
    });
    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    // only owner can kick
    if (room.ownerId !== userId) {
      return NextResponse.json(
        { error: "Only owner can kick members" },
        { status: 403 }
      );
    }

    // check if user is in the room
    const isInRoom = room.players.some((p) => p.id === userIdToKick);
    if (!isInRoom)
      return NextResponse.json({ error: "User not in room" }, { status: 400 });

    // remove user from players
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        players: {
          disconnect: { id: userIdToKick },
        },
      },
      include: { players: true },
    });

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { z } from "zod";

// const schema = z.object({
//   userIdToKick: z.string(),
// });

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // ✅ read cookies
//     const cookie = req.headers.get("cookie");
//     if (!cookie)
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

//     const cookies = Object.fromEntries(
//       cookie.split("; ").map((c) => {
//         const [key, ...v] = c.split("=");
//         return [key, decodeURIComponent(v.join("="))];
//       })
//     );

//     const currentUserId = cookies.userId; // stored in cookie
//     if (!currentUserId)
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

//     const roomId = params.id;
//     const { userIdToKick } = schema.parse(await req.json());

//     // fetch room
//     const room = await prisma.room.findUnique({
//       where: { id: roomId },
//       include: { players: true },
//     });
//     if (!room)
//       return NextResponse.json({ error: "Room not found" }, { status: 404 });

//     // only owner can kick
//     if (room.ownerId !== currentUserId) {
//       return NextResponse.json(
//         { error: "Only owner can kick members" },
//         { status: 403 }
//       );
//     }

//     // check if user is in the room
//     const isInRoom = room.players.some((p) => p.id === userIdToKick);
//     if (!isInRoom)
//       return NextResponse.json({ error: "User not in room" }, { status: 400 });

//     // remove user from players
//     const updatedRoom = await prisma.room.update({
//       where: { id: roomId },
//       data: {
//         players: {
//           disconnect: { id: userIdToKick },
//         },
//       },
//       include: { players: true },
//     });

//     return NextResponse.json({ success: true, room: updatedRoom });
//   } catch (err) {
//     return NextResponse.json(
//       { error: (err as Error).message },
//       { status: 400 }
//     );
//   }
// }
