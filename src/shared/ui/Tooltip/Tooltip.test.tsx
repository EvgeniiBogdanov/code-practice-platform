import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens on hover after delay and closes on unhover", () => {
    render(
      <Tooltip.Provider delayDuration={200}>
        <Tooltip content="Текст подсказки">
          <button type="button">Кнопка</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Кнопка" });

    // Hover button
    fireEvent.mouseEnter(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // Advance timer past delayDuration
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent("Текст подсказки");

    // Unhover button
    fireEvent.mouseLeave(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes immediately on window blur or tab switch", () => {
    render(
      <Tooltip.Provider delayDuration={100}>
        <Tooltip content="Текст подсказки">
          <button type="button">Кнопка</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Кнопка" });

    // Open tooltip
    fireEvent.mouseEnter(button);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Window loses focus / user switches tab
    act(() => {
      window.dispatchEvent(new Event("blur"));
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes when Escape key is pressed", () => {
    render(
      <Tooltip.Provider delayDuration={100}>
        <Tooltip content="Текст подсказки">
          <button type="button">Кнопка</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Кнопка" });

    // Open tooltip
    fireEvent.mouseEnter(button);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens with default delay and not immediately when used without provider", () => {
    render(
      <Tooltip content="Подсказка по дефолту">
        <button type="button">Кнопка без провайдера</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Кнопка без провайдера" });

    fireEvent.mouseEnter(button);
    // Not open immediately
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // Not open before default delay (at 150ms)
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // Opens after default 300ms
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("strips native title attribute from child trigger to prevent browser tooltip", () => {
    render(
      <Tooltip content="Кастомная подсказка">
        <button type="button" title="Браузерный тултип">
          Кнопка с title
        </button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Кнопка с title" });
    expect(button).not.toHaveAttribute("title");
  });

  it("does not open tooltip when TooltipProvider is disabled", () => {
    render(
      <Tooltip.Provider disabled delayDuration={100}>
        <Tooltip content="Подсказка отключена">
          <button type="button">Кнопка</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Кнопка" });
    fireEvent.mouseEnter(button);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("inherits disabled status in nested Tooltip.Provider", () => {
    render(
      <Tooltip.Provider disabled delayDuration={100}>
        <Tooltip.Provider delayDuration={50}>
          <Tooltip content="Вложенный тултип">
            <button type="button">Вложенная кнопка</button>
          </Tooltip>
        </Tooltip.Provider>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Вложенная кнопка" });
    fireEvent.mouseEnter(button);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes open tooltip if disabled becomes true", () => {
    const { rerender } = render(
      <Tooltip.Provider disabled={false} delayDuration={100}>
        <Tooltip content="Динамическая подсказка">
          <button type="button">Кнопка</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    const button = screen.getByRole("button", { name: "Кнопка" });
    fireEvent.mouseEnter(button);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Disable provider
    rerender(
      <Tooltip.Provider disabled={true} delayDuration={100}>
        <Tooltip content="Динамическая подсказка">
          <button type="button">Кнопка</button>
        </Tooltip>
      </Tooltip.Provider>
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
