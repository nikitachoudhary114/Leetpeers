import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // ✅ Pass req to getServerSession in App Router
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const data: Record<string, any> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.leetcodeProfile !== undefined)
      data.leetcodeProfile = body.leetcodeProfile;
    if (body.bio !== undefined) data.bio = body.bio;
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;
    if (body.githubProfile !== undefined)
      data.githubProfile = body.githubProfile;
    if (body.linkedinProfile !== undefined)
      data.linkedinProfile = body.linkedinProfile;
    if (body.country !== undefined) data.country = body.country;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        leetcodeProfile: true,
        bio: true,
        avatarUrl: true,
        githubProfile: true,
        linkedinProfile: true,
        country: true,
        updatedAt: true,
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
