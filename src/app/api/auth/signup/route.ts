import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createNotification, NotificationTemplates } from "@/lib/services/notification-service";

export async function POST(req: Request) {
  const { name, email, username, password } = await req.json();

  if (!email || !password || !username)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername)
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, username, password: hashedPassword },
    });

    // Send welcome notification
    try {
      const welcomeTemplate = NotificationTemplates.welcome();
      await createNotification({
        userId: user.id,
        ...welcomeTemplate,
      });
    } catch (error) {
      console.error('Failed to create welcome notification:', error);
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Registration failed" }, { status: 500 });
  }
}
