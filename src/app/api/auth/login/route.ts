import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
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
    const { email, password } =  parsed.data;

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
