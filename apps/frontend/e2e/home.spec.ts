import { expect, test } from "@playwright/test";

test("home page has the starter heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Um frontend pronto para evoluir." })).toBeVisible();
});
