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
};

type Goal = {
  id: string;
  goalName: string;
  isCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  skillId?: string;
};

describe("/api/goals", () => {
  const testEmail = uniqueEmail("goals");
  const testPassword = "securePass123!";
  let sessionCookie: string;
  let testSkillId: string;
  let testGoalId: string;

  // Second user for isolation tests
  const otherEmail = uniqueEmail("goals-other");
  let otherSessionCookie: string;
  let otherSkillId: string;

  beforeAll(async () => {
    // Cleanup
    await cleanupUserByEmail(testEmail);
    await cleanupUserByEmail(otherEmail);

    // Create first user and login
    await apiFetch("/api/auth/register", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });

    const loginRes = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email: testEmail, password: testPassword },
    });
    sessionCookie = extractSessionCookie(loginRes.setCookie)!;

    // Create a skill for the first user
    const skillRes = await apiFetch<{ skill: Skill }>("/api/skills", {
      method: "POST",
      body: { skillName: "Test Skill for Goals" },
      cookie: sessionCookie,
    });
    testSkillId = skillRes.data.skill.id;

    // Create second user and login
    await apiFetch("/api/auth/register", {
      method: "POST",
      body: { email: otherEmail, password: testPassword },
    });

    const otherLoginRes = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email: otherEmail, password: testPassword },
    });
    otherSessionCookie = extractSessionCookie(otherLoginRes.setCookie)!;

    // Create a skill for the second user
    const otherSkillRes = await apiFetch<{ skill: Skill }>("/api/skills", {
      method: "POST",
      body: { skillName: "Other User Skill" },
      cookie: otherSessionCookie,
    });
    otherSkillId = otherSkillRes.data.skill.id;
  });

  afterAll(async () => {
    await cleanupUserByEmail(testEmail);
    await cleanupUserByEmail(otherEmail);
  });

  describe("pOST /api/skills/:skillId/goals", () => {
    it("returns 401 without authentication", async () => {
      const res = await apiFetch(`/api/skills/${testSkillId}/goals`, {
        method: "POST",
        body: { goalName: "Test Goal" },
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 404 when skill does not exist", async () => {
      const fakeSkillId = "nonexistent-skill-id";
      const res = await apiFetch(`/api/skills/${fakeSkillId}/goals`, {
        method: "POST",
        body: { goalName: "Test Goal" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 404 when skill belongs to another user", async () => {
      // Try to add goal to other user's skill
      const res = await apiFetch(`/api/skills/${otherSkillId}/goals`, {
        method: "POST",
        body: { goalName: "Sneaky Goal" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 400 when goalName is missing", async () => {
      const res = await apiFetch(`/api/skills/${testSkillId}/goals`, {
        method: "POST",
        body: { goalName: "" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 201 and creates goal with valid input", async () => {
      const res = await apiFetch<{ goal: Goal }>(`/api/skills/${testSkillId}/goals`, {
        method: "POST",
        body: { goalName: "Complete TypeScript course" },
        cookie: sessionCookie,
      });

      expect(res.status).toBe(201);
      expect(res.data.goal).toBeDefined();
      expect(res.data.goal.goalName).toBe("Complete TypeScript course");
      expect(res.data.goal.isCompleted).toBe(false);
      expect(res.data.goal.id).toBeDefined();

      // Save for later tests
      testGoalId = res.data.goal.id;
    });

    it("creates multiple goals for the same skill", async () => {
      const goals = ["Learn generics", "Master utility types", "Study inference"];

      for (const goalName of goals) {
        const res = await apiFetch<{ goal: Goal }>(`/api/skills/${testSkillId}/goals`, {
          method: "POST",
          body: { goalName },
          cookie: sessionCookie,
        });

        expect(res.status).toBe(201);
        expect(res.data.goal.goalName).toBe(goalName);
      }
    });
  });

  describe("pATCH /api/goals/:goalId", () => {
    it("returns 401 without authentication", async () => {
      const res = await apiFetch(`/api/goals/${testGoalId}`, {
        method: "PATCH",
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 404 when goal does not exist", async () => {
      const fakeGoalId = "nonexistent-goal-id";
      const res = await apiFetch(`/api/goals/${fakeGoalId}`, {
        method: "PATCH",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 404 when goal belongs to another user", async () => {
      // First create a goal for other user
      const otherGoalRes = await apiFetch<{ goal: Goal }>(`/api/skills/${otherSkillId}/goals`, {
        method: "POST",
        body: { goalName: "Other user goal" },
        cookie: otherSessionCookie,
      });
      const otherGoalId = otherGoalRes.data.goal.id;

      // Try to patch other user's goal
      const res = await apiFetch(`/api/goals/${otherGoalId}`, {
        method: "PATCH",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 200 and toggles isCompleted from false to true", async () => {
      const res = await apiFetch<{ goal: Goal }>(`/api/goals/${testGoalId}`, {
        method: "PATCH",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(200);
      expect(res.data.goal).toBeDefined();
      expect(res.data.goal.isCompleted).toBe(true);
      expect(res.data.goal.id).toBe(testGoalId);
    });

    it("returns 200 and toggles isCompleted from true back to false", async () => {
      const res = await apiFetch<{ goal: Goal }>(`/api/goals/${testGoalId}`, {
        method: "PATCH",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(200);
      expect(res.data.goal.isCompleted).toBe(false);
    });

    it("includes skillId in response", async () => {
      const res = await apiFetch<{ goal: Goal }>(`/api/goals/${testGoalId}`, {
        method: "PATCH",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(200);
      expect(res.data.goal.skillId).toBe(testSkillId);
    });
  });

  describe("goals appear in skills list", () => {
    it("gET /api/skills returns skills with their goals", async () => {
      const res = await apiFetch<{
        skills: Array<{ id: string; goals: Goal[] }>;
      }>("/api/skills", {
        method: "GET",
        cookie: sessionCookie,
      });

      expect(res.status).toBe(200);

      const skill = res.data.skills.find(s => s.id === testSkillId);
      expect(skill).toBeDefined();
      expect(skill!.goals.length).toBeGreaterThan(0);

      // Check that our created goal is there
      const goal = skill!.goals.find(g => g.id === testGoalId);
      expect(goal).toBeDefined();
    });
  });
});
