import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_FIELDS = [
  "name",
  "leetcodeProfile",
  "bio",
  "avatarUrl",
  "githubProfile",
  "linkedinProfile",
  "country",
] as const;

type UpdatableField = (typeof ALLOWED_FIELDS)[number];

export async function PUT(req: NextRequest) {
  try {
    // ✅ Authenticate user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    // ✅ Build update payload safely
    const data: Partial<Record<UpdatableField, string>> = {};

    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

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
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
