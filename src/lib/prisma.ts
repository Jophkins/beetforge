import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { env } from "prisma/config";

import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = env("DATABASE_URL");
const adapter = new PrismaPg({ connectionString });

export const prisma
  = globalForPrisma.prisma
    ?? new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });

if (env("NODE_ENV") !== "production")
  globalForPrisma.prisma = prisma;
