import { expect, test } from "./fixtures";

test.describe("skill map", () => {
  test("an unsolved task turns its skill into a weak spot that leads back to the task", async ({
    page,
  }) => {
    await page.goto("javascript/js150");
    await expect(
      page.getByRole("link", { name: /^Навык «this и контекст», 0%, не начат/ })
    ).toBeVisible();

    await page.getByRole("button", { name: "Не решено", exact: true }).click();
    await expect(
      page.getByRole("link", { name: /^Навык «this и контекст», \d+%, слабое место/ })
    ).toBeVisible();

    await page.getByRole("link", { name: /^Навык «this и контекст»/ }).click();
    await expect(page).toHaveURL(/\/javascript\/skills\?skill=js\.this$/);
    await expect(page.getByRole("heading", { name: "Подтянуть сейчас", level: 2 })).toBeVisible();

    const panel = page.getByRole("region", { name: "this и контекст" });
    await expect(panel.getByText("1 задача отмечена «не решено»")).toBeVisible();
    await panel.getByRole("link", { name: /^Практиковать:/ }).click();
    await expect(page).toHaveURL(/\/javascript\/js150$/);
  });

  test("the graph selects a skill and the list shows the same route", async ({ page }) => {
    await page.goto("algorithms/skills");
    // The map stays inside its section, like favorites: section breadcrumb and section sidebar.
    await expect(page.getByRole("navigation", { name: "Хлебные крошки Finder" })).toContainText(
      "Карта навыков"
    );
    await expect(page.getByRole("button", { name: "Карта навыков" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await page.getByRole("button", { name: /^Sliding Window: 0%, не начат$/ }).click();
    await expect(page.getByRole("region", { name: "Sliding Window" })).toBeVisible();
    await expect(page).toHaveURL(/skill=algo\.sliding-window/);

    await page.getByRole("button", { name: "Список", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Основа", level: 3 })).toBeVisible();
    await expect(page.getByRole("button", { name: /Sliding Window/, pressed: true })).toBeVisible();
  });
});
