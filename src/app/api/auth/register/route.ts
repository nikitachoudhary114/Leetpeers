import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, username, password } = parsed.data;

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, username, password: hashed },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
