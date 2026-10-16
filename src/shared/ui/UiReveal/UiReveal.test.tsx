import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { UiReveal } from "./UiReveal";
import styles from "./UiReveal.module.css";

const { animate } = vi.hoisted(() => ({ animate: vi.fn(() => ({ stop: vi.fn() })) }));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  animate,
}));

describe("UiReveal", () => {
  beforeEach(() => {
    animate.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("springs content in immediately when IntersectionObserver is unavailable", () => {
    render(
      <UiReveal>
        <p data-testid="reveal">Контент</p>
      </UiReveal>
    );

    expect(animate).toHaveBeenCalledWith(
      screen.getByTestId("reveal"),
      expect.objectContaining({ opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)" }),
      expect.objectContaining({ type: "spring", delay: 0 })
    );
  });

  it("reveals content once it enters the viewport", () => {
    let notify: (
      entries: Array<Pick<IntersectionObserverEntry, "isIntersecting">>
    ) => void = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: typeof notify) {
          notify = callback;
        }
        observe(): void {}
        disconnect = disconnect;
      }
    );

    render(
      <UiReveal variant="scale" order={2}>
        <p data-testid="reveal">Контент</p>
      </UiReveal>
    );
    const node = screen.getByTestId("reveal");
    expect(node).toHaveClass(styles.reveal, styles.scale);
    expect(animate).not.toHaveBeenCalled();

    act(() => notify([{ isIntersecting: true }]));

    expect(animate).toHaveBeenCalledWith(
      node,
      expect.objectContaining({ opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)" }),
      expect.objectContaining({ delay: expect.closeTo(0.16) })
    );
    expect(disconnect).toHaveBeenCalled();
  });
});
