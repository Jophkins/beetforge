import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/lib/auth/sessions";
import { prisma } from "@/src/lib/prisma";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ skillId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillId } = await ctx.params;

    const skill = await prisma.skill.findFirst({
      where: { id: skillId, userId: user.id },
      select: { id: true },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const goalName = String(body?.goalName ?? "").trim();
    if (!goalName) {
      return NextResponse.json({ error: "Goal name is required" }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        skillId,
        goalName,
      },
      select: {
        id: true,
        goalName: true,
        isCompleted: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  }
  catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
