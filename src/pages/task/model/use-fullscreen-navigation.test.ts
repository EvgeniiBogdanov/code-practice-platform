import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  preloadRoute: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => routerMocks.navigate,
  useRouter: () => ({ preloadRoute: routerMocks.preloadRoute }),
}));

import {
  getFullscreenNavigationTarget,
  useFullscreenNavigation,
} from "./use-fullscreen-navigation";

describe("getFullscreenNavigationTarget", () => {
  it("opens a visual React task in split mode by default", () => {
    expect(
      getFullscreenNavigationTarget({
        task: { id: 42, section: "react" },
        tab: "candidate",
        hasVisualComponent: true,
      })
    ).toEqual({
      to: "/open/react/$taskId",
      params: { taskId: "42" },
      search: { tab: "candidate" },
    });
  });

  it("opens a non-visual task in code mode", () => {
    expect(
      getFullscreenNavigationTarget({
        task: { id: "binary-search", section: "algorithms" },
        tab: "solution",
        hasVisualComponent: false,
      })
    ).toEqual({
      to: "/open/algorithms/$taskId",
      params: { taskId: "binary-search" },
      search: { tab: "solution", view: "code" },
    });
  });
});

describe("useFullscreenNavigation", () => {
  beforeEach(() => {
    routerMocks.navigate.mockReset().mockResolvedValue(undefined);
    routerMocks.preloadRoute.mockReset().mockResolvedValue(undefined);
  });

  it("preloads once and navigates without delaying the route change", async () => {
    const input = {
      task: { id: 42, section: "react" as const },
      tab: "candidate" as const,
      hasVisualComponent: true,
    };
    const target = getFullscreenNavigationTarget(input);
    let resolveNavigation: (() => void) | undefined;
    routerMocks.navigate.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveNavigation = resolve;
      })
    );
    const { result } = renderHook(() => useFullscreenNavigation(input));

    act(() => {
      result.current.preloadFullscreen();
      result.current.preloadFullscreen();
    });

    expect(routerMocks.preloadRoute).toHaveBeenCalledTimes(1);
    expect(routerMocks.preloadRoute).toHaveBeenCalledWith(target);

    act(() => {
      result.current.handleToggleFullscreen();
      result.current.handleToggleFullscreen();
    });

    await waitFor(() => {
      expect(result.current.isFullscreenTransitioning).toBe(true);
      expect(routerMocks.navigate).toHaveBeenCalledTimes(1);
    });
    expect(routerMocks.navigate).toHaveBeenCalledWith({
      ...target,
      resetScroll: false,
    });

    await act(async () => {
      resolveNavigation?.();
    });
    expect(result.current.isFullscreenTransitioning).toBe(false);
  });
});
