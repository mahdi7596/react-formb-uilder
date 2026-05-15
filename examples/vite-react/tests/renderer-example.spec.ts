import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function completeCustomerIntake(page: Page): Promise<void> {
  const formPanel = page.locator(".form-panel");
  await formPanel.getByRole("textbox", { name: "Full name" }).fill("Jane Doe");
  await formPanel.getByRole("textbox", { name: "Work email" }).fill("jane@example.com");
  await formPanel.getByRole("textbox", { name: "Company name" }).fill("Acme Studio");
  await formPanel.getByLabel("What do you want to build?").selectOption("integration");
  await formPanel.getByLabel("This quarter").check();
  await formPanel.getByLabel("CRM").check();
  await formPanel.getByRole("textbox", { name: "Project summary" }).fill("Connect form submissions to our CRM and webhook pipeline.");
  await formPanel.getByLabel("I agree to be contacted about this request").check();
}

test("submits the English production intake and shows normalized output", async ({ page }) => {
  await page.goto("/examples");

  await expect(page.getByRole("heading", { name: "React form builder examples" })).toBeVisible();
  await expect(page.locator(".form-panel").getByRole("heading", { name: "Customer project intake" })).toBeVisible();
  await expect(page.locator(".form-panel").getByRole("heading", { name: "Tell us what you need" })).toBeVisible();

  await completeCustomerIntake(page);
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator(".form-panel").getByRole("heading", { name: "Request received" })).toBeVisible();
  await expect(page.getByTestId("last-envelope")).toContainText('"fullName": "Jane Doe"');
  await expect(page.getByTestId("last-envelope")).toContainText('"type": "integration"');
  await expect(page.getByTestId("last-envelope")).toContainText('"channels"');
  await expect(page.getByTestId("last-envelope")).not.toContainText('"campaign"');
});

test("builder preview uses the real renderer for a production template", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "ساخت و انتشار فرم" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Component palette" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Form canvas" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Inspector" })).toBeVisible();
  await expect(page.locator(".builder-shell")).toHaveAttribute("dir", "rtl");

  await page.getByRole("button", { name: /Preview|پیش‌نمایش/ }).click();
  const preview = page.getByRole("region", { name: "Form preview" });
  await expect(preview.getByRole("heading", { name: "درخواست خود را ثبت کنید" })).toBeVisible();
  await expect(preview.getByLabel("استان")).toBeVisible();
  await expect(preview.getByLabel("پیاده‌سازی")).toBeVisible();

  await page.getByRole("button", { name: /Edit|ویرایش/ }).click();
  await expect(page.getByRole("button", { name: "درخواست خود را ثبت کنید", exact: true })).toBeVisible();
});

test("Persian RTL intake preserves stable submitted option values", async ({ page }) => {
  await page.goto("/examples");
  await page.getByRole("button", { name: "Persian intake" }).click();

  const formPanel = page.locator(".form-panel");
  await expect(formPanel).toHaveAttribute("dir", "rtl");
  await expect(formPanel.getByRole("heading", { name: "فرم دریافت درخواست مشتری" })).toBeVisible();
  await formPanel.getByRole("textbox", { name: "نام و نام خانوادگی" }).fill("مهدی رضایی");
  await formPanel.getByRole("textbox", { name: "شماره موبایل" }).fill("09123456789");
  await formPanel.getByRole("textbox", { name: "ایمیل" }).fill("mahdi@example.com");
  await formPanel.getByLabel("استان").selectOption("tehran");
  await formPanel.getByLabel("شهر").selectOption("tehran");
  await formPanel.getByLabel("پیاده‌سازی").check();
  await formPanel.getByRole("textbox", { name: "توضیح درخواست" }).fill("برای پیاده‌سازی فرم ساز به مشاوره نیاز داریم.");
  await formPanel.getByLabel("با تماس جهت پیگیری موافقم").check();
  await page.getByRole("button", { name: "ارسال" }).click();

  await expect(formPanel.getByRole("heading", { name: "درخواست شما ثبت شد" })).toBeVisible();
  await expect(page.getByTestId("last-envelope")).toContainText('"province": "tehran"');
  await expect(page.getByTestId("last-envelope")).toContainText('"city": "tehran"');
  await expect(page.getByTestId("last-envelope")).toContainText('"type": "implementation"');
});

test("visual logic example hides and requires conditional fields", async ({ page }) => {
  await page.goto("/examples");
  await page.getByRole("button", { name: "Visual logic" }).click();

  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByLabel("Which backend should this connect to?")).toBeHidden();
  await formPanel.getByLabel("Request type").selectOption("integration");
  await expect(formPanel.getByLabel("Which backend should this connect to?")).toBeVisible();
  await formPanel.getByRole("textbox", { name: "Short summary" }).fill("Need integration support.");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(formPanel.getByText("required", { exact: true }).first()).toBeVisible();
  await expect(formPanel.getByLabel("Which backend should this connect to?")).toBeFocused();

  await formPanel.getByLabel("Which backend should this connect to?").fill("NestJS API");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(formPanel.getByRole("heading", { name: "Logic request received" })).toBeVisible();
});

test("renderer-only embed works without mounting the builder workspace", async ({ page }) => {
  await page.goto("/examples");
  await page.getByRole("button", { name: "Renderer-only embed" }).click();

  await expect(page.getByRole("heading", { name: "Public form embed without builder UI" })).toBeVisible();
  await expect(page.locator(".rfb-builder")).toBeHidden();
  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByRole("heading", { name: "Newsletter preference center" })).toBeVisible();
  await formPanel.getByRole("textbox", { name: "Email" }).fill("reader@example.com");
  await formPanel.getByLabel("Product updates").check();
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(formPanel.getByRole("heading", { name: "Preferences saved" })).toBeVisible();
  await expect(page.getByTestId("last-envelope")).toContainText('"topics"');
});

test("saves, publishes, and reviews generated artifacts for the selected template", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Save draft|ذخیره پیش‌نویس/ }).click();
  await expect(page.getByText(/Draft saved|ذخیره شد/).first()).toBeVisible();
  await expect(page.getByText("پیش‌نویس در میزبان نمونه ذخیره شد.")).toBeVisible();

  await expect(page.getByRole("region", { name: "Publish checklist" })).toContainText("0 blockers");
  await page.getByText("Generated artifacts", { exact: true }).click();
  await expect(page.locator(".rfb-artifact-grid").getByText("https://json-schema.org/draft/2020-12/schema", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Publish|انتشار/ }).click();
  await expect(page.getByText("نسخه rev_published_1 منتشر شد.")).toBeVisible();
  await expect(page.getByRole("region", { name: "Revision warnings" })).toContainText("rev_published_1");
});

test("fake server validation errors map to the configured production field", async ({ page }) => {
  await page.goto("/examples");
  await page.locator("#backend-scenario").selectOption("validation_error");
  await completeCustomerIntake(page);
  await page.getByRole("button", { name: "Submit" }).click();

  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByText("The fake backend rejected this value.", { exact: true })).toBeVisible();
  await expect(formPanel.getByRole("textbox", { name: "Work email" })).toHaveAttribute("aria-invalid", "true");
  await expect(formPanel.getByRole("textbox", { name: "Work email" })).toBeFocused();
});

test("multi-step production request validates current step and submits nested data", async ({ page }) => {
  await page.goto("/examples");
  await page.getByRole("button", { name: "Multi-step request" }).click();

  const formPanel = page.locator(".form-panel");
  await expect(formPanel.getByRole("heading", { name: "Contact", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(formPanel.getByText("required", { exact: true }).first()).toBeVisible();
  await expect(formPanel.getByRole("textbox", { name: "Full name" })).toBeFocused();

  await formPanel.getByRole("textbox", { name: "Full name" }).fill("Ava Manager");
  await formPanel.getByRole("textbox", { name: "Work email" }).fill("ava@example.com");
  await formPanel.getByRole("textbox", { name: "Company name" }).fill("Northwind");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(formPanel.getByRole("heading", { name: "Scope", exact: true })).toBeVisible();
  await formPanel.getByLabel("What do you want to build?").selectOption("new_form");
  await formPanel.getByLabel("This month").check();
  await formPanel.getByRole("textbox", { name: "Project summary" }).fill("Build an intake form for sales operations.");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(formPanel.getByRole("heading", { name: "Project request received" })).toBeVisible();
  await expect(page.getByTestId("last-envelope")).toContainText('"contact"');
  await expect(page.getByTestId("last-envelope")).toContainText('"request"');
});

test("themed focus remains visible and reduced motion is honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const saveDraft = page.getByRole("button", { name: /Save draft|ذخیره پیش‌نویس/ });
  await saveDraft.focus();
  await expect(saveDraft).toBeFocused();

  const outlineStyle = await saveDraft.evaluate((element) => getComputedStyle(element).outlineStyle);
  const outlineWidth = await saveDraft.evaluate((element) => getComputedStyle(element).outlineWidth);
  const transitionDuration = await page.locator(".rfb-builder .rfb-node").first().evaluate((element) =>
    getComputedStyle(element).transitionDuration
  );

  expect(outlineStyle).not.toBe("none");
  expect(outlineWidth).not.toBe("0px");
  expect(["0.01ms", "0.00001s", "1e-05s"]).toContain(transitionDuration);
});
