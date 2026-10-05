/**
 * Decides which bundle boots for the current URL: the public landing or the workspace.
 * Paths below are "app paths" — relative to Vite's `base` (`/` or `/code-practice-platform/`).
 */
export const LANDING_PATH = "/";
export const WORKSPACE_HOME_PATH = "/home";
export const REDIRECT_SEARCH_PARAM = "redirect";

export interface BrowserLocation {
  pathname: string;
  search: string;
  hash: string;
}

export type EntryTarget =
  { kind: "landing"; url: string; redirectTo: string | null } | { kind: "workspace"; url: string };

const trimBase = (base: string): string => base.replace(/\/+$/, "");

const LANDING_ALIASES = new Set([LANDING_PATH, "/index.html"]);

/** `/code-practice-platform/javascript/js70` → `/javascript/js70` */
export const toAppPath = (pathname: string, base: string): string => {
  const prefix = trimBase(base);
  const isPrefixed = prefix !== "" && (pathname === prefix || pathname.startsWith(`${prefix}/`));
  const path = isPrefixed ? pathname.slice(prefix.length) : pathname;
  return path || LANDING_PATH;
};

/** `/javascript/js70` → `/code-practice-platform/javascript/js70` */
export const toBrowserPath = (appPath: string, base: string): string =>
  `${trimBase(base)}${appPath}`;

/** Accepts only same-origin workspace paths so `?redirect=` cannot be used as an open redirect. */
export const sanitizeRedirectPath = (value: string | null): string | null => {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }

  const origin = "https://workspace.invalid";
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || LANDING_ALIASES.has(url.pathname)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

export const resolveEntryTarget = (
  location: BrowserLocation,
  base: string,
  hasAccount: boolean
): EntryTarget => {
  const appPath = toAppPath(location.pathname, base);
  const currentUrl = `${location.pathname}${location.search}${location.hash}`;

  if (!LANDING_ALIASES.has(appPath)) {
    if (hasAccount) return { kind: "workspace", url: currentUrl };

    // Deep link without an account: show the landing and come back after sign-up.
    const redirectTo = `${appPath}${location.search}${location.hash}`;
    const query = new URLSearchParams({ [REDIRECT_SEARCH_PARAM]: redirectTo });
    return {
      kind: "landing",
      url: `${toBrowserPath(LANDING_PATH, base)}?${query.toString()}`,
      redirectTo,
    };
  }

  const redirectTo = sanitizeRedirectPath(
    new URLSearchParams(location.search).get(REDIRECT_SEARCH_PARAM)
  );

  if (hasAccount) {
    return { kind: "workspace", url: toBrowserPath(redirectTo ?? WORKSPACE_HOME_PATH, base) };
  }
  return { kind: "landing", url: currentUrl, redirectTo };
};
