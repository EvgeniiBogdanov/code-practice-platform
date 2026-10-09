import { expect, test as setup } from "@playwright/test";

export const ACCOUNT_STATE_PATH = "e2e/.auth/account.json";

// Signs up through the real landing form once; every workspace test reuses the saved storage.
setup("create local account", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Создать локальный аккаунт" }).first().click();

  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill("E2E Tester");
  await dialog.getByRole("button", { name: "Создать локальный аккаунт" }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText("Привет, E2E Tester!")).toBeVisible();
  await page.context().storageState({ path: ACCOUNT_STATE_PATH });
});
