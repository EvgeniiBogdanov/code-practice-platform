import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { UiReveal } from "./UiReveal";
import styles from "./UiReveal.module.css";

describe("UiReveal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows content immediately when IntersectionObserver is unavailable", () => {
    render(
      <UiReveal>
        <p data-testid="reveal">Контент</p>
      </UiReveal>
    );

    expect(screen.getByTestId("reveal")).toHaveClass(styles.visible);
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
    expect(node).not.toHaveClass(styles.visible);
    expect(node).toHaveClass(styles.scale, styles.order2);

    act(() => notify([{ isIntersecting: true }]));

    expect(node).toHaveClass(styles.visible);
    expect(disconnect).toHaveBeenCalled();
  });
});
