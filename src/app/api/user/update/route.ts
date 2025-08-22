import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      leetcodeProfile,
      bio,
      avatarUrl,
      githubProfile,
      linkedinProfile,
      country,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        leetcodeProfile,
        bio,
        avatarUrl,
        githubProfile,
        linkedinProfile,
        country,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
