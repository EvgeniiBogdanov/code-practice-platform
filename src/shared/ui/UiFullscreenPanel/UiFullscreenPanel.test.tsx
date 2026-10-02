import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UiFullscreenPanel } from "./UiFullscreenPanel";

const methods = ["close", "showModal"] as const;
const descriptors = methods.map((name) =>
  Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name)
);
const nativeDescriptor = Object.getOwnPropertyDescriptor(document, "startViewTransition");
const animateDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "animate");
const animate = vi.fn(() => ({ finished: Promise.resolve(), cancel: vi.fn() }));

beforeEach(() => {
  methods.forEach((name) => {
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: vi.fn(),
    });
  });
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: animate,
  });
  animate.mockClear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false }))
  );
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
});
afterEach(() => {
  cleanup();
  methods.forEach((name, index) => {
    const descriptor = descriptors[index];
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
  });
  if (nativeDescriptor) Object.defineProperty(document, "startViewTransition", nativeDescriptor);
  else Reflect.deleteProperty(document, "startViewTransition");
  if (animateDescriptor) Object.defineProperty(HTMLElement.prototype, "animate", animateDescriptor);
  else Reflect.deleteProperty(HTMLElement.prototype, "animate");
  vi.unstubAllGlobals();
});

const renderPanel = (): void => {
  render(
    <UiFullscreenPanel label="Рабочая область">
      {({ isFullscreen, isTransitioning, toggleFullscreen }) => (
        <>
          <button disabled={isTransitioning} onClick={toggleFullscreen}>
            {isFullscreen ? "Свернуть" : "Развернуть"}
          </button>
          <textarea aria-label="Код" defaultValue="const result = 42;" />
          <canvas data-testid="scene" />
        </>
      )}
    </UiFullscreenPanel>
  );
};

describe("persistent fullscreen panel", () => {
  it("animates in browsers without View Transitions and preserves editor selection and canvas", async () => {
    renderPanel();
    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Код" });
    const scene = screen.getByTestId("scene");
    editor.setSelectionRange(6, 12);
    fireEvent.click(screen.getByRole("button", { name: "Развернуть" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Свернуть" })).toBeEnabled());
    expect(animate).toHaveBeenCalledTimes(2);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Развернуть" })).toBeEnabled());
    expect(screen.getByRole("textbox", { name: "Код" })).toBe(editor);
    expect(editor.selectionStart).toBe(6);
    expect(editor.selectionEnd).toBe(12);
    expect(screen.getByTestId("scene")).toBe(scene);
    expect(animate).toHaveBeenCalledTimes(3);
  });

  it("keeps controls locked until the native transition finishes", async () => {
    let finish: (() => void) | undefined;
    const finished = new Promise<void>((resolve) => {
      finish = resolve;
    });
    const native = vi.fn((options: { update: () => void }) => {
      options.update();
      return { finished };
    });
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: native });
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Развернуть" }));
    expect(screen.getByRole("button", { name: "Свернуть" })).toBeDisabled();
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(native).toHaveBeenCalledOnce();
    finish?.();
    await waitFor(() => expect(screen.getByRole("button", { name: "Свернуть" })).toBeEnabled());
  });

  it("honors reduced motion while preserving the inline footprint", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true }))
    );
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Развернуть" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Свернуть" })).toBeEnabled());
    // Only the zero-duration layout reservation runs, without a moving animation.
    expect(animate).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Свернуть" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Развернуть" })).toBeEnabled());
    expect(animate).toHaveBeenCalledTimes(1);
  });
});
