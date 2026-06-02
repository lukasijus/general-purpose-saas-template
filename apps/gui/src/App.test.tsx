import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { Api } from "./api/client";
import { App } from "./App";

function createTestApi(): Api {
  return {
    login: async () => ({
      access_token: "test-token",
      token_type: "bearer",
      user: {
        uuid: "test-user",
        email: "test@example.com",
        role: "user",
        is_active: true,
        is_verified: true,
      },
    }),
    register: async () => ({
      access_token: "test-token",
      token_type: "bearer",
      user: {
        uuid: "test-user",
        email: "test@example.com",
        role: "user",
        is_active: true,
        is_verified: true,
      },
    }),
    startSso: async () => undefined,
    requestPasswordReset: async () => undefined,
    getSession: async () => ({
      email: "test@example.com",
      name: "Test User",
    }),
    getUserSettings: async () => ({
      user_uuid: "test-user",
      theme: "system",
      language: "en",
    }),
    updateUserSettings: async (data) => ({
      user_uuid: "test-user",
      theme: data.theme ?? "system",
      language: data.language ?? "en",
    }),
  };
}

describe("App routes", () => {
  it("starts the dashboard web app at login", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App api={createTestApi()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("renders the dashboard route", async () => {
    render(
      <MemoryRouter initialEntries={["/workspace"]}>
        <App api={createTestApi()} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });
});
