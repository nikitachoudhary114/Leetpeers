import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { profileSchema } from "@/lib/validations/profile";

// GET - Fetch current user's profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        leetcodeProfile: true,
        leetcodeVerified: true,
        githubProfile: true,
        githubVerified: true,
        linkedinProfile: true,
        bio: true,
        avatarUrl: true,
        country: true,
        streakCount: true,
        problemsSolved: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update current user's profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    // Validate the request body using Zod
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Build update data object, excluding undefined values
    const data: Record<string, unknown> = {};
    if (validatedData.name !== undefined) data.name = validatedData.name;
    if (validatedData.leetcodeProfile !== undefined) {
      data.leetcodeProfile = validatedData.leetcodeProfile;
      // Reset verification if username changed
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { leetcodeProfile: true }
      });
      if (currentUser?.leetcodeProfile !== validatedData.leetcodeProfile) {
        data.leetcodeVerified = false;
      }
    }
    if (validatedData.bio !== undefined) data.bio = validatedData.bio;
    if (validatedData.avatarUrl !== undefined) data.avatarUrl = validatedData.avatarUrl || null;
    if (validatedData.githubProfile !== undefined) {
      data.githubProfile = validatedData.githubProfile;
      // Reset verification if username changed
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { githubProfile: true }
      });
      if (currentUser?.githubProfile !== validatedData.githubProfile) {
        data.githubVerified = false;
      }
    }
    if (validatedData.linkedinProfile !== undefined) {
      data.linkedinProfile = validatedData.linkedinProfile || null;
    }
    if (validatedData.country !== undefined) data.country = validatedData.country;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        leetcodeProfile: true,
        leetcodeVerified: true,
        githubProfile: true,
        githubVerified: true,
        linkedinProfile: true,
        bio: true,
        avatarUrl: true,
        country: true,
        streakCount: true,
        problemsSolved: true,
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
