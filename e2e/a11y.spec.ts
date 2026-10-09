import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const THEMES = ["dark", "light"] as const;

// Entrance animations fade content in; axe would measure contrast mid-transition.
test.use({ reducedMotion: "reduce" });

const WORKSPACE_PAGES = [
  { name: "home", path: "home" },
  { name: "section overview", path: "javascript/" },
  { name: "task", path: "javascript/js1" },
];

const setTheme = async (page: Page, theme: (typeof THEMES)[number]): Promise<void> => {
  const root = page.locator("html");
  if ((await root.getAttribute("data-theme")) !== theme) {
    await page.getByRole("button", { name: /Переключить на (светлую|тёмную) тему/ }).click();
  }
  await expect(root).toHaveAttribute("data-theme", theme);
};

/** Blocks only on violations a user would actually hit; minor/moderate are reported in the HTML report. */
const expectNoSeriousViolations = async (page: Page): Promise<void> => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = violations
    .filter(({ impact }) => impact === "serious" || impact === "critical")
    .map(({ id, help, nodes }) => ({
      id,
      help,
      targets: nodes.map(({ target }) => target.join(" ")),
    }));
  expect(blocking).toEqual([]);
};

test.describe("guest", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("landing", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoSeriousViolations(page);
  });
});

for (const theme of THEMES) {
  for (const { name, path } of WORKSPACE_PAGES) {
    test(`${name} (${theme} theme)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("main")).toBeVisible();
      await setTheme(page, theme);
      await expectNoSeriousViolations(page);
    });
  }
}
