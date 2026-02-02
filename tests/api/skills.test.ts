import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  apiFetch,
  cleanupUserByEmail,
  extractSessionCookie,
  uniqueEmail,
} from "../helpers";

type Skill = {
  id: string;
  skillName: string;
  description: string | null;
  rank: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  createdAt: string;
  goals?: Array<{ id: string; goalName: string; isCompleted: boolean }>;
};

describe("/api/skills", () => {
  const testEmail = uniqueEmail("skills");
  const testPassword = "securePass123!";
  let sessionCookie: string;

  beforeAll(async () => {
    // Cleanup and create a fresh user
    await cleanupUserByEmail(testEmail);

    await apiFetch("/api/auth/register", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });

    const loginRes = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });

    sessionCookie = extractSessionCookie(loginRes.setCookie)!;
    expect(sessionCookie).toBeTruthy();
  });

  afterAll(async () => {
    await cleanupUserByEmail(testEmail);
  });

  describe("gET /api/skills", () => {
    it("returns 401 without authentication", async () => {
      const res = await apiFetch("/api/skills", { method: "GET" });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 200 with empty skills array for new user", async () => {
      const res = await apiFetch<{ skills: Skill[] }>("/api/skills", {
        method: "GET",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(200);
      expect(res.data.skills).toBeDefined();
      expect(Array.isArray(res.data.skills)).toBe(true);
    });
  });

  describe("pOST /api/skills", () => {
    it("returns 401 without authentication", async () => {
      const res = await apiFetch("/api/skills", {
        method: "POST",
        body: { skillName: "Test Skill" },
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 400 when skillName is missing", async () => {
      const res = await apiFetch("/api/skills", {
        method: "POST",
        body: { skillName: "" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 400 for invalid rank", async () => {
      const res = await apiFetch("/api/skills", {
        method: "POST",
        body: { skillName: "Test Skill", rank: "INVALID" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 201 and creates skill with valid input", async () => {
      const res = await apiFetch<{ skill: Skill }>("/api/skills", {
        method: "POST",
        body: {
          skillName: "TypeScript Mastery",
          description: "Learn advanced TypeScript",
          rank: "A",
        },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(201);
      expect(res.data.skill).toBeDefined();
      expect(res.data.skill.skillName).toBe("TypeScript Mastery");
      expect(res.data.skill.description).toBe("Learn advanced TypeScript");
      expect(res.data.skill.rank).toBe("A");
      expect(res.data.skill.level).toBe(1);
      expect(res.data.skill.currentXp).toBe(0);
    });

    it("returns 201 with default rank B when not specified", async () => {
      const res = await apiFetch<{ skill: Skill }>("/api/skills", {
        method: "POST",
        body: { skillName: "Default Rank Skill" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(201);
      expect(res.data.skill.rank).toBe("B");
    });

    it("accepts all valid ranks (S, A, B, C)", async () => {
      const ranks = ["S", "A", "B", "C"];

      for (const rank of ranks) {
        const res = await apiFetch<{ skill: Skill }>("/api/skills", {
          method: "POST",
          body: { skillName: `Skill with rank ${rank}`, rank },
          cookie: sessionCookie,
        });

        expect(res.status).toBe(201);
        expect(res.data.skill.rank).toBe(rank);
      }
    });
  });

  describe("gET /api/skills (after creating skills)", () => {
    it("returns created skills with nested goals", async () => {
      const res = await apiFetch<{ skills: Skill[] }>("/api/skills", {
        method: "GET",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(200);
      expect(res.data.skills.length).toBeGreaterThan(0);

      // Each skill should have goals array (empty or not)
      for (const skill of res.data.skills) {
        expect(skill).toHaveProperty("goals");
        expect(Array.isArray(skill.goals)).toBe(true);
      }
    });
  });
});
