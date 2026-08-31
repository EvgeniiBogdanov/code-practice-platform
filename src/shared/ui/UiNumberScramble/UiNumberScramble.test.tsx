import { render, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { UiNumberScramble } from "./UiNumberScramble";

describe("UiNumberScramble", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders exact value immediately when data is already cached without re-scrambling", () => {
    const { container } = render(<UiNumberScramble value={85} suffix="%" />);
    expect(container.textContent).toBe("85%");
  });

  it("animates and settles on new value when value prop updates", () => {
    const { container, rerender } = render(
      <UiNumberScramble value={0} suffix="%" duration={100} />
    );

    expect(container.textContent).toBe("0%");

    rerender(<UiNumberScramble value={85} suffix="%" duration={100} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(container.textContent).toBe("85%");
  });

  it("renders exact value for prefers-reduced-motion", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<UiNumberScramble value={42} />);
    expect(container.textContent).toBe("42");
  });
});
