import { inject } from "vitest";

export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  cookie?: string;
  headers?: Record<string, string>;
};

export type ApiResponse<T = unknown> = {
  status: number;
  data: T;
  headers: Headers;
  setCookie: string | null;
};

/**
 * Performs a fetch request to the test API server.
 * Automatically serializes body as JSON and injects session cookie if provided.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const baseUrl = inject("baseUrl");
  const { method = "GET", body, cookie, headers = {} } = options;

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const reqHeaders: Record<string, string> = {
    ...headers,
  };

  if (body !== undefined) {
    reqHeaders["Content-Type"] = "application/json";
  }

  if (cookie) {
    reqHeaders.Cookie = cookie;
  }

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });

  const data = await res.json().catch(() => ({})) as T;
  const setCookie = res.headers.get("set-cookie");

  return {
    status: res.status,
    data,
    headers: res.headers,
    setCookie,
  };
}
