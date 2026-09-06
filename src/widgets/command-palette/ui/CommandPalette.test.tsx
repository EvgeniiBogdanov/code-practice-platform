import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandPalette } from "./CommandPalette";
import { useCommandPalette } from "../model";

vi.mock("../model", () => ({
  useCommandPalette: vi.fn(),
}));

describe("CommandPalette", () => {
  const setQueryMock = vi.fn();
  const setIsOpenMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when isOpen is false", () => {
    vi.mocked(useCommandPalette).mockReturnValue({
      isOpen: false,
      setIsOpen: setIsOpenMock,
      query: "",
      setQuery: setQueryMock,
      debouncedQuery: "",
      activeSection: "all",
      setActiveSection: vi.fn(),
      selectedIndex: 0,
      setSelectedIndex: vi.fn(),
      filteredTasks: [],
      isLoading: false,
      handleSelectTask: vi.fn(),
      handleKeyDown: vi.fn(),
    });

    const { container } = render(<CommandPalette />);
    expect(container.firstChild).toBeNull();
  });

  it("renders custom Input and triggers onChange when open", () => {
    vi.mocked(useCommandPalette).mockReturnValue({
      isOpen: true,
      setIsOpen: setIsOpenMock,
      query: "",
      setQuery: setQueryMock,
      debouncedQuery: "",
      activeSection: "all",
      setActiveSection: vi.fn(),
      selectedIndex: 0,
      setSelectedIndex: vi.fn(),
      filteredTasks: [],
      isLoading: false,
      handleSelectTask: vi.fn(),
      handleKeyDown: vi.fn(),
    });

    render(<CommandPalette />);

    const inputEl = screen.getByPlaceholderText("Поиск задачи...");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl.className).toMatch(/variant-default/);
    expect(inputEl.className).toMatch(/size-lg/);

    fireEvent.change(inputEl, { target: { value: "useEffect" } });
    expect(setQueryMock).toHaveBeenCalledWith("useEffect");
  });
});
