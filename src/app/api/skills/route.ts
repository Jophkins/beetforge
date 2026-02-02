import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/lib/auth/sessions";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const skillName = String(body?.skillName ?? "").trim();
    const description = body?.description != null ? String(body.description).trim() : null;
    const rank = String(body?.rank ?? "B").toUpperCase();

    if (!skillName) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    if (!["S", "A", "B", "C"].includes(rank)) {
      return NextResponse.json({ error: "Invalid rank" }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        userId: user.id,
        skillName,
        description: description || null,
        rank: rank as any,
      },
      select: {
        id: true,
        skillName: true,
        description: true,
        rank: true,
        level: true,
        currentXp: true,
        nextLevelXp: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ skill }, { status: 201 });
  }
  catch {
    return NextResponse.json({ error: "error creating skill" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      goals: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          goalName: true,
          isCompleted: true,
        },
      },
    },
  });

  return NextResponse.json({ skills }, { status: 200 });
}
