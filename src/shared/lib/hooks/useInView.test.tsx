import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInView } from "./useInView";

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, "isIntersecting">>) => void;

let callback: ObserverCallback = () => undefined;
const disconnect = vi.fn();

const Probe = ({ once }: { once?: boolean }): React.JSX.Element => {
  const [ref, isInView] = useInView<HTMLDivElement>({ once });
  return (
    <div ref={ref} data-testid="probe">
      {String(isInView)}
    </div>
  );
};

describe("useInView", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: ObserverCallback) {
          callback = cb;
        }
        observe = vi.fn();
        disconnect = disconnect;
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    disconnect.mockClear();
  });

  it("flips to true once the element intersects and stops observing", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe").textContent).toBe("false");

    act(() => callback([{ isIntersecting: true }]));

    expect(screen.getByTestId("probe").textContent).toBe("true");
    expect(disconnect).toHaveBeenCalled();
  });

  it("follows the viewport when `once` is off", () => {
    render(<Probe once={false} />);

    act(() => callback([{ isIntersecting: true }]));
    expect(screen.getByTestId("probe").textContent).toBe("true");

    act(() => callback([{ isIntersecting: false }]));
    expect(screen.getByTestId("probe").textContent).toBe("false");
  });

  it("is in view right away without IntersectionObserver support", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Probe />);
    expect(screen.getByTestId("probe").textContent).toBe("true");
  });
});
