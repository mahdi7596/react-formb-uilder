import { expect, test } from "@playwright/test";

test("creator can add, edit, diagnose, and preview a simple form", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page).toHaveTitle(/React Builder Phase 8 Harness/);
  await expect(page.getByRole("banner", { name: "Builder command bar" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Component palette" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Form canvas" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Inspector" })).toBeVisible();

  await page.getByRole("button", { name: "Add Email" }).click();
  await expect(page.getByRole("button", { name: "Email", exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Label", exact: true }).fill("Work email");
  await expect(page.getByRole("button", { name: "Work email" })).toBeVisible();

  await page.getByRole("tab", { name: "Data" }).click();
  await page.getByLabel("Submitted path").fill("__proto__.polluted");
  await expect(page.getByText("Submitted path is invalid or unsafe.").first()).toBeVisible();

  await page.getByLabel("Submitted path").fill("workEmail");
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByRole("region", { name: "Form preview" })).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await page.getByLabel("Work email").fill("creator@example.com");
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByRole("button", { name: "Work email" })).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("mobile viewport exposes quick-edit friendly stacked layout", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-specific layout assertion");

  await page.goto("/");
  await expect(page.getByRole("region", { name: "Component palette" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Form canvas" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Inspector" })).toBeVisible();
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByRole("region", { name: "Form preview" })).toBeVisible();
});
