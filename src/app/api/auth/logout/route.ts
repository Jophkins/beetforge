import { NextResponse } from "next/server";

import { deleteSession } from "@/src/lib/auth/sessions";

export async function POST() {
  await deleteSession();
  return NextResponse.json({ ok: true }, { status: 200 });
}
