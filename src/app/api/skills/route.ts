import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/lib/auth/sessions";
import { prisma } from "@/src/lib/prisma";

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
