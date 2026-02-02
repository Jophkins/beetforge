import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/lib/auth/sessions";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ goalId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goalId } = await ctx.params;

    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId: user.id },
      select: { id: true, isCompleted: true },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const goal = await prisma.goal.update({
      where: { id: existingGoal.id },
      data: { isCompleted: !existingGoal.isCompleted },
      select: {
        id: true,
        goalName: true,
        isCompleted: true,
        updatedAt: true,
        skillId: true,
      },
    });

    return NextResponse.json({ goal }, { status: 200 });
  }
  catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
