import { expect, test as base } from "@playwright/test";

/**
 * GitHub Pages serves deep links through the SPA fallback `404.html` with status 404,
 * so Chrome logs the document load as an error although the app renders fine.
 * Only that main-frame document is excused — a 404 for any asset still fails the test.
 */
const isSpaFallbackDocument = (text: string, url: string, documents: Set<string>): boolean =>
  text.startsWith("Failed to load resource") && documents.has(url);

/** Fails any test whose page throws or logs `console.error`. */
export const test = base.extend<{ failOnBrowserErrors: void }>({
  failOnBrowserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      const documents = new Set<string>();
      page.on("request", (request) => {
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
          documents.add(request.url());
        }
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        if (isSpaFallbackDocument(message.text(), message.location().url, documents)) return;
        errors.push(message.text());
      });
      await use();
      expect(errors, "browser errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
