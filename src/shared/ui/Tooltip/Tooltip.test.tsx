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
});
