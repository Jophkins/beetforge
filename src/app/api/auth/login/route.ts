import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // user w/o session for now
    // TODO: httpOnly cookie with session token
    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 200 },
    );
  }
  catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
