import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, username, password } = await req.json();

  if (!email || !password || !username)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, username, password: hashedPassword },
  });

  return NextResponse.json({ user });
}
