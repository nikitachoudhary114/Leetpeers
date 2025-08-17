import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, username, password: hashed },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
