import type { SessionUser } from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000";

export const AUTH_TOKEN_KEY = "general-purpose-saas.auth_token";

export function storeAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

type RequestOptions = {
  method?: string;
  body?: BodyInit | object;
  token?: string | null;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers();
  let body: BodyInit | undefined;

  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  login: (data: { email: string; password: string }) =>
    request<import("./types/auth").TokenResponse>("/api/auth/login", {
      method: "POST",
      body: data,
    }),
  register: (data: { email: string; password: string }) =>
    request<import("./types/auth").TokenResponse>("/api/auth/register", {
      method: "POST",
      body: data,
    }),
  startSso: async (provider: "google" | "github") => {
    window.location.assign(`${API_BASE_URL}/api/auth/sso/${provider}/start`);
  },
  requestPasswordReset: (email: string) =>
    request<{ sent: boolean }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    }).then(() => undefined),
  getSession: () =>
    request<import("./types/auth").AuthUser>("/api/auth/me", {
      token: localStorage.getItem(AUTH_TOKEN_KEY),
    }).then(
      (user) => ({ email: user.email, name: user.email }) satisfies SessionUser,
    ),
  getUserSettings: () =>
    request<import("./types/auth").UserSettings>("/api/users/me/settings", {
      token: localStorage.getItem(AUTH_TOKEN_KEY),
    }),
  updateUserSettings: (data: Partial<import("./types/auth").UserSettings>) =>
    request<import("./types/auth").UserSettings>("/api/users/me/settings", {
      method: "PATCH",
      body: data,
      token: localStorage.getItem(AUTH_TOKEN_KEY),
    }),
};

export type Api = typeof api;
