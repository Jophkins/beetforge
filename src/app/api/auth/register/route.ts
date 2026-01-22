import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  }
  catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
