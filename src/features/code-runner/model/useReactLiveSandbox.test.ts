import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TaskSourceFile } from "@/shared/lib/code-runners";
import { PREVIEW_REBUILD_DELAY_MS, useReactLiveSandbox } from "./useReactLiveSandbox";

const app = (label: string): TaskSourceFile[] => [
  { name: "App.jsx", code: `export default function App() { return <p>${label}</p>; }` },
  { name: "Other.jsx", code: `export default function Other() { return <p>other</p>; }` },
];

describe("useReactLiveSandbox", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("rebuilds the preview after typing pauses, not on every edit", () => {
    const { result, rerender } = renderHook(
      ({ files }) => useReactLiveSandbox({ files, currentCode: files[0].code }),
      { initialProps: { files: app("first") } }
    );
    expect(result.current.srcDoc).toContain("first");

    rerender({ files: app("second") });
    rerender({ files: app("third") });
    expect(result.current.srcDoc).toContain("first");

    act(() => vi.advanceTimersByTime(PREVIEW_REBUILD_DELAY_MS));
    expect(result.current.srcDoc).toContain("third");
  });

  it("shows another file at once", () => {
    const files = app("first");
    const { result, rerender } = renderHook(
      ({ activeFileIdx, currentCode }) =>
        useReactLiveSandbox({ files, activeFileIdx, currentCode }),
      { initialProps: { activeFileIdx: 0, currentCode: files[0].code } }
    );
    rerender({ activeFileIdx: 1, currentCode: "export default () => <p>unsaved edit</p>;" });
    expect(result.current.srcDoc).toContain("unsaved edit");
  });
});
