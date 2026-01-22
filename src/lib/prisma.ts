import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "prisma/config";

import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: env("DATABASE_URL") }),
  log: ["warn", "error"],
});

if (env("NODE_ENV") !== "production")
  globalForPrisma.prisma = prisma;
