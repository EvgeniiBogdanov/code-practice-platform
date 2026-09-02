import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSettingsModal } from "./useSettingsModal";
import { useReviewStore } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { useUIStore } from "@/entities/ui-state";

vi.mock("./useSettingsActiveSection", () => ({
  useSettingsActiveSection: () => ({
    activeSection: "home",
    sectionName: "Вся платформа",
    currentSectionTasks: [],
  }),
}));

describe("useSettingsModal - handleResetAllData", () => {
  beforeEach(() => {
    useReviewStore.setState({
      handleResetReviews: vi.fn().mockResolvedValue(undefined),
      resetAssistantName: vi.fn().mockResolvedValue(undefined),
    });
    useProgressStore.setState({
      handleFullReset: vi.fn().mockResolvedValue(undefined),
    });
    useUIStore.setState({
      settingsModalOpen: true,
      resetUISettings: vi.fn(),
    });
  });

  it("calls resetAssistantName when handleResetAllData is triggered", async () => {
    const resetAssistantSpy = vi.fn().mockResolvedValue(undefined);
    useReviewStore.setState({ resetAssistantName: resetAssistantSpy });

    const { result } = renderHook(() => useSettingsModal());

    await act(async () => {
      await result.current.handleResetAllData();
    });

    expect(resetAssistantSpy).toHaveBeenCalledTimes(1);
  });
});
