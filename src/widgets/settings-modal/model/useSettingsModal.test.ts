import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSettingsModal } from "./useSettingsModal";
import { useReviewStore } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { useUIStore } from "@/entities/ui-state";

const mockSectionState = vi.hoisted(() => ({
  activeSection: "home",
  sectionName: "Вся платформа",
  currentSectionTasks: [{ id: "task-1" }, { id: "task-2" }],
}));

vi.mock("./useSettingsActiveSection", () => ({
  useSettingsActiveSection: () => mockSectionState,
}));

describe("useSettingsModal - Resets", () => {
  const resetReviewsSpy = vi.fn().mockResolvedValue(undefined);
  const resetAssistantSpy = vi.fn().mockResolvedValue(undefined);
  const fullResetSpy = vi.fn().mockResolvedValue(undefined);
  const resetUISpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSectionState.activeSection = "home";
    mockSectionState.sectionName = "Вся платформа";
    mockSectionState.currentSectionTasks = [{ id: "task-1" }, { id: "task-2" }];

    useReviewStore.setState({
      handleResetReviews: resetReviewsSpy,
      resetAssistantName: resetAssistantSpy,
    });
    useProgressStore.setState({
      handleFullReset: fullResetSpy,
    });
    useUIStore.setState({
      settingsModalOpen: true,
      resetUISettings: resetUISpy,
    });
  });

  it("calls resetAssistantName, handleFullReset, and handleResetReviews when handleResetAllData is triggered", async () => {
    const { result } = renderHook(() => useSettingsModal());

    await act(async () => {
      await result.current.handleResetAllData();
    });

    expect(fullResetSpy).toHaveBeenCalledWith("all");
    expect(resetReviewsSpy).toHaveBeenCalledWith("all");
    expect(resetAssistantSpy).toHaveBeenCalledTimes(1);
    expect(resetUISpy).toHaveBeenCalledTimes(1);
    expect(result.current.resetAllConfirmOpen).toBe(false);
  });

  it("calls both handleResetReviews and handleFullReset with 'all' when handleResetAllReviews is triggered", async () => {
    const { result } = renderHook(() => useSettingsModal());

    act(() => {
      result.current.setResetReviewsConfirmOpen(true);
    });
    expect(result.current.resetReviewsConfirmOpen).toBe(true);

    await act(async () => {
      await result.current.handleResetAllReviews();
    });

    expect(resetReviewsSpy).toHaveBeenCalledWith("all");
    expect(fullResetSpy).toHaveBeenCalledWith("all");
    expect(result.current.resetReviewsConfirmOpen).toBe(false);
  });

  it("calls both handleResetReviews and handleFullReset with section task ids when handleResetSectionReviews is triggered", async () => {
    mockSectionState.activeSection = "javascript";
    mockSectionState.sectionName = "JavaScript";
    mockSectionState.currentSectionTasks = [{ id: "js-1" }, { id: "js-2" }];

    const { result } = renderHook(() => useSettingsModal());

    act(() => {
      result.current.setResetReviewsConfirmOpen(true);
    });

    await act(async () => {
      await result.current.handleResetSectionReviews();
    });

    expect(resetReviewsSpy).toHaveBeenCalledWith("section", ["js-1", "js-2"]);
    expect(fullResetSpy).toHaveBeenCalledWith("section", ["js-1", "js-2"]);
    expect(result.current.resetReviewsConfirmOpen).toBe(false);
  });

  it("does not reset section reviews if activeSection is 'home'", async () => {
    mockSectionState.activeSection = "home";

    const { result } = renderHook(() => useSettingsModal());

    await act(async () => {
      await result.current.handleResetSectionReviews();
    });

    expect(resetReviewsSpy).not.toHaveBeenCalled();
    expect(fullResetSpy).not.toHaveBeenCalled();
  });
});

