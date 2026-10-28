import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void): (() => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return (): void => observer.disconnect();
};

const getTheme = (): string => document.documentElement.getAttribute("data-theme") ?? "";

/** The `data-theme` of the page: a diagram drawn with token colours is drawn again when it changes. */
export const useDocumentTheme = (): string => useSyncExternalStore(subscribe, getTheme, () => "");
