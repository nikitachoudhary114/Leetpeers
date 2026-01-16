import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { deleteNotification } from "@/lib/services/notification-service";

// DELETE - Delete a specific notification
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteNotification(session.user.id, id);

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Notification not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
