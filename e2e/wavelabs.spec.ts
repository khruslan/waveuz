import { expect, test } from "@playwright/test";

test("theme, language, calculator and lead modal work", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto("/");
  await page.locator("#loader.out").waitFor({ timeout: 6_000 });
  await expect(page.locator("nav")).toBeVisible();

  await page.getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "RU" }).click();
  await expect(page.getByRole("button", { name: "Связаться" })).toBeVisible();

  await page.locator("#calculator textarea").fill("Demand forecasting platform for retail");
  await page.locator(".calc-sel").nth(1).selectOption("smb");
  await page.getByRole("button", { name: "Сгенерировать коммерческое предложение" }).click();
  await expect(page.locator(".calc-kp-output")).toContainText("КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ");
  await expect(page.locator(".calc-kp-output")).toContainText("$30k - $80k USD");

  await page.locator(".calc-apply-btn").click();
  const modal = page.locator("#modal-overlay.open");
  await expect(modal).toBeVisible();
  await modal.locator('input[name="name"]').fill("Arslan");
  await modal.locator('input[name="contact"]').fill("@arslan");
  await modal.locator('textarea[name="message"]').fill("AI scoring project");
  await modal.locator(".modal-submit").click();
  await expect(modal.locator(".modal-submit")).toHaveText("Sent");
});

test("renders a stable mobile first screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#loader.out").waitFor({ timeout: 6_000 });
  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.locator(".hero-title")).toBeVisible();
  await expect(page.locator(".nav-logo")).toBeVisible();
});
