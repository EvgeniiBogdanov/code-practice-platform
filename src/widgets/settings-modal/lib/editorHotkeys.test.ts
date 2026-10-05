import { describe, expect, it } from "vitest";
import { EDITOR_HOTKEY_GROUPS, resolveHotkeyKeys } from "./editorHotkeys";

describe("resolveHotkeyKeys", () => {
  it("shows Ctrl, Alt and Shift on Windows and Linux", () => {
    expect(resolveHotkeyKeys({ keys: ["Mod", "Shift", "K"], description: "" }, false)).toEqual([
      "Ctrl",
      "Shift",
      "K",
    ]);
  });

  it("uses Apple symbols and keeps other keys as written", () => {
    expect(
      resolveHotkeyKeys({ keys: ["Mod", "Shift", "Alt", "Ctrl", "Enter"], description: "" }, true)
    ).toEqual(["⌘", "⇧", "⌥", "⌃", "Enter"]);
  });

  it("prefers the Apple variant only on Apple platforms", () => {
    const redo = { keys: ["Ctrl", "Y"], macKeys: ["Mod", "Shift", "Z"], description: "" };
    expect(resolveHotkeyKeys(redo, false)).toEqual(["Ctrl", "Y"]);
    expect(resolveHotkeyKeys(redo, true)).toEqual(["⌘", "⇧", "Z"]);
  });
});

describe("EDITOR_HOTKEY_GROUPS", () => {
  it("has titled, non-empty groups with described shortcuts", () => {
    for (const group of EDITOR_HOTKEY_GROUPS) {
      expect(group.title).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(item.keys.length).toBeGreaterThan(0);
        expect(item.description.length).toBeGreaterThan(3);
      }
    }
  });

  it.each([false, true])(
    "never lists one combination twice within a group (apple: %s)",
    (apple) => {
      for (const group of EDITOR_HOTKEY_GROUPS) {
        const combos = group.items.map((item) => resolveHotkeyKeys(item, apple).join("+"));
        expect(new Set(combos).size, group.title).toBe(combos.length);
      }
    }
  );
});
