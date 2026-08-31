import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavoriteTreeExpansion } from "./use-favorite-tree-expansion";

describe("useFavoriteTreeExpansion", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("restores collapsed nodes from the current section", () => {
    sessionStorage.setItem(
      "playground_collapsed_favorites_javascript",
      JSON.stringify({ "folder:javascript:Коллекции": true })
    );

    const { result } = renderHook(() => useFavoriteTreeExpansion("javascript"));

    expect(result.current.isExpanded("folder:javascript:Коллекции")).toBe(false);
    expect(result.current.isExpanded("folder:javascript:Типы данных")).toBe(true);
  });

  it("persists toggles and keeps sections isolated", () => {
    const { result } = renderHook(() => useFavoriteTreeExpansion("react"));
    const nodeKey = "folder:react:Хуки";

    act(() => {
      result.current.toggleNode(nodeKey);
    });

    expect(result.current.isExpanded(nodeKey)).toBe(false);
    expect(sessionStorage.getItem("playground_collapsed_favorites_react")).toBe(
      JSON.stringify({ [nodeKey]: true })
    );
    expect(sessionStorage.getItem("playground_collapsed_favorites_javascript")).toBeNull();

    const remounted = renderHook(() => useFavoriteTreeExpansion("react"));
    expect(remounted.result.current.isExpanded(nodeKey)).toBe(false);
  });
});
