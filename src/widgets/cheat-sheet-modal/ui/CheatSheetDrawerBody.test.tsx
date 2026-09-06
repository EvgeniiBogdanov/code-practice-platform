import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CheatSheetDrawerBody } from "./CheatSheetDrawerBody";
import { useCheatSheetData } from "../model/useCheatSheetData";
import { useUIStore } from "@/entities/ui-state";

vi.mock("../model/useCheatSheetData", () => ({
  useCheatSheetData: vi.fn(),
}));

describe("CheatSheetDrawerBody", () => {
  const onCloseMock = vi.fn();
  const drawerRef = React.createRef<HTMLDivElement>();

  beforeEach(() => {
    vi.clearAllMocks();
    useUIStore.setState({ cheatSearch: "" });
    vi.mocked(useCheatSheetData).mockReturnValue({
      activeSection: "react",
      activeCategory: "all",
      currentSectionConfig: {
        title: "React",
        categories: [],
      },
      filteredData: [],
      handleSelectSection: vi.fn(),
      setActiveCategory: vi.fn(),
    });
  });

  it("renders custom Input and responds to user input", () => {
    render(<CheatSheetDrawerBody drawerRef={drawerRef} onClose={onCloseMock} />);

    const inputEl = screen.getByPlaceholderText("Поиск по методам, типам, паттернам...");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl.className).toMatch(/size-lg/);

    fireEvent.change(inputEl, { target: { value: "useMemo" } });
    expect(useUIStore.getState().cheatSearch).toBe("useMemo");
  });
});
