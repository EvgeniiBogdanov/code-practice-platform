import { expect, test } from "./fixtures";

test.describe("guest", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("landing renders the hero and sign-up CTA", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Практика");
    await expect(
      page.getByRole("button", { name: "Создать локальный аккаунт" }).first()
    ).toBeVisible();
  });
});

test.describe("workspace", () => {
  test("home dashboard lists every practice section", async ({ page }) => {
    await page.goto("home");
    for (const section of ["JavaScript", "TypeScript", "React"]) {
      await expect(page.getByRole("heading", { name: section, level: 3 })).toBeVisible();
    }
  });

  test("section → group → task navigation", async ({ page }) => {
    await page.goto("javascript/");
    await page.getByRole("link", { name: /Циклы/ }).click();
    await expect(page.getByRole("heading", { name: "Циклы", level: 1 })).toBeVisible();

    await page.getByRole("main").getByRole("link", { name: /^1\. / }).first().click();
    await expect(page).toHaveURL(/\/javascript\/js1$/);
    await expect(page.getByRole("tab", { name: "Задача" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("deep link opens a task and runs user code", async ({ page }) => {
    await page.goto("javascript/js1");
    const editor = page.getByRole("textbox", { name: "Редактор кода" });
    await editor.fill('console.log("e2e-" + (40 + 2));');
    await page.getByRole("button", { name: "Запустить код" }).click();
    await expect(page.locator(".xterm-rows")).toContainText("e2e-42");
  });

  test("React task compiles user code and renders it in the sandbox", async ({ page }) => {
    await page.goto("react/w1");
    await page
      .getByRole("textbox", { name: "Редактор кода" })
      .fill("export default function App() {\n  return <h1>e2e-react-{40 + 2}</h1>;\n}");
    await page.getByRole("button", { name: "Просмотр UI песочницы" }).click();
    await expect(
      page.frameLocator('iframe[title^="Preview"]').getByRole("heading", { name: "e2e-react-42" })
    ).toBeVisible();
  });

  test("theme toggle switches and persists across reloads", async ({ page }) => {
    await page.goto("home");
    const root = page.locator("html");
    const initial = await root.getAttribute("data-theme");
    await page.getByRole("button", { name: /Переключить на (светлую|тёмную) тему/ }).click();
    await expect(root).not.toHaveAttribute("data-theme", initial ?? "");

    const toggled = await root.getAttribute("data-theme");
    await page.reload();
    await expect(root).toHaveAttribute("data-theme", toggled ?? "");
  });

  test("unknown route shows the not-found page", async ({ page }) => {
    await page.goto("definitely-missing-route");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/definitely-missing-route/);
  });
});
