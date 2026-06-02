import { expect, test } from "@playwright/test";

test("landing page exposes dashboard entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SaaS Template" })).toBeVisible();
  await page.getByRole("link", { name: /open dashboard/i }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
