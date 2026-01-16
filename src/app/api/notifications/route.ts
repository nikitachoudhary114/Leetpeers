import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  getNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from "@/lib/services/notification-service";

// GET - Fetch notifications for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const { notifications, unreadCount } = await getNotifications(
      session.user.id,
      { limit, offset, unreadOnly }
    );

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PUT - Mark notifications as read
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      await markAllNotificationsAsRead(session.user.id);
      return NextResponse.json({ message: "All notifications marked as read" });
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "notificationIds must be an array" },
        { status: 400 }
      );
    }

    await markNotificationsAsRead(session.user.id, notificationIds);
    return NextResponse.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark notifications read error:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
