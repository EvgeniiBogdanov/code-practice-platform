/** True on macOS, iOS and iPadOS, where shortcuts use ⌘ ⌥ ⇧ ⌃ instead of Ctrl, Alt and Shift. */
export const isApplePlatform = (): boolean =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
