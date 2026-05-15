import { expect, test, type Locator, type Page } from "@playwright/test";

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
  await expect(page.getByRole("button", { name: "Work email", exact: true })).toBeVisible();

  await page.getByRole("tab", { name: "Data" }).click();
  await page.getByLabel("Submitted path").fill("__proto__.polluted");
  await expect(page.getByText("Submitted path is invalid or unsafe.").first()).toBeVisible();

  await page.getByLabel("Submitted path").fill("workEmail");
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByRole("region", { name: "Form preview" })).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await page.getByLabel("Work email").fill("creator@example.com");
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByRole("button", { name: "Work email", exact: true })).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("creator can drag from palette, reorder canvas, and undo redo drag edits", async ({ page, isMobile }) => {
  test.skip(isMobile, "pointer drag is covered on desktop; mobile keeps keyboard alternatives available");
  await page.goto("/");

  await dragByMouse(page, page.getByRole("button", { name: "Drag Email" }), page.getByLabel("Drop after Full name"));
  await expect(page.getByRole("button", { name: "Email", exact: true })).toBeVisible();
  await expect(page.getByLabel("Form canvas").getByText("Email inserted at position 2.")).toBeVisible();
  await expect(page.getByText("email input preview")).toBeVisible();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("button", { name: "Email", exact: true })).toBeHidden();
  await page.getByRole("button", { name: "Redo" }).click();
  await expect(page.getByRole("button", { name: "Email", exact: true })).toBeVisible();

  await dragByMouse(
    page,
    page.getByRole("article", { name: "Field Email" }).getByRole("button", { name: "Drag Email" }),
    page.getByRole("article", { name: "Field Full name" })
  );
  await expect(page.locator(".rfb-node .rfb-node-label")).toHaveText(["Email", "Full name"]);

  await expect(page.getByRole("button", { name: "Undo" })).not.toBeDisabled();
});

test("invalid pointer drop is recoverable and preserves schema", async ({ page, isMobile }) => {
  test.skip(isMobile, "pointer invalid-drop recovery is covered on desktop");
  await page.goto("/");

  await dragByMouse(page, page.getByRole("button", { name: "Drag Email" }), page.getByRole("banner", { name: "Builder command bar" }));
  await expect(page.getByLabel("Form canvas").getByText("No drop target is active.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Email", exact: true })).toBeHidden();
  await expect(page.getByText("1 nodes in this form.")).toBeVisible();
});

async function dragByMouse(page: Page, source: Locator, target: Locator): Promise<void> {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) {
    throw new Error("Cannot drag because source or target is not visible.");
  }
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 18 });
  await page.mouse.up();
}

test("keyboard insertion and movement alternatives stay command backed", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add Email" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Email inserted.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Email", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Email", exact: true }).click();
  await page.getByRole("button", { name: "Move field up" }).last().click();
  await expect(page.getByText("Email moved up.")).toBeVisible();
  await expect(page.locator(".rfb-node .rfb-node-label")).toHaveText(["Email", "Full name"]);

  await page.getByRole("button", { name: "Move field up" }).first().click();
  await expect(page.getByText("Email cannot move up.")).toBeVisible();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Undo complete.")).toBeVisible();
  await page.getByRole("button", { name: "Redo" }).click();
  await expect(page.getByText("Redo complete.")).toBeVisible();
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
