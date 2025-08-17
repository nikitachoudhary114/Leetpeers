import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 400 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });

    const token = signToken({ id: user.id });

    return NextResponse.json({ token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
