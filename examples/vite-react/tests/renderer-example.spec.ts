import { expect, test } from "@playwright/test";

async function completeSinglePageForm(page: import("@playwright/test").Page): Promise<void> {
  const formPanel = page.locator(".form-panel");
  await formPanel.getByRole("textbox", { name: "Full name" }).fill("Jane Doe");
  await formPanel.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
  await formPanel.getByLabel("Preferred track").selectOption("product");
  await formPanel.getByLabel("I agree to be contacted about this registration").check();
}

test("submits the single-page example and shows normalized success output", async ({ page }) => {
  await page.goto("/");

  await completeSinglePageForm(page);
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator(".form-panel").getByText("Example submission received.", { exact: true })).toBeVisible();
  await expect(page.getByTestId("last-envelope")).toContainText('"fullName": "Jane Doe"');
  await expect(page.getByTestId("last-envelope")).toContainText('"track": "product"');
  await expect(page.getByTestId("last-envelope")).not.toContainText('"source"');
});

test("saves the builder draft and shows the saved state", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Save draft" }).click();

  await expect(page.getByText("Draft saved", { exact: true })).toBeVisible();
  await expect(page.getByText("Draft saved in the fake host adapter.")).toBeVisible();
});

test("recovers from a fake stale draft save conflict", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Simulate save conflict" }).click();
  await page.getByRole("button", { name: "Save draft" }).click();

  await expect(page.getByText("Draft conflicted")).toBeVisible();
  await expect(page.getByText("Draft has changed on the host.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reload latest" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry" })).toBeDisabled();

  await page.getByRole("button", { name: "Keep local edits" }).click();
  await expect(page.getByText("Local edits preserved.")).toBeVisible();
});

test("publishes an immutable revision and exposes generated artifacts", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("region", { name: "Publish checklist" })).toContainText("0 blockers");
  await page.getByText("Generated artifacts", { exact: true }).click();
  await expect(page.locator(".rfb-artifact-grid").getByText("https://json-schema.org/draft/2020-12/schema", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Publish", exact: true }).click();

  await expect(page.getByText("Published rev_published_1.")).toBeVisible();
  await expect(page.getByRole("region", { name: "Revision warnings" })).toContainText("rev_published_1");

  await page.getByRole("button", { name: "Simulate publish conflict" }).click();
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page.getByText("The fake host rejected this stale publish request.")).toBeVisible();
});

test("maps fake server validation errors to field, global message, invalid state, and focus", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Server validation" }).click();
  await completeSinglePageForm(page);
  await page.getByRole("button", { name: "Submit" }).click();

  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByText("The fake backend rejected this value.", { exact: true })).toBeVisible();
  await expect(formPanel.getByText("This global validation message came from the fake backend.", { exact: true })).toBeVisible();
  await expect(formPanel.getByRole("textbox", { name: "Email" })).toHaveAttribute("aria-invalid", "true");
  await expect(formPanel.getByRole("textbox", { name: "Email" })).toBeFocused();
});

test("validates and submits the multi-step example", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Multi-step" }).click();
  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(formPanel.getByText("required", { exact: true })).toBeVisible();
  await expect(formPanel.getByRole("textbox", { name: "Contact name" })).toBeFocused();

  await formPanel.getByRole("textbox", { name: "Contact name" }).fill("Ava Manager");
  await formPanel.getByRole("textbox", { name: "Contact email" }).fill("ava@example.com");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(formPanel.getByRole("heading", { name: "Project", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(formPanel.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
  await formPanel.getByLabel("Pilot").check();
  await formPanel.getByRole("textbox", { name: "Project summary" }).fill("A small browser proof for the renderer.");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(formPanel.getByText("Example submission received.", { exact: true })).toBeVisible();
  await expect(page.getByTestId("last-envelope")).toContainText('"contact"');
  await expect(page.getByTestId("last-envelope")).toContainText('"project"');
});

test("excludes hidden and conditionally hidden values from normalized output", async ({ page }) => {
  await page.goto("/");

  await completeSinglePageForm(page);
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByTestId("last-envelope")).toContainText('"data"');
  await expect(page.getByTestId("last-envelope")).not.toContainText('"company"');
  await expect(page.getByTestId("last-envelope")).not.toContainText('"source"');
});

test("moves keyboard focus to the first invalid field", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator(".form-panel").getByRole("textbox", { name: "Full name" })).toBeFocused();
});

test("renders the RTL example in a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 });
  await page.goto("/");

  await page.getByRole("button", { name: "RTL" }).click();

  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByRole("heading", { name: "ثبت نام رویداد" })).toBeVisible();
  await expect(page.locator(".form-panel")).toHaveAttribute("dir", "rtl");
  await expect(formPanel.getByRole("textbox", { name: "نام کامل" })).toBeVisible();
});
