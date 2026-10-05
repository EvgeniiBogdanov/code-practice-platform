import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCaretCoordinates } from "../../lib/caret-coordinates";
import { EditorDecorations } from "./EditorDecorations";

vi.mock("../../lib/caret-coordinates", () => ({ getCaretCoordinates: vi.fn() }));

describe("EditorDecorations", () => {
  let resize: () => void = () => undefined;

  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe = vi.fn();
        disconnect = vi.fn();
      }
    );
    vi.mocked(getCaretCoordinates).mockReturnValue({
      top: 10,
      left: 20,
      lineHeight: 21,
      lineBottom: 31,
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("measures again when the editor width changes without any text change", () => {
    const textarea = document.createElement("textarea");
    let width = 500;
    Object.defineProperty(textarea, "clientWidth", { get: () => width });
    render(
      <EditorDecorations
        carets={[]}
        brackets={[1, 4]}
        textareaRef={{ current: textarea }}
        layoutKey="k"
      />
    );
    const measured = vi.mocked(getCaretCoordinates).mock.calls.length;

    width = 300;
    act(() => resize());

    expect(vi.mocked(getCaretCoordinates).mock.calls.length).toBeGreaterThan(measured);
  });

  it("renders a mark per bracket and caret", () => {
    const textarea = document.createElement("textarea");
    const { container } = render(
      <EditorDecorations
        carets={[2]}
        brackets={[1, 4]}
        textareaRef={{ current: textarea }}
        layoutKey="k"
      />
    );
    expect(container.querySelectorAll("span")).toHaveLength(3);
  });
});
