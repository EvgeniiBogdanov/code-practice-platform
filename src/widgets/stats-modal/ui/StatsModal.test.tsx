import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { StatsModal } from "./StatsModal";

const mockSetStatsModalOpen = vi.fn();
let mockIsOpen = true;

vi.mock("../model/useStatsModalController", () => ({
  useStatsModalController: () => ({
    isOpen: mockIsOpen,
    setIsOpen: mockSetStatsModalOpen,
    statsData: {
      taskList: [],
      sectionName: "JavaScript",
      section: "javascript",
    },
    modalTitle: "Статистика повторений (JavaScript)",
  }),
}));

vi.mock("@/features/spaced-repetition", () => ({
  SpacedRepetitionSection: ({
    inModal,
    onCloseModal,
  }: {
    inModal?: boolean;
    onCloseModal?: () => void;
  }) => (
    <div data-testid="spaced-repetition-section" data-in-modal={inModal}>
      <span>Раздел повторений</span>
      <button type="button" onClick={onCloseModal}>
        Закрыть
      </button>
    </div>
  ),
}));

describe("StatsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOpen = true;
  });

  it("renders modal and SpacedRepetitionSection when isOpen is true", () => {
    render(<StatsModal />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const section = screen.getByTestId("spaced-repetition-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("data-in-modal", "true");
  });

  it("does not render dialog content when isOpen is false", () => {
    mockIsOpen = false;
    render(<StatsModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("spaced-repetition-section")).not.toBeInTheDocument();
  });

  it("calls setIsOpen(false) when close is triggered from modal", () => {
    render(<StatsModal />);

    const closeBtn = screen.getByRole("button", { name: "Закрыть" });
    fireEvent.click(closeBtn);

    expect(mockSetStatsModalOpen).toHaveBeenCalledWith(false);
  });
});
