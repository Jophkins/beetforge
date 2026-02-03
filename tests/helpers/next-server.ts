import type { ChildProcessWithoutNullStreams } from "node:child_process";

import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";

let serverProcess: ChildProcessWithoutNullStreams | null = null;


// Shared buffer for debugging
const logs = { stdout: "", stderr: "" };


const ROOT_DIR = path.resolve(import.meta.dirname, "../..");

function pnpmCmd() {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

/**
 * Get a random available port by binding to port 0.
 */
async function getAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        const port = addr.port;
        server.close(() => resolve(port));
      }
      else {
        reject(new Error("Failed to get port"));
      }
    });
    server.on("error", reject);
  });
}

/**
 * Starts Next.js dev server on a random available port.
 * Waits until the server is ready to accept requests.
 */
export async function startNextServer(): Promise<{ baseUrl: string; port: number }> {
  const port = await getAvailablePort();

  logs.stdout = "";
  logs.stderr = "";

  console.log(`[test] Starting Next.js server on port ${port}...`);

  serverProcess = spawn(
    pnpmCmd(),
    ["next", "dev", "--port", String(port)],
    {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        NODE_ENV: "development",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    }
  );

  serverProcess.stdout.on("data", (data: Buffer) => {
    const text = data.toString();
    logs.stdout += text;
    console.log(`[next] ${text.trim()}`);
  });

  serverProcess.stderr.on("data", (data: Buffer) => {
    const text = data.toString();
    logs.stderr += text;
    console.error(`[next:err] ${text.trim()}`);
  });

  serverProcess.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[test] Next.js process exited with code ${code}`);
    }
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForServer(baseUrl);

  console.log(`[test] Next.js server ready at ${baseUrl}`);
  return { baseUrl, port };
}

/**
 * Stops the Next.js server if running.
 */
export async function stopNextServer(): Promise<void> {
  if (!serverProcess) return;

  console.log("[test] Stopping Next.js server...");

  const p = serverProcess;
  serverProcess = null;

  if (p.exitCode !== null) return;

  p.kill("SIGTERM");

  const exited = await Promise.race([
    new Promise<boolean>((resolve) => p.once("exit", () => resolve(true))),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000)),
  ]);

  if (!exited && p.exitCode === null) {
    p.kill("SIGKILL");
    await new Promise<void>((resolve) => p.once("exit", () => resolve()));
  }
}

/**
 * Polls the server until it responds with 200 or times out.
 */
async function waitForServer(baseUrl: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    // Check if process died
    if (serverProcess && serverProcess.exitCode !== null) {
      throw new Error(
        `[test] Next.js process exited with code ${serverProcess.exitCode}\n`
        + `stdout: ${logs.stdout}\nstderr: ${logs.stderr}`,
      );
    }

    try {
      const res = await fetch(`${baseUrl}/api/auth/me`, { method: "GET" });
      // Any response means server is up (even 401 is fine)
      if (res.status) {
        return;
      }
    }
    catch {
      // Server not ready yet, wait and retry
    }

    await sleep(500);
  }

  throw new Error(`[test] Next.js server did not start within ${timeoutMs}ms\nstdout: ${logs.stdout}\nstderr: ${logs.stderr}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
