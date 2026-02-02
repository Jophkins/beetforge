import type { ChildProcess } from "node:child_process";

import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";

let serverProcess: ChildProcess | null = null;
let serverPort: number | null = null;

// Shared buffer for debugging
const logs = { stdout: "", stderr: "" };

const ROOT_DIR = path.resolve(import.meta.dirname, "../..");

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
  serverPort = port;

  // Reset logs
  logs.stdout = "";
  logs.stderr = "";

  // eslint-disable-next-line no-console
  console.log(`[test] Starting Next.js server on port ${port}...`);

  // Use shell mode for better compatibility with pnpm
  serverProcess = spawn(`pnpm next dev --port ${port}`, {
    cwd: ROOT_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  });

  serverProcess.stdout?.on("data", (data: Buffer) => {
    const text = data.toString();
    logs.stdout += text;
    // eslint-disable-next-line no-console
    console.log(`[next] ${text.trim()}`);
  });

  serverProcess.stderr?.on("data", (data: Buffer) => {
    const text = data.toString();
    logs.stderr += text;

    console.error(`[next:err] ${text.trim()}`);
  });

  // Handle early process exit
  serverProcess.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[test] Next.js process exited with code ${code}`);
    }
  });

  // Wait for server to be ready
  const baseUrl = `http://localhost:${port}`;
  await waitForServer(baseUrl);

  // eslint-disable-next-line no-console
  console.log(`[test] Next.js server ready at ${baseUrl}`);

  return { baseUrl, port };
}

/**
 * Stops the Next.js server if running.
 */
export async function stopNextServer(): Promise<void> {
  if (!serverProcess) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("[test] Stopping Next.js server...");

  return new Promise((resolve) => {
    serverProcess!.on("close", () => {
      serverProcess = null;
      serverPort = null;
      resolve();
    });

    serverProcess!.kill("SIGTERM");

    // Force kill after 5 seconds
    setTimeout(() => {
      if (serverProcess) {
        serverProcess.kill("SIGKILL");
      }
    }, 5000);
  });
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
