import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import { PrismaClient, Rank } from "../src/generated/prisma/client";

async function main() {
  /* eslint-disable node/no-process-env */
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const seedEmail = process.env.SEED_EMAIL;
  const seedPassword = process.env.SEED_PASSWORD;
  /* eslint-enable node/no-process-env */

  if (!seedEmail || !seedPassword) {
    throw new Error("SEED_EMAIL and SEED_PASSWORD must be set in .env");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const email = seedEmail.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(seedPassword, 10);

    // Upsert the seed user
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });

    // eslint-disable-next-line no-console
    console.log(`✓ User upserted: ${user.email} (id: ${user.id})`);

    // Clear existing data for idempotency (goals first due to FK)
    await prisma.goal.deleteMany({ where: { userId: user.id } });
    await prisma.skill.deleteMany({ where: { userId: user.id } });

    // eslint-disable-next-line no-console
    console.log(`✓ Cleared existing skills and goals for user`);

    // Create skills with nested goals
    const skillsData = [
      {
        skillName: "TypeScript",
        description: "Modern typed JavaScript development",
        rank: Rank.A,
        level: 5,
        currentXp: 450,
        nextLevelXp: 500,
        goals: [
          { goalName: "Master generics and utility types" },
          { goalName: "Learn advanced type inference patterns" },
        ],
      },
      {
        skillName: "React",
        description: "Building user interfaces with React",
        rank: Rank.B,
        level: 3,
        currentXp: 120,
        nextLevelXp: 300,
        goals: [
          { goalName: "Build a custom hooks library" },
        ],
      },
      {
        skillName: "Node.js",
        description: "Server-side JavaScript runtime",
        rank: Rank.B,
        level: 4,
        currentXp: 280,
        nextLevelXp: 400,
        goals: [
          { goalName: "Implement REST API best practices" },
          { goalName: "Learn streaming and buffers" },
        ],
      },
      {
        skillName: "PostgreSQL",
        description: "Relational database management",
        rank: Rank.C,
        level: 2,
        currentXp: 80,
        nextLevelXp: 200,
        goals: [
          { goalName: "Optimize complex queries with indexes" },
        ],
      },
      {
        skillName: "Docker",
        description: "Containerization and deployment",
        rank: Rank.C,
        level: 1,
        currentXp: 30,
        nextLevelXp: 100,
        goals: [], // No goals yet
      },
      {
        skillName: "System Design",
        description: "Designing scalable distributed systems",
        rank: Rank.S,
        level: 2,
        currentXp: 150,
        nextLevelXp: 250,
        goals: [
          { goalName: "Study microservices architecture patterns" },
        ],
      },
    ];

    let totalSkills = 0;
    let totalGoals = 0;

    for (const skillData of skillsData) {
      const { goals, ...skillFields } = skillData;

      await prisma.skill.create({
        data: {
          ...skillFields,
          userId: user.id,
          goals: {
            create: goals.map(g => ({
              goalName: g.goalName,
              userId: user.id,
              isCompleted: false,
            })),
          },
        },
      });

      totalSkills++;
      totalGoals += goals.length;
    }

    // eslint-disable-next-line no-console
    console.log(`✓ Created ${totalSkills} skills and ${totalGoals} goals`);
    // eslint-disable-next-line no-console
    console.log("Seed completed successfully!");
  }
  finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
