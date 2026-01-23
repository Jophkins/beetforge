import { cookies } from "next/headers";
import crypto from "node:crypto";
import { env } from "prisma/config";

import { prisma } from "@/src/lib/prisma";

const COOKIE_NAME = "session";
const SESSION_TTL_DAYS = 30;

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function newToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = newToken();
  const tokenHash = sha256(token);

  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId, tokenHash, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env("NODE_ENV") === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token)
    return;

  await prisma.session.deleteMany({
    where: { tokenHash: sha256(token) },
  });

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env("NODE_ENV") === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token)
    return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true },
  });

  if (!session)
    return null;
  if (session.expiresAt < new Date())
    return null;

  return { id: session.user.id, email: session.user.email };
}
