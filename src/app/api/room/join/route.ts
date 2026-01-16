import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { createBulkNotifications, NotificationTemplates } from "@/lib/services/notification-service";

export async function POST(req: Request) {
  try {
      const session = await getServerSession({ req, ...authOptions });
     
         if (!session || !session.user?.id) {
           return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
         }
     
         const userId = session.user.id;
    const { code } = await req.json();

    // Check if room exists and get all current players
    const existingRoom = await prisma.room.findUnique({
      where: { code },
      include: { players: { select: { id: true } } },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is already in the room
    const isAlreadyMember = existingRoom.players.some(player => player.id === userId);
    if (isAlreadyMember) {
      return NextResponse.json({ error: "User already joined" }, { status: 400 });
    }

    // Get user info for notification
    const joiningUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, username: true },
    });

    const room = await prisma.room.update({
      where: { code },
      data: {
      players: { connect: { id: userId } },
      },
      include: { players: true },
    });

    // Notify all existing room members about the new member
    try {
      const memberName = joiningUser?.name || joiningUser?.username || 'Someone';
      const roomName = existingRoom.name || 'the room';
      const template = NotificationTemplates.memberJoined(roomName, memberName);

      // Notify all players except the one who just joined
      const notifications = existingRoom.players
        .filter(player => player.id !== undefined)
        .map(player => ({
          userId: player.id,
          roomId: existingRoom.id,
          ...template,
          link: `/rooms/${existingRoom.id}`,
        }));

      if (notifications.length > 0) {
        await createBulkNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to create room join notifications:', error);
    }

    return NextResponse.json(room);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
