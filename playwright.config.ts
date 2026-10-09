import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
/** Set to a deployed URL (e.g. the GitHub Pages mirror) to smoke-test it instead of a local preview. */
const liveBaseURL = process.env.BASE_URL;
const localBaseURL = `http://localhost:${PORT}/code-practice-platform/`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: liveBaseURL ?? localBaseURL,
    locale: "ru-RU",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /account\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/account.json" },
      dependencies: ["setup"],
    },
  ],
  webServer: liveBaseURL
    ? undefined
    : {
        command: `npm run preview -- --port ${PORT} --strictPort`,
        url: localBaseURL,
        reuseExistingServer: !isCI,
      },
});
