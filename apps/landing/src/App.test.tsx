import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("Landing app", () => {
  it("renders public landing and pricing placeholders", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /saas workflows/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/hero image placeholder/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Basic" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open dashboard/i }),
    ).toHaveAttribute("href", "http://localhost:5173");
  });
});
