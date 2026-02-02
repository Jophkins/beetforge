import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set for tests");
}

/**
 * Separate PrismaClient instance for test utilities (cleanup, seeding, etc.).
 * Uses the same DATABASE_URL as the app.
 */
export const testPrisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
  log: ["warn", "error"],
});

/**
 * Deletes a user and all cascading data (sessions, skills, goals) by email.
 * Safe to call even if user doesn't exist.
 */
export async function cleanupUserByEmail(email: string): Promise<void> {
  await testPrisma.user.deleteMany({
    where: { email: email.toLowerCase() },
  });
}

/**
 * Generates a unique test email to avoid conflicts between test runs.
 */
export function uniqueEmail(prefix = "test"): string {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${suffix}@example.test`;
}

/**
 * Disconnects the test Prisma client. Call in global teardown if needed.
 */
export async function disconnectTestPrisma(): Promise<void> {
  await testPrisma.$disconnect();
}
