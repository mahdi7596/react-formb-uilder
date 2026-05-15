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
  await page.getByRole("textbox", { name: /Label|برچسب/, exact: true }).fill("Work email");
  await expect(page.getByRole("button", { name: "Work email", exact: true })).toBeVisible();

  await page.getByRole("tab", { name: /Data|داده/ }).click();
  await page.getByLabel(/Submitted path|مسیر ارسالی/).fill("__proto__.polluted");
  await expect(page.getByText("Submitted path is invalid or unsafe.").first()).toBeVisible();

  await page.getByLabel(/Submitted path|مسیر ارسالی/).fill("workEmail");
  await page.getByRole("button", { name: /Preview|پیش‌نمایش/ }).click();
  await expect(page.getByRole("region", { name: "Form preview" })).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await page.getByLabel("Work email").fill("creator@example.com");
  await page.getByRole("button", { name: /Edit|ویرایش/ }).click();
  await expect(page.getByRole("button", { name: "Work email", exact: true })).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("creator can author dropdown options with structured controls and preview them", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add Dropdown" }).click();
  await expect(page.getByRole("button", { name: "Dropdown", exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: /Label|برچسب/, exact: true }).fill("Plan");

  await page.getByLabel("Option 1 label").fill("Starter");
  await page.getByLabel("Option 1 submitted value").fill("starter");
  await page.getByLabel("Option 2 label").fill("Growth");
  await page.getByLabel("Option 2 submitted value").fill("growth");
  await page.getByRole("button", { name: "Add option" }).click();
  await page.getByLabel("Option 3 label").fill("Enterprise");
  await page.getByLabel("Option 3 submitted value").fill("enterprise");
  await page.getByRole("button", { name: "Move option 3 up" }).click();
  await page.getByLabel("Bulk add options").fill("Agency=agency\nInternal=internal");
  await page.getByRole("button", { name: "Add pasted options" }).click();
  await expect(page.locator("input[value='Agency']")).toBeVisible();
  await expect(page.locator("input[value='internal']")).toBeVisible();

  await page.getByRole("button", { name: /Preview|پیش‌نمایش/ }).click();
  const planSelect = page.getByLabel("Plan");
  await expect(planSelect).toBeVisible();
  await expect(planSelect).toContainText("Starter");
  await expect(planSelect).toContainText("Enterprise");
  await expect(planSelect).toContainText("Agency");
});

test("creator can author content and layout blocks then preview the real renderer", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add Welcome screen" }).click();
  await page.getByRole("textbox", { name: /Label|برچسب/, exact: true }).fill("Welcome to intake");
  await page.getByLabel(/Description|توضیح/).fill("This form collects the details we need.");

  await page.getByRole("button", { name: "Add Heading" }).click();
  await page.getByRole("textbox", { name: /Label|برچسب/, exact: true }).fill("Contact details");
  await page.getByLabel("Heading level").selectOption("2");

  await page.getByRole("button", { name: "Add Paragraph" }).click();
  await page.getByLabel("Body text").fill("Use an email address that you check regularly.");

  await page.getByRole("button", { name: "Add Image" }).click();
  await page.getByLabel("Image URL").fill("https://example.test/banner.png");
  await page.getByLabel("Alt text").fill("Team banner");
  await page.getByLabel("Caption").fill("Our support team");

  await page.getByRole("tab", { name: /Data|داده/ }).click();
  await expect(page.getByText("This block does not create submitted data.")).toBeVisible();
  await expect(page.getByLabel(/Submitted path|مسیر ارسالی/)).toBeHidden();

  await page.getByRole("button", { name: "Add Ending screen" }).click();
  await page.getByRole("textbox", { name: /Label|برچسب/, exact: true }).fill("Request received");

  await page.getByRole("button", { name: /Preview|پیش‌نمایش/ }).click();
  await expect(page.getByRole("region", { name: "Form preview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome to intake" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contact details", level: 2 })).toBeVisible();
  await expect(page.getByText("Use an email address that you check regularly.")).toBeVisible();
  await expect(page.getByRole("img", { name: "Team banner" })).toBeVisible();
  await expect(page.getByText("Our support team")).toBeVisible();
});

test("creator can build validation and simple logic without writing JSON", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Full name", exact: true }).click();
  await page.getByRole("tab", { name: /Validation|اعتبارسنجی/ }).click();
  await page.getByLabel("Minimum characters").fill("2");
  await page.getByLabel("Maximum characters").fill("80");
  await expect(page.getByLabel("Minimum characters")).toHaveValue("2");
  await expect(page.getByLabel("Maximum characters")).toHaveValue("80");

  await page.getByRole("button", { name: "Add Email" }).click();
  await page.getByRole("textbox", { name: /Label|برچسب/, exact: true }).fill("Work email");
  await page.getByRole("tab", { name: /Logic|منطق/ }).click();
  await page.getByLabel(/Visibility behavior/).selectOption("showWhen");
  await page.getByLabel("Operator").selectOption("notEmpty");
  await expect(page.getByLabel("Read-only condition JSON")).toContainText('"op": "notEmpty"');

  await page.getByLabel("Require only when conditions match").check();
  await expect(page.getByLabel("Read-only condition JSON")).toContainText('"requiredWhen"');
  await expect(page.getByText("Phase 16 supports show, hide, and conditional requiredness.")).toBeVisible();
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
  await page.getByRole("button", { name: /Preview|پیش‌نمایش/ }).click();
  await expect(page.getByRole("region", { name: "Form preview" })).toBeVisible();
});
