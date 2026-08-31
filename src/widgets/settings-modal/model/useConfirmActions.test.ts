import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useConfirmActions } from "./useConfirmActions";

describe("useConfirmActions", () => {
  it("creates reviewActions, uiSettingsActions, and allDataActions", () => {
    const onResetSectionReviews = vi.fn();
    const onResetAllReviews = vi.fn();
    const onResetUISettings = vi.fn();
    const onResetAllData = vi.fn();

    const { result } = renderHook(() =>
      useConfirmActions(
        "javascript",
        "JavaScript",
        onResetSectionReviews,
        onResetAllReviews,
        onResetUISettings,
        onResetAllData
      )
    );

    expect(result.current.reviewActions).toHaveLength(2);
    expect(result.current.uiSettingsActions).toHaveLength(1);
    expect(result.current.allDataActions).toHaveLength(1);

    expect(result.current.uiSettingsActions[0].label).toBe("Сбросить настройки интерфейса");
    result.current.uiSettingsActions[0].onClick();
    expect(onResetUISettings).toHaveBeenCalledTimes(1);

    result.current.allDataActions[0].onClick();
    expect(onResetAllData).toHaveBeenCalledTimes(1);
  });
});
