import { expect, test as base } from "@playwright/test";

/** Fails any test whose page throws or logs `console.error`. */
export const test = base.extend<{ failOnBrowserErrors: void }>({
  failOnBrowserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await use();
      expect(errors, "browser errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
