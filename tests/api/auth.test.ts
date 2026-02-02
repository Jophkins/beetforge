import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  apiFetch,
  cleanupUserByEmail,
  extractSessionCookie,
  isSessionCleared,
  uniqueEmail,
} from "../helpers";

describe("/api/auth", () => {
  // Unique email for this test suite to avoid conflicts
  const testEmail = uniqueEmail("auth");
  const testPassword = "securePass123!";

  // Clean up before and after tests
  beforeAll(async () => {
    await cleanupUserByEmail(testEmail);
  });

  afterAll(async () => {
    await cleanupUserByEmail(testEmail);
  });

  describe("pOST /api/auth/register", () => {
    it("returns 400 for password shorter than 8 characters", async () => {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { email: uniqueEmail("short-pass"), password: "short" },
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 400 for empty email", async () => {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { email: "", password: testPassword },
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 201 and creates user on valid input", async () => {
      const res = await apiFetch<{ user: { id: string; email: string } }>("/api/auth/register", {
        method: "POST",
        body: { email: testEmail, password: testPassword },
      });

      expect(res.status).toBe(201);
      expect(res.data.user).toBeDefined();
      expect(res.data.user.email).toBe(testEmail.toLowerCase());
      expect(res.data.user.id).toBeDefined();
    });

    it("returns 409 when user already exists", async () => {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { email: testEmail, password: testPassword },
      });

      expect(res.status).toBe(409);
      expect(res.data).toHaveProperty("error");
    });
  });

  describe("pOST /api/auth/login", () => {
    it("returns 400 for empty credentials", async () => {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: "", password: "" },
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 401 for wrong email", async () => {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: "nonexistent@example.test", password: testPassword },
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 401 for wrong password", async () => {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: testEmail, password: "wrongPassword123!" },
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 200 and sets session cookie on valid credentials", async () => {
      const res = await apiFetch<{ ok: boolean }>("/api/auth/login", {
        method: "POST",
        body: { email: testEmail, password: testPassword },
      });

      expect(res.status).toBe(200);
      expect(res.data.ok).toBe(true);
      expect(res.setCookie).toBeTruthy();

      const sessionCookie = extractSessionCookie(res.setCookie);
      expect(sessionCookie).toBeTruthy();
      expect(sessionCookie).toMatch(/^session=.+/);
    });
  });

  describe("gET /api/auth/me", () => {
    it("returns 401 without session cookie", async () => {
      const res = await apiFetch("/api/auth/me", {
        method: "GET",
      });

      expect(res.status).toBe(401);
      expect(res.data).toHaveProperty("error");
    });

    it("returns 200 with user info when authenticated", async () => {
      // First login to get a session cookie
      const loginRes = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: testEmail, password: testPassword },
      });
      const sessionCookie = extractSessionCookie(loginRes.setCookie);
      expect(sessionCookie).toBeTruthy();

      // Then call /me with the cookie
      const res = await apiFetch<{ user: { id: string; email: string } }>("/api/auth/me", {
        method: "GET",
        cookie: sessionCookie!,
      });

      expect(res.status).toBe(200);
      expect(res.data.user).toBeDefined();
      expect(res.data.user.email).toBe(testEmail.toLowerCase());
    });
  });

  describe("pOST /api/auth/logout", () => {
    it("returns 200 and clears session cookie", async () => {
      // First login to get a session cookie
      const loginRes = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: testEmail, password: testPassword },
      });
      const sessionCookie = extractSessionCookie(loginRes.setCookie);
      expect(sessionCookie).toBeTruthy();

      // Then logout
      const res = await apiFetch<{ ok: boolean }>("/api/auth/logout", {
        method: "POST",
        cookie: sessionCookie!,
      });

      expect(res.status).toBe(200);
      expect(res.data.ok).toBe(true);
      expect(res.setCookie).toBeTruthy();
      expect(isSessionCleared(res.setCookie)).toBe(true);
    });

    it("returns 200 even without session cookie (idempotent)", async () => {
      const res = await apiFetch<{ ok: boolean }>("/api/auth/logout", {
        method: "POST",
      });

      expect(res.status).toBe(200);
      expect(res.data.ok).toBe(true);
    });
  });
});
